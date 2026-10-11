#!/usr/bin/env python3
"""Build seamless hero loop (mp4 + webm), portrait still and OG image.

Usage: python3 scripts/build-hero-assets.py <intro.mp4> [--crop W:H:X:Y] [--photo photo.jpg]
Requires: ffmpeg (libx264, libvpx-vp9, libopus), numpy, Pillow.
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT_HERO = ROOT / "public" / "hero"
OUT_PUB = ROOT / "public"
XF = 0.5          # cross-fade seconds
MAX_LEN = 10.0    # seconds of source used
SR = 48000
OUT_W = 540       # delivery width (crop keeps source aspect)


def run(cmd: list[str]) -> None:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(cmd)}\n{r.stderr[-1500:]}")


def probe_duration(src: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(src)],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def build_audio(src: Path, length: float, tmp: Path) -> Path:
    raw = tmp / "a.wav"
    run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-t", f"{length}", "-vn",
         "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", str(raw)])
    with wave.open(str(raw)) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64)
    n = int(length * SR)
    x = np.pad(x, (0, max(0, n - len(x))))[:n]
    k = int(XF * SR)
    head, tail, body = x[:k], x[n - k:], x[k:n - k]
    t = np.linspace(0.0, np.pi / 2, k)               # equal-power cross-fade
    seam = tail * np.cos(t) + head * np.sin(t)
    y = np.concatenate([seam, body])                   # length = n - k
    y = np.clip(y, -32768, 32767).astype(np.int16)
    out = tmp / "loop.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
    return out


def build_video(src: Path, length: float, crop: str, tmp: Path) -> Path:
    cw, ch, cx, cy = crop.split(":")
    oh = int(round(OUT_W * int(ch) / int(cw) / 2)) * 2
    pre = (f"crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{oh}:flags=lanczos,"
           "colorlevels=rimax=0.91:gimax=0.91:bimax=0.91,fps=24,format=yuv420p")
    fc = (
        f"[0:v]trim=0:{length},setpts=PTS-STARTPTS,{pre},split=3[a][b][c];"
        f"[a]trim={length - XF}:{length},setpts=PTS-STARTPTS[tail];"
        f"[b]trim=0:{XF},setpts=PTS-STARTPTS[head];"
        f"[c]trim={XF}:{length - XF},setpts=PTS-STARTPTS[body];"
        f"[tail][head]xfade=transition=fade:duration={XF}:offset=0[seam];"
        f"[seam][body]concat=n=2:v=1:a=0[v]"
    )
    out = tmp / "loop.mkv"
    run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-filter_complex", fc,
         "-map", "[v]", "-c:v", "ffv1", str(out)])
    return out


def encode(video: Path, audio: Path) -> None:
    OUT_HERO.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-v", "error", "-i", str(video), "-i", str(audio),
         "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
         str(OUT_HERO / "hero.mp4")])
    run(["ffmpeg", "-y", "-v", "error", "-i", str(video), "-i", str(audio),
         "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
         "-c:a", "libopus", "-b:a", "80k", "-shortest", str(OUT_HERO / "hero.webm")])


def poster_frame(src: Path, tmp: Path, t: float) -> Path:
    f = tmp / "frame.png"
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t}", "-i", str(src), "-frames:v", "1", str(f)])
    return f


def portrait(img_path: Path, box: tuple[int, int, int, int] | None) -> Image.Image:
    im = Image.open(img_path).convert("RGB")
    if box:
        im = im.crop(box)
    else:  # head-to-shirt: 4:5 crop, upper third of a centred person
        w, h = im.size
        cw = int(w * 0.62); chh = int(cw * 1.25)
        x = (w - cw) // 2; y = int(h * 0.02)
        im = im.crop((x, y, x + cw, y + chh))
    return im.resize((480, 600), Image.LANCZOS)


def og(bust: Image.Image, name: str, role: str) -> None:
    W, H = 1200, 630
    bg = Image.new("RGB", (W, H), (244, 242, 238))
    d = ImageDraw.Draw(bg)
    h = H - 60
    b = bust.resize((int(480 * h / 600), h), Image.LANCZOS)
    bg.paste(b, (W - b.width - 60, 30))
    def font(size: int):
        for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                  "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"):
            if Path(p).exists():
                return ImageFont.truetype(p, size)
        return ImageFont.load_default()
    d.text((70, 210), name, font=font(64), fill=(13, 13, 13))
    d.text((70, 310), role, font=font(32), fill=(119, 117, 111))
    bg.save(OUT_PUB / "og.jpg", quality=88)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src", type=Path)
    ap.add_argument("--crop", default="640:1280:40:0", help="W:H:X:Y in source pixels")
    ap.add_argument("--photo", type=Path)
    ap.add_argument("--bust-box", default=None, help="L,T,R,B crop for the portrait still")
    ap.add_argument("--bust-time", type=float, default=4.2)
    ap.add_argument("--name", default="Ridham Mehta")
    ap.add_argument("--role", default="Full-Stack Software Engineer")
    a = ap.parse_args()
    if not a.src.exists() or shutil.which("ffmpeg") is None:
        sys.exit("source video or ffmpeg missing")
    length = min(MAX_LEN, probe_duration(a.src))
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        encode(build_video(a.src, length, a.crop, tmp), build_audio(a.src, length, tmp))
        box = tuple(int(v) for v in a.bust_box.split(",")) if a.bust_box else None
        base = a.photo if a.photo else poster_frame(a.src, tmp, a.bust_time)
        bust = portrait(base, box)
        bust.save(OUT_PUB / "portrait-bust.webp", quality=90)
        og(bust, a.name, a.role)
    print("done:", OUT_HERO / "hero.mp4", OUT_HERO / "hero.webm")


if __name__ == "__main__":
    main()
