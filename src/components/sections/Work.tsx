"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import MiniUI from "../ui/MiniUI";
import SectionHead from "../ui/SectionHead";
import TechLogo, { hasLogo } from "../ui/TechLogo";

const css = `@layer components{
.wk-track{display:flex;flex-direction:column;gap:10px;margin-top:56px}
.wk-panel{position:relative;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;transition:flex .8s var(--ease),box-shadow .6s var(--ease)}
.wk-panel[data-open="true"]{box-shadow:inset 0 0 0 1px var(--line),0 30px 70px -40px rgba(13,13,13,.3)}
.wk-spine{display:flex;align-items:center;gap:14px;width:100%;height:64px;padding:0 20px;text-align:left}
.wk-spine .no{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.wk-spine .tt{font-weight:600;letter-spacing:-.02em;flex:1}
.wk-plus{width:30px;height:30px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;font-size:16px;line-height:1;transition:transform .6s var(--ease),background .4s,color .4s}
.wk-spine:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.wk-panel[data-open="true"] .wk-plus{transform:rotate(45deg)}
.wk-wrap{display:grid;grid-template-rows:0fr;transition:grid-template-rows .8s var(--ease)}
.wk-panel[data-open="true"] .wk-wrap{grid-template-rows:1fr}
.wk-wrap>div{overflow:hidden;min-height:0}
.wk-body{display:grid;gap:28px;padding:6px 22px 24px}
.wk-kick{font-family:var(--font-mono);font-size:12px;color:var(--mute);margin-bottom:12px}
.wk-body h3{font-size:clamp(30px,3.4vw,52px);margin-bottom:16px}
.wk-desc{color:var(--ink-2);font-size:15px;line-height:1.55;max-width:56ch}
.wk-feat{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:1fr;gap:8px 24px;font-size:14px}
.wk-feat li{padding-left:16px;position:relative;line-height:1.35}
.wk-feat li::before{content:"";position:absolute;left:0;top:.65em;width:7px;height:1px;background:var(--ink)}
.wk-tech{display:flex;flex-wrap:wrap;gap:6px;margin-top:22px;padding:0;list-style:none}
.wk-tech li{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px 0 9px;border-radius:99px;box-shadow:inset 0 0 0 1px var(--line);font-size:12px;font-weight:500}
.wk-tech li:not(:has(.tl)){padding-left:11px}
.wk-art{position:relative;min-height:240px}
.wk-label{position:absolute;top:-2px;right:6px;font-family:var(--font-mono);font-size:10px;color:var(--faint);z-index:1}
.wk-art .mu{clip-path:inset(0 100% 0 0 round 20px);transition:clip-path 1s var(--ease) .15s}
.wk-panel[data-open="true"] .wk-art .mu{clip-path:inset(0 0 0 0 round 20px)}
@media(min-width:900px){
.wk-track{flex-direction:row;height:min(78svh,640px)}
.wk-panel{flex:0 0 68px;min-width:0}
.wk-panel[data-open="true"]{flex:1 1 68px}
.wk-spine{flex-direction:column;height:100%;width:68px;padding:22px 0;justify-content:space-between;align-items:center;position:absolute;left:0;top:0;transition:opacity .4s var(--ease)}
.wk-spine .tt{writing-mode:vertical-rl;transform:rotate(180deg);flex:0 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:calc(100% - 120px)}
.wk-spine .no{order:-1}
.wk-panel[data-open="true"] .wk-spine{opacity:0;pointer-events:none}
.wk-wrap{display:block;height:100%}
.wk-wrap>div{height:100%;min-width:760px}
.wk-body{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);height:100%;padding:36px 32px 32px 36px;align-content:center;opacity:0;transition:opacity .5s var(--ease)}
.wk-panel[data-open="true"] .wk-body{opacity:1;transition-delay:.35s}
.wk-feat{grid-template-columns:1fr 1fr}
.wk-art{min-height:0}
}
}`;

export default function Work() {
  const [open, setOpen] = useState(0);
  const hoverable = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 900px)").matches;

  return (
    <section id="work" className="sec" aria-labelledby="work-title">
      <style>{css}</style>
      <div className="wrap">
        <div id="work-title">
          <SectionHead index="03" label="Selected work" lines={["Things I've"]} accent="built." />
        </div>
        <div className="wk-track">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className="wk-panel"
                data-open={isOpen}
                onMouseEnter={() => hoverable() && setOpen(i)}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-${p.id}`}
                  onClick={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                >
                  <span className="no">{p.index}</span>
                  <span className="tt">{p.title}</span>
                  <span className="wk-plus" aria-hidden="true">+</span>
                </button>
                <div className="wk-wrap" id={`wk-${p.id}`} role="region" aria-label={p.title} inert={!isOpen}>
                  <div>
                    <div className="wk-body">
                      <div>
                        <p className="wk-kick">{p.index} — {p.kicker}</p>
                        <h3>{p.title}</h3>
                        <p className="wk-desc">{p.description}</p>
                        <ul className="wk-feat">
                          {p.features.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                        <ul className="wk-tech" aria-label="Tech stack">
                          {p.tech.slice(0, 8).map((t) => (
                            <li key={t}>{hasLogo(t) && <TechLogo name={t} size={14} />}{t}</li>
                          ))}
                        </ul>
                        {p.github && (
                          <p style={{ marginTop: 22 }}>
                            <a className="btn btn-ink" href={p.github} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>
                          </p>
                        )}
                      </div>
                      <div className="wk-art">
                        <span className="wk-label">Illustrative UI</span>
                        <MiniUI kind={p.ui} />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
