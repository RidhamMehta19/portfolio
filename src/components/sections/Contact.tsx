"use client";

import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `@layer components{
.ct{overflow:hidden}
.ct h2{font-size:clamp(44px,9vw,148px);line-height:.95}
.ct h2 .ln{display:block}
.ct h2 .ch{display:inline-block;white-space:pre}
.ct h2 .ch:hover{animation:hop .55s var(--ease)}
.ct h2 .ln:last-child{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute);letter-spacing:-.02em}
@keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}100%{transform:none}}
.ct-mail{margin-top:clamp(36px,6vw,72px);display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.ct-mail a.big{font-size:clamp(22px,4vw,52px);font-weight:600;letter-spacing:-.04em;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.18em;text-decoration-color:var(--faint);overflow-wrap:anywhere;transition:text-decoration-color .4s var(--ease)}
.ct-mail a.big:hover{text-decoration-color:var(--ink)}
.copy{height:34px;padding:0 14px;border-radius:99px;box-shadow:inset 0 0 0 1px var(--line);font-size:13px;font-weight:500;font-family:var(--font-mono);transition:background .4s var(--ease),color .4s var(--ease)}
.copy:hover{background:var(--ink);color:#fff}
.ct-links{margin-top:28px;display:flex;flex-wrap:wrap;gap:10px}
.ct-badge{position:absolute;right:var(--gutter);bottom:var(--sec-pad);width:clamp(96px,11vw,140px);height:auto;animation:spin 18s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.ft{border-top:1px solid var(--line);padding-block:28px}
.ft-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;font-size:13px;color:var(--mute)}
.ft a:hover{color:var(--ink)}
@media(max-width:640px){.ct-badge{display:none}}
}`;

function Letters({ text }: { readonly text: string }) {
  return (
    <span className="ln" aria-hidden="true">
      {Array.from(text).map((c, i) => (
        <span key={i} className="ch">{c}</span>
      ))}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="sec ct" aria-labelledby="contact-title">
      <style>{css}</style>
      <div className="wrap">
        <p className="tag rv"><b>05</b> — Contact</p>
        <h2 id="contact-title" className="rv" aria-label="Let's build something together.">
          <Letters text="Let's build" />
          <Letters text="something together." />
        </h2>
        <div className="ct-mail rv">
          <a className="big" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <button type="button" className="copy" onClick={() => void copy()}>
            <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
          </button>
        </div>
        <div className="ct-links rv">
          <a className="btn btn-ink" href={PROFILE.phoneHref}>{PROFILE.phone}</a>
          <a className="btn btn-line" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="btn btn-line" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </div>
      <svg className="ct-badge" viewBox="0 0 120 120" aria-hidden="true">
        <defs><path id="ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
        <text fontSize="11.5" fontFamily="var(--font-mono)" letterSpacing="3.2" fill="#0d0d0d">
          <textPath href="#ring">say hello · say hello · say hello · </textPath>
        </text>
        <circle cx="60" cy="60" r="4" fill="#0d0d0d" />
      </svg>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <style>{css}</style>
      <div className="wrap ft-in">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget("#top"); }}>Back to top</a>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
