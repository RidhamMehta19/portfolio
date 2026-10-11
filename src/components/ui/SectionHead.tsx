interface Props {
  readonly index: string;
  readonly label: string;
  /** Lines of bold text, followed by one serif-italic accent word. */
  readonly lines: readonly string[];
  readonly accent: string;
}

export default function SectionHead({ index, label, lines, accent }: Props) {
  return (
    <header>
      <p className="tag rv">
        <b>{index}</b> — {label}
      </p>
      <h2 className="h2">
        {lines.map((line, i) => (
          <span key={line} className="rv-mask" style={{ "--i": i } as React.CSSProperties}>
            <span>{line}</span>
          </span>
        ))}
        <span className="rv-mask" style={{ "--i": lines.length } as React.CSSProperties}>
          <span>
            <em>{accent}</em>
          </span>
        </span>
      </h2>
    </header>
  );
}
