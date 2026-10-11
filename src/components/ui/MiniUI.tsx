import type { MiniKind } from "@/lib/data";

const css = `@layer components{
.mu{width:100%;height:100%;border-radius:20px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -30px rgba(13,13,13,.25);padding:16px;display:flex;flex-direction:column;gap:10px;overflow:hidden;font-size:11px;color:var(--ink-2)}
.mu-bar{display:flex;gap:5px}.mu-bar i{width:7px;height:7px;border-radius:50%;background:var(--soft)}
.mu-h{font-weight:600;color:var(--ink);font-size:12px;letter-spacing:-.01em}
.mu-row{display:flex;align-items:center;gap:8px;min-height:30px;border-radius:10px;background:var(--paper);padding:0 10px}
.mu-row.k{background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.mu-grow{flex:1}
.mu-sk{height:6px;border-radius:99px;background:var(--soft)}
.mu-pill{height:22px;padding:0 10px;border-radius:99px;background:var(--ink);color:#fff;display:inline-flex;align-items:center;font-weight:500;font-size:10px;white-space:nowrap}
.mu-pill.o{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1px var(--line)}
.mu-dot{width:8px;height:8px;border-radius:50%;background:var(--ink);flex:none}.mu-dot.l{background:var(--faint)}
.mu-bub{max-width:78%;padding:8px 11px;border-radius:14px;background:var(--paper)}
.mu-bub.me{align-self:flex-end;background:var(--ink);color:#fff}
.mu-grid{display:grid;gap:5px;flex:1}
.mu-cell{border-radius:6px;background:var(--paper)}.mu-cell.on{background:var(--ink-2)}.mu-cell.mid{background:var(--faint)}
.mu-doc{flex:1;display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
.mu-paper{height:100%;border-radius:10px;background:var(--paper);padding:10px;display:flex;flex-direction:column;gap:7px}
.mu-arrow{font-size:18px;color:var(--mute)}
.mu-spark{height:46px;width:100%}
}`;

const Bar = () => (
  <div className="mu-bar" aria-hidden="true"><i /><i /><i /></div>
);

function Body({ kind }: { kind: MiniKind }) {
  switch (kind) {
    case "forms":
      return (
        <>
          <span className="mu-h">Service request</span>
          {[0, 1, 2].map((i) => (
            <div key={i} className="mu-row k"><span className="mu-sk" style={{ width: 54 + i * 14 }} /><span className="mu-grow" /><span className="mu-sk" style={{ width: 40 }} /></div>
          ))}
          <div className="mu-row"><span>Wallet</span><span className="mu-grow" /><span className="mu-pill o">Assign operator</span></div>
          <span className="mu-pill" style={{ alignSelf: "flex-start" }}>Submit</span>
        </>
      );
    case "commerce":
      return (
        <>
          <span className="mu-h">Cart</span>
          {[70, 52, 86].map((w, i) => (
            <div key={i} className="mu-row k"><span className="mu-dot l" /><span className="mu-sk" style={{ width: w }} /><span className="mu-grow" /><span className="mu-sk" style={{ width: 26 }} /></div>
          ))}
          <div className="mu-row"><span>Tiered discount</span><span className="mu-grow" /><span className="mu-pill o">Applied</span></div>
          <span className="mu-pill" style={{ alignSelf: "flex-start" }}>Pay</span>
        </>
      );
    case "chat":
      return (
        <>
          <span className="mu-h">Bill chat</span>
          <div className="mu-bub">Your bill is ready.</div>
          <div className="mu-bub me">Pay now</div>
          <div className="mu-bub">Payment received.</div>
          <div className="mu-row"><span className="mu-sk mu-grow" /><span className="mu-pill">Send</span></div>
        </>
      );
    case "schedule": {
      const cells = [1, 1, 0, 2, 1, 0, 0, 2, 1, 1, 0, 1, 2, 0, 1, 0, 1, 1, 0, 2];
      return (
        <>
          <span className="mu-h">Shifts</span>
          <div className="mu-grid" style={{ gridTemplateColumns: "repeat(5,1fr)", gridAutoRows: "1fr" }}>
            {cells.map((c, i) => <span key={i} className={`mu-cell${c === 1 ? " on" : c === 2 ? " mid" : ""}`} />)}
          </div>
          <div className="mu-row"><span>Copy schedule</span><span className="mu-grow" /><span className="mu-pill">Copy</span></div>
        </>
      );
    }
    case "monitor":
      return (
        <>
          <span className="mu-h">Tags</span>
          {["OPC", "Modbus", "S7"].map((t, i) => (
            <div key={t} className="mu-row k"><span className={`mu-dot${i === 2 ? " l" : ""}`} /><span>{t}</span><span className="mu-grow" /><span className="mu-sk" style={{ width: 36 }} /></div>
          ))}
          <svg className="mu-spark" viewBox="0 0 120 46" preserveAspectRatio="none" aria-hidden="true">
            <polyline fill="none" stroke="#0d0d0d" strokeWidth="1.5" points="0,34 14,30 28,36 42,18 56,24 70,10 84,20 98,14 120,22" />
          </svg>
        </>
      );
    case "invoice":
      return (
        <>
          <span className="mu-h">Invoice</span>
          <div className="mu-doc">
            <div className="mu-paper">{[80, 60, 90, 50, 70].map((w, i) => <span key={i} className="mu-sk" style={{ width: `${w}%` }} />)}</div>
            <span className="mu-arrow" aria-hidden="true">→</span>
            <div className="mu-paper">{["Vendor", "Date", "Total"].map((f) => <span key={f} className="mu-row k" style={{ minHeight: 24 }}>{f}</span>)}</div>
          </div>
        </>
      );
    case "rental": {
      const days = Array.from({ length: 21 }, (_, i) => (i >= 8 && i <= 12 ? 1 : i === 15 || i === 16 ? 2 : 0));
      return (
        <>
          <span className="mu-h">Rental dates</span>
          <div className="mu-grid" style={{ gridTemplateColumns: "repeat(7,1fr)", gridAutoRows: "1fr" }}>
            {days.map((d, i) => <span key={i} className={`mu-cell${d === 1 ? " on" : d === 2 ? " mid" : ""}`} />)}
          </div>
          <div className="mu-row"><span>Return</span><span className="mu-grow" /><span className="mu-pill o">Mark returned</span></div>
        </>
      );
    }
  }
}

export default function MiniUI({ kind }: { readonly kind: MiniKind }) {
  return (
    <div className="mu" aria-hidden="true">
      <style>{css}</style>
      <Bar />
      <Body kind={kind} />
    </div>
  );
}
