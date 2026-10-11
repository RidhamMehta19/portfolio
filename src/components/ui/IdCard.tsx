"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { EDUCATION, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const css = `@layer components{
.idc{position:relative;height:calc(var(--sec-pad) + 470px);width:100%}
.idc-swing{position:absolute;top:0;left:50%;width:300px;margin-left:-150px;transform-origin:50% 0;will-change:transform}
.idc-strap{position:relative;width:30px;height:calc(var(--sec-pad) + 56px);margin:0 auto;background:var(--ink);overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.idc-strap-track{position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;align-items:center;gap:18px;animation:strap 14s linear infinite}
.idc-strap-track span{writing-mode:vertical-rl;color:#fff;font-size:9px;font-weight:600;letter-spacing:.14em;white-space:nowrap}
@keyframes strap{to{transform:translateY(-50%)}}
.idc-clip{position:relative;z-index:2;width:22px;height:34px;margin:-2px auto -14px;border-radius:5px 5px 8px 8px;background:linear-gradient(90deg,#8a8a8a,#e8e8e8 45%,#a5a5a5);box-shadow:0 2px 6px rgba(13,13,13,.25)}
.idc-clip::after{content:"";position:absolute;left:50%;bottom:6px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1px rgba(13,13,13,.25)}
.idc-flip{display:block;width:300px;height:404px;perspective:1200px;border-radius:26px;margin-top:0}
.idc-inner{position:relative;display:block;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
.idc-flip[data-flipped="true"] .idc-inner{transform:rotateY(180deg)}
.idc-face{position:absolute;inset:0;display:flex;flex-direction:column;border-radius:26px;background:var(--card);overflow:hidden;-webkit-backface-visibility:hidden;backface-visibility:hidden;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -30px rgba(13,13,13,.35);text-align:left}
.idc-back{transform:rotateY(180deg);padding:26px 24px}
.idc-band{height:46px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;letter-spacing:.32em;position:relative}
.idc-band::before{content:"";position:absolute;top:10px;left:50%;width:44px;height:7px;margin-left:-22px;border-radius:99px;background:rgba(255,255,255,.18)}
.idc-photo{position:relative;margin:20px auto 0;width:134px;height:162px;padding:3px;border-radius:26px;background:linear-gradient(160deg,#d8d6d1,#8d8b86 55%,#e9e6e0)}
.idc-photo::before{content:"";position:absolute;inset:-14px;border-radius:40px;background:radial-gradient(closest-side,rgba(13,13,13,.1),transparent);z-index:-1}
.idc-photo>span{display:block;width:100%;height:100%;border-radius:23px;overflow:hidden;background:#fff}
.idc-photo img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
.idc-flip:hover .idc-photo img{transform:scale(1.08)}
.idc-name{margin-top:14px;text-align:center;font-size:22px;font-weight:700;letter-spacing:-.04em}
.idc-role{text-align:center;font-family:var(--font-mono);font-size:10.5px;color:var(--mute);margin-top:3px}
.idc-rows{margin:12px 22px 0;display:grid;gap:4px;font-size:11.5px}
.idc-rows span{display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed var(--line);padding-bottom:3px}
.idc-rows b{font-family:var(--font-mono);font-weight:400;color:var(--mute);font-size:10px}
.idc-foot{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;padding:0 22px 16px}
.idc-holo{width:38px;height:38px;border-radius:50%;background:conic-gradient(#f2f2f2,#9a9a9a,#fafafa,#6f6f6f,#e4e4e4,#a8a8a8,#f2f2f2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.15)}
.idc-back h3{font-size:22px;margin-bottom:14px}
.idc-back ul{list-style:none;margin:0;padding:0;display:grid;gap:9px;font-size:13px;line-height:1.35;color:var(--ink-2)}
.idc-back li{padding-left:14px;position:relative}
.idc-back li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1px;background:var(--ink)}
.idc-sign{margin-top:auto;font-family:var(--font-serif);font-style:italic;font-size:30px;color:var(--ink)}
.idc-found{font-family:var(--font-mono);font-size:9.5px;color:var(--mute);margin-top:6px;overflow-wrap:anywhere}
@media(max-width:480px){.idc-swing{transform-origin:50% 0}}
}`;

function barcode(seed: string): number[] {
  let h = 2166136261;
  const out: number[] = [];
  for (let i = 0; i < 38; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i;
    h = Math.imul(h, 16777619) >>> 0;
    out.push(1 + (h % 3));
  }
  return out;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function IdCard() {
  const root = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, t: 0, type: "key" });
  const phys = useRef({ a: 0, w: 0 });
  const [flipped, setFlipped] = useState(false);

  const bars = useMemo(() => barcode(PROFILE.name), []);
  const strapText = `${PROFILE.shortName.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `;

  useEffect(() => {
    const el = swing.current;
    const host = root.current;
    if (!el || !host || prefersReducedMotion()) return;
    const s = phys.current;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const idle = Math.sin(now / 1100) * 0.9 + Math.sin(now / 1700) * 0.5;
      s.w += (-38 * (s.a - idle) - 3.2 * s.w) * dt;
      s.a = clamp(s.a + s.w * dt, -22, 22);
      el.style.transform = `rotate(${s.a.toFixed(3)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(host);

    const onMove = (e: PointerEvent) => {
      const p = pointer.current;
      const dt = Math.max(8, e.timeStamp - p.t);
      const vx = ((e.clientX - p.x) / dt) * 1000;
      p.x = e.clientX;
      p.t = e.timeStamp;
      s.w -= clamp(vx * 0.02, -40, 40);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="idc" ref={root}>
      <style>{css}</style>
      <div className="idc-swing" ref={swing}>
        <div className="idc-strap" aria-hidden="true">
          <div className="idc-strap-track">
            {[0, 1, 2, 3].map((n) => (
              <span key={n}>{strapText}</span>
            ))}
            {[0, 1, 2, 3].map((n) => (
              <span key={`b${n}`}>{strapText}</span>
            ))}
          </div>
        </div>
        <div className="idc-clip" aria-hidden="true" />
        <button
          type="button"
          className="idc-flip"
          data-flipped={flipped}
          aria-pressed={flipped}
          aria-label={`${PROFILE.shortName} developer ID card. Activate to flip.`}
          onPointerDown={(e) => { pointer.current.type = e.pointerType; }}
          onKeyDown={() => { pointer.current.type = "key"; }}
          onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
          onClick={() => { if (pointer.current.type !== "mouse") setFlipped((f) => !f); }}
        >
          <span className="idc-inner">
            <span className="idc-face">
              <span className="idc-band">DEVELOPER ID</span>
              <span className="idc-photo">
                <span>
                  <Image src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.shortName}`} width={128} height={156} priority={false} />
                </span>
              </span>
              <span className="idc-name">{PROFILE.shortName}</span>
              <span className="idc-role">{PROFILE.role}</span>
              <span className="idc-rows">
                <span><b>Dept.</b>Computer Science &amp; Eng.</span>
                <span><b>Batch</b>{EDUCATION[0]?.period}</span>
                <span><b>Base</b>Surat, Gujarat</span>
              </span>
              <span className="idc-foot">
                <svg width="150" height="34" viewBox="0 0 76 17" aria-hidden="true" fill="#0d0d0d">
                  {bars.reduce<{ x: number; els: React.ReactNode[] }>(
                    (acc, w, i) => {
                      if (i % 2 === 0) acc.els.push(<rect key={i} x={acc.x} y="0" width={w * 0.6} height="17" />);
                      acc.x += w * 0.6;
                      return acc;
                    },
                    { x: 0, els: [] },
                  ).els}
                </svg>
                <span className="idc-holo" aria-hidden="true" />
              </span>
            </span>
            <span className="idc-face idc-back">
              <h3>What I am</h3>
              <ul>
                <li>{PROFILE.role} · {PROFILE.stackLine}</li>
                <li>B.E. Computer Science and Engineering, GTU Ahmedabad</li>
                <li>Approximately 2.9 years delivering end-to-end features</li>
                <li>Led a 4-engineer team on PartsPlex</li>
                <li>Products serving 150+ franchise operators and 10,000+ residents</li>
              </ul>
              <span className="idc-sign">{PROFILE.shortName}</span>
              <span className="idc-found">If found, say hello · {PROFILE.email}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
