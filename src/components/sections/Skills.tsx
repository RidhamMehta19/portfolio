"use client";

import { useEffect, useMemo, useState } from "react";
import { FAMILIES, SKILLS, type Skill, usedIn } from "@/lib/data";
import { useInView, useMediaQuery } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { BRAND, hasLogo } from "../ui/TechLogo";

const css = `@layer components{
.sk-top{display:flex;flex-direction:column;gap:28px;margin-bottom:48px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{height:36px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);transition:background .4s var(--ease),color .4s var(--ease)}
.chip:hover{box-shadow:inset 0 0 0 1px var(--ink)}
.chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.sk-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:28px;align-items:start}
.pt{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.tile{position:relative;aspect-ratio:1/1.08;border-radius:16px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:8px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;opacity:0;transform:translateY(16px) scale(.96);transition:opacity .7s var(--ease),transform .7s var(--ease),background .35s var(--ease),color .35s var(--ease),box-shadow .35s}
.pt.in .tile{opacity:1;transform:none}
.pt.in .tile[data-dim="true"]{opacity:.18}
.tile:hover,.tile[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.tile .n{font-family:var(--font-mono);font-size:9px;color:var(--mute)}
.tile:hover .n,.tile[aria-pressed="true"] .n,.tile:hover .f,.tile[aria-pressed="true"] .f{color:rgba(255,255,255,.6)}
.tile .s{font-size:clamp(22px,2.4vw,34px);font-weight:700;letter-spacing:-.05em;line-height:1}
.tile .nm{font-size:clamp(9px,.9vw,11.5px);font-weight:500;line-height:1.1;overflow-wrap:anywhere}
.tile .f{font-family:var(--font-mono);font-size:8px;color:var(--faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.insp{padding:28px;display:flex;flex-direction:column;gap:18px;min-height:420px}
.insp-logo{height:170px;display:grid;place-items:center;position:relative}
.insp-logo::before{content:"";position:absolute;inset:10px;border-radius:50%;background:radial-gradient(closest-side,var(--glow,rgba(13,13,13,.05)),transparent);}
.insp-logo>*{animation:pop .6s var(--ease)}
@keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
.insp h3{font-size:30px}
.insp .fam{font-family:var(--font-mono);font-size:12px;color:var(--mute);margin-top:6px}
.insp h4{font-family:var(--font-mono);font-size:11px;font-weight:400;letter-spacing:0;color:var(--mute);margin-bottom:8px}
.insp ul{margin:0;padding:0;list-style:none;display:grid;gap:6px;font-size:14px;line-height:1.35}
.insp li{padding-left:14px;position:relative}
.insp li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:1px;background:var(--ink)}
.insp p.none{font-size:14px;color:var(--mute);margin:0}
.tl{display:block}
@media(min-width:768px){.pt{grid-template-columns:repeat(8,minmax(0,1fr));gap:10px}.tile{padding:10px;border-radius:18px}.tile .n{font-size:10px}.tile .f{font-size:9px}}
@media(min-width:1040px){.sk-layout{grid-template-columns:minmax(0,1fr) 320px}.insp{position:sticky;top:110px}}
}`;

export default function Skills() {
  const [family, setFamily] = useState<string | null>(null);
  const [current, setCurrent] = useState<Skill>(SKILLS[0] as Skill);
  const [settled, setSettled] = useState(false);
  const [gridRef, revealed] = useInView<HTMLDivElement>({ threshold: 0.15 });
  const wide = useMediaQuery("(min-width: 768px)", true);
  const cols = wide ? 8 : 4;

  useEffect(() => {
    if (!revealed) return;
    const t = window.setTimeout(() => setSettled(true), 1800);
    return () => window.clearTimeout(t);
  }, [revealed]);

  const uses = useMemo(() => usedIn(current.name), [current]);
  const glow = BRAND[current.name]?.tint;

  return (
    <section id="skills" className="sec" aria-labelledby="skills-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="sk-top">
          <div id="skills-title">
            <SectionHead index="02" label="Skills" lines={["The periodic table", "of my"]} accent="stack." />
          </div>
          <div className="chips rv" role="group" aria-label="Filter skills by family">
            <button type="button" className="chip" aria-pressed={family === null} onClick={() => setFamily(null)}>All</button>
            {FAMILIES.map((f) => (
              <button key={f} type="button" className="chip" aria-pressed={family === f} onClick={() => setFamily(family === f ? null : f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="sk-layout">
          <div ref={gridRef} className={`pt${revealed ? " in" : ""}`} role="group" aria-label="Skills">
            {SKILLS.map((s, i) => {
              const delay = settled ? 0 : (Math.floor(i / cols) + (i % cols)) * 40;
              return (
                <button
                  key={s.name}
                  type="button"
                  className="tile"
                  data-dim={family !== null && family !== s.family}
                  aria-pressed={current.name === s.name}
                  aria-label={`${s.name}, ${s.family}`}
                  style={{ transitionDelay: `${delay}ms, ${delay}ms, 0s, 0s, 0s` }}
                  onMouseEnter={() => setCurrent(s)}
                  onFocus={() => setCurrent(s)}
                  onClick={() => setCurrent(s)}
                >
                  <span className="n">{String(s.number).padStart(2, "0")}</span>
                  <span className="s">{s.symbol}</span>
                  <span>
                    <span className="nm">{s.name}</span>
                    <span className="f" style={{ display: "block" }}>{s.family}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="card insp rv" aria-live="polite" aria-label="Skill details" style={{ "--glow": glow ? `${glow}22` : undefined } as React.CSSProperties}>
            <div className="insp-logo" key={current.name}>
              {hasLogo(current.name) ? (
                <TechLogo name={current.name} size={150} glow />
              ) : (
                <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-.06em" }}>{current.symbol}</span>
              )}
            </div>
            <div>
              <h3>{current.name}</h3>
              <p className="fam">{String(current.number).padStart(2, "0")} · {current.family}</p>
            </div>
            <div>
              <h4>Used in</h4>
              {uses.length ? (
                <ul>
                  {uses.slice(0, 5).map((u) => <li key={u}>{u}</li>)}
                  {uses.length > 5 && <li>+{uses.length - 5} more</li>}
                </ul>
              ) : (
                <p className="none">Listed under Skills in the résumé.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
