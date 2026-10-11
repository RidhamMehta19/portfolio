"use client";

import { type MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const css = `@layer components{
.nav-progress{position:fixed;inset:0 0 auto 0;height:2px;z-index:70;pointer-events:none}
.nav-progress>div{height:100%;background:var(--ink);transform:scaleX(0);transform-origin:0 50%}
.nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:16px var(--gutter);pointer-events:none}
.nav>*{pointer-events:auto}
.nav-brand{display:flex;align-items:center;gap:12px}
.nav-mark{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:700;letter-spacing:-.02em;box-shadow:inset 0 0 0 1.5px var(--ink);transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.nav-name{font-weight:600;letter-spacing:-.02em;transition:opacity .4s var(--ease),transform .4s var(--ease)}
.nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-pill{position:relative;display:none;padding:4px;border-radius:999px;transition:background .4s var(--ease),box-shadow .4s var(--ease),backdrop-filter .4s}
.nav.is-scrolled .nav-pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 8px 30px rgba(13,13,13,.06)}
.nav-pill ul{display:flex;list-style:none;margin:0;padding:0;position:relative}
.nav-ind{position:absolute;top:4px;bottom:4px;left:0;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s;opacity:0}
.nav-link{position:relative;z-index:1;display:block;padding:9px 18px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .4s var(--ease)}
.nav-link:hover{color:var(--ink)}
.nav-link[aria-current="true"]{color:#fff}
.nav-menu{height:42px;padding:0 20px;border-radius:999px;font-size:14px;font-weight:600;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line)}
@media(min-width:820px){.nav-pill{display:block}.nav-menu{display:none}}
.menu{position:fixed;inset:0;z-index:80;background:var(--paper);display:flex;flex-direction:column;justify-content:center;padding:var(--gutter);clip-path:circle(0% at calc(100% - 56px) 38px);transition:clip-path .8s var(--ease);visibility:hidden}
.menu.is-open{clip-path:circle(150% at calc(100% - 56px) 38px);visibility:visible}
.menu-close{position:absolute;top:16px;right:var(--gutter);height:42px;padding:0 20px;border-radius:999px;font-size:14px;font-weight:600;box-shadow:inset 0 0 0 1px var(--line)}
.menu ol{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.menu a{display:flex;align-items:baseline;gap:16px;font-size:clamp(40px,12vw,72px);font-weight:700;letter-spacing:-.045em;line-height:1.05;opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease) calc(.15s + var(--i)*70ms),transform .7s var(--ease) calc(.15s + var(--i)*70ms)}
.menu.is-open a{opacity:1;transform:none}
.menu a small{font-family:var(--font-mono);font-size:12px;font-weight:400;color:var(--mute);letter-spacing:0}
}`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const els = ["top", ...NAV.map((n) => n.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "top" ? "" : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const measure = useCallback(() => {
    const el = active ? links.current[active] : null;
    setInd(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [active]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(`#${id}`), open ? 50 : 0);
  };

  return (
    <>
      <style>{css}</style>
      <div className="nav-progress" aria-hidden="true">
        <div ref={bar} />
      </div>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <a className="nav-brand" href="#top" onClick={go("top")} aria-label={`${PROFILE.shortName} — back to top`}>
          <span className="nav-mark" aria-hidden="true">{PROFILE.initials}</span>
          <span className="nav-name">{PROFILE.shortName}</span>
        </a>
        <nav className="nav-pill" aria-label="Primary">
          <span
            className="nav-ind"
            aria-hidden="true"
            style={ind ? { width: ind.w, transform: `translateX(${ind.x}px)`, opacity: 1 } : undefined}
          />
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  ref={(el) => { links.current[n.id] = el; }}
                  className="nav-link"
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "true" : undefined}
                  onClick={go(n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button className="nav-menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>
          Menu
        </button>
      </header>
      <div id="menu" className={`menu${open ? " is-open" : ""}`} inert={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <button ref={closeBtn} className="menu-close" onClick={() => setOpen(false)}>Close</button>
        <nav aria-label="Mobile">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`} style={{ "--i": i } as React.CSSProperties} onClick={go(n.id)}>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </>
  );
}
