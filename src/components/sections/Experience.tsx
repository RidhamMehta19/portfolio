"use client";

import { useEffect, useRef, useState } from "react";
import { TIMELINE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

const css = `@layer components{
.tlx{position:relative;margin-top:64px;padding-left:34px}
.tlx-spine{position:absolute;left:5px;top:6px;bottom:6px;width:1px;background:var(--line)}
.tlx-spine i{position:absolute;inset:0;background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p,0));will-change:transform}
.stop{position:relative;padding-bottom:clamp(40px,7vw,72px);max-width:760px}
.stop::before{content:"";position:absolute;left:-34px;top:8px;width:11px;height:11px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1px var(--faint);transition:background .5s var(--ease),box-shadow .5s var(--ease),transform .6s var(--ease)}
.stop.lit::before{background:var(--ink);box-shadow:0 0 0 5px rgba(13,13,13,.08);transform:scale(1.15)}
.stop-when{font-family:var(--font-mono);font-size:12px;color:var(--mute);margin-bottom:10px;display:flex;gap:10px}
.stop h3{font-size:clamp(26px,3.6vw,48px);color:var(--faint);transition:color .6s var(--ease)}
.stop.lit h3{color:var(--ink)}
.stop-place{margin:10px 0 0;color:var(--ink-2);font-size:15px;line-height:1.4}
.stop-detail{margin:14px 0 0;color:var(--mute);font-size:15px;line-height:1.55;max-width:58ch}
.stop-stack{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 0;padding:0;list-style:none}
.stop-stack li{height:26px;padding:0 11px;border-radius:99px;box-shadow:inset 0 0 0 1px var(--line);display:inline-flex;align-items:center;font-size:12px;font-weight:500}
.next{max-width:760px;padding:26px 28px;border-radius:24px;border:1.5px dashed var(--faint);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px}
.next h3{font-size:clamp(24px,3vw,36px)}
}`;

export default function Experience() {
  const list = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(list, 0.6);
  const [lit, setLit] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    const els = list.current?.querySelectorAll<HTMLElement>("[data-stop]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset.stop ?? "");
        if (hit.length) setLit((prev) => new Set([...prev, ...hit]));
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" className="sec" aria-labelledby="exp-title">
      <style>{css}</style>
      <div className="wrap">
        <div id="exp-title">
          <SectionHead index="04" label="Education & experience" lines={["The path"]} accent="so far." />
        </div>
        <div className="tlx" ref={list} style={{ "--p": p } as React.CSSProperties}>
          <div className="tlx-spine" aria-hidden="true"><i /></div>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {TIMELINE.map((s) => (
              <li key={s.id} data-stop={s.id} className={`stop${lit.has(s.id) ? " lit" : ""}`}>
                <p className="stop-when"><span>{s.when}</span><span>{s.kind}</span></p>
                <h3>{s.title}</h3>
                <p className="stop-place">{s.place}</p>
                <p className="stop-detail">{s.detail}</p>
                {s.stack.length > 0 && (
                  <ul className="stop-stack" aria-label="Tech stack">
                    {s.stack.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ol>
          <div className="next rv">
            <h3>Next — Your team<span className="acc">?</span></h3>
            <a className="btn btn-ink" href="#contact">Say hello</a>
          </div>
        </div>
      </div>
    </section>
  );
}
