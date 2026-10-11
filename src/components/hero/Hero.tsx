"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

const css = `@layer components{
.hero{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;padding-top:72px}
.hero-ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);z-index:0;pointer-events:none;user-select:none;white-space:nowrap;font-weight:800;letter-spacing:-.05em;line-height:.8;font-size:clamp(120px,27vw,420px);color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.13)}
.hero-grid{display:grid;grid-template-columns:1fr;gap:20px;justify-items:center;align-items:center}
.hero-stage{position:relative;order:-1}
.hero-video{position:relative;z-index:1;height:62svh;aspect-ratio:1/2;width:auto;mix-blend-mode:multiply;object-fit:cover}
.hero-copy,.hero-cta{position:relative;z-index:2}
.hero-copy{text-align:center}
.hero-copy h1{font-size:clamp(44px,12vw,72px)}
.hero-copy p{margin:18px auto 0;max-width:34ch;color:var(--mute);font-size:16px;line-height:1.45}
.hero-cta{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.sound{z-index:3;position:absolute;right:-6px;bottom:7%;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:transform .5s var(--ease),background .4s var(--ease)}
.sound:hover{transform:scale(1.08);background:var(--ink-2)}
.sound svg{width:16px;height:16px;fill:currentColor}
.sound .ping{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(13,13,13,.35);animation:ping 2s var(--ease) infinite;pointer-events:none}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(13,13,13,.35)}80%,100%{box-shadow:0 0 0 18px rgba(13,13,13,0)}}
@media(min-width:960px){
.hero-grid{grid-template-columns:1fr auto 1fr;gap:clamp(16px,3vw,48px);align-items:end}
.hero-stage{order:0}
.hero-video{height:min(96svh,1040px)}
.hero-copy{text-align:left;align-self:center;padding-bottom:6vh}
.hero-copy h1{font-size:clamp(52px,5.4vw,92px)}
.hero-copy h1 .rv-mask>span{white-space:nowrap}
.hero-copy p{margin-left:0}
.hero-cta{flex-direction:column;align-items:flex-start;align-self:center;justify-content:flex-start;padding-bottom:6vh}
.sound{right:8%}
}
}`;

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 2.2v11.6a.6.6 0 0 0 .9.5l9.2-5.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5Z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3" y="2" width="3.4" height="12" rx="1" />
      <rect x="9.6" y="2" width="3.4" height="12" rx="1" />
    </svg>
  );
}

export default function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const visible = useRef(true);
  const reduced = useRef(false);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const tryPlay = useCallback(async (withSound: boolean): Promise<boolean> => {
    const v = video.current;
    if (!v) return false;
    v.muted = !withSound;
    try {
      await v.play();
      setSoundOn(withSound);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    reduced.current = prefersReducedMotion();
    let unlocked = false;

    const unlock = (e: Event) => {
      if (unlocked || reduced.current) return;
      if ((e.target as Element | null)?.closest?.("[data-sound-btn]")) return;
      unlocked = true;
      void tryPlay(true).then((ok) => ok && setBlocked(false));
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchend", unlock);
    };

    if (!reduced.current) {
      void tryPlay(true).then(async (ok) => {
        if (ok) return;
        setBlocked(true);
        await tryPlay(false);
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
        window.addEventListener("touchend", unlock, { once: true });
      });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        visible.current = entry.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (!reduced.current && !document.hidden && v.paused) void v.play().catch(() => undefined);
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(v);

    const onVis = () => {
      if (document.hidden) v.pause();
      else if (visible.current && !reduced.current) void v.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cleanup();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [tryPlay]);

  const toggleSound = async () => {
    const v = video.current;
    if (!v) return;
    if (soundOn && !v.paused) {
      v.muted = true;
      setSoundOn(false);
      return;
    }
    if (await tryPlay(true)) setBlocked(false);
  };

  return (
    <section id="top" className="hero" aria-label="Introduction">
      <style>{css}</style>
      <div className="hero-ghost" aria-hidden="true">{PROFILE.firstName.toUpperCase()}</div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>
            <span className="sr-only">{PROFILE.shortName}, </span>
            <span className="rv-mask"><span>Full-Stack</span></span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}><span>Software</span></span>
            <span className="rv-mask" style={{ "--i": 2 } as React.CSSProperties}><span>Engineer.</span></span>
          </h1>
          <p className="rv" style={{ "--i": 4 } as React.CSSProperties}>
            {PROFILE.stackLine}. Payment, industrial and government platforms, built end to end.
          </p>
        </div>

        <div className="hero-stage">
          <video
            ref={video}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            aria-label={`${PROFILE.shortName} introducing himself`}
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            className="sound"
            data-sound-btn
            onClick={() => void toggleSound()}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute intro" : "Play intro with sound"}
          >
            {blocked && !soundOn && <span className="ping" aria-hidden="true" />}
            {soundOn ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        <div className="hero-cta rv" style={{ "--i": 5 } as React.CSSProperties}>
          <a className="btn btn-ink" href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget("#work"); }}>
            Explore work
          </a>
          <a className="btn btn-line" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}>
            Let&apos;s talk
          </a>
          <a className="btn btn-line" href={PROFILE.resume} download>
            Résumé ↓
          </a>
        </div>
      </div>
    </section>
  );
}
