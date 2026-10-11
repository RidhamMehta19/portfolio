import IdCard from "../ui/IdCard";
import { EDUCATION, EXPERIENCE, PROFILE } from "@/lib/data";

const css = `@layer components{
.about{overflow:hidden;padding-top:0}
.about-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:40px;align-items:stretch}
.about-col{display:flex;flex-direction:column;justify-content:center;gap:26px;padding-top:var(--sec-pad)}
.about-card{order:-1;display:flex;justify-content:center}
.about-hi{font-size:clamp(40px,5vw,76px)}
.about-body{color:var(--ink-2);font-size:clamp(16px,1.25vw,18px);line-height:1.55;max-width:52ch}
.about-body+.about-body{margin-top:-8px;color:var(--mute)}
.about-actions{display:flex;flex-wrap:wrap;gap:10px}
.facts{margin:0;display:grid}
.facts div{display:grid;grid-template-columns:96px 1fr;gap:12px;padding:14px 0;border-top:1px solid var(--line);font-size:15px;line-height:1.4}
.facts div:last-child{border-bottom:1px solid var(--line)}
.facts dt{font-family:var(--font-mono);font-size:12px;color:var(--mute);padding-top:2px}
.facts dd{margin:0;overflow-wrap:anywhere}
.facts a{text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--faint)}
.quote{margin:0;font-family:var(--font-serif);font-style:italic;font-size:clamp(22px,2vw,28px);line-height:1.2;color:var(--ink-2);max-width:26ch}
@media(min-width:1040px){
.about-grid{grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px)}
.about-card{order:0}
}
}`;

export default function About() {
  const role = EXPERIENCE[0];
  const edu = EDUCATION[0];
  return (
    <section id="about" className="sec about" aria-labelledby="about-title">
      <style>{css}</style>
      <div className="wrap about-grid">
        <div className="about-col">
          <p className="tag rv"><b>01</b> — About</p>
          <h2 id="about-title" className="about-hi">
            <span className="rv-mask"><span>Hi, I&apos;m</span></span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}><span><em>{PROFILE.firstName}.</em></span></span>
          </h2>
          <p className="about-body rv">{PROFILE.summary}</p>
          <p className="about-body rv">{PROFILE.role} | {PROFILE.stackLine}</p>
          <div className="about-actions rv">
            <a className="btn btn-ink" href={PROFILE.resume} download>Résumé ↓</a>
            <a className="btn btn-line" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a className="btn btn-line" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>

        <div className="about-card" aria-label="Developer ID card">
          <IdCard />
        </div>

        <div className="about-col">
          <dl className="facts rv">
            <div><dt>Location</dt><dd>{PROFILE.location}</dd></div>
            <div><dt>Education</dt><dd>{edu?.degree}, {edu?.school} ({edu?.period})</dd></div>
            <div><dt>Currently</dt><dd>{role?.title}, {role?.org}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></dd></div>
          </dl>
          <blockquote className="quote rv">
            Connecting user-facing workflows to the payment, industrial and government systems behind them.
          </blockquote>
        </div>
      </div>
    </section>
  );
}
