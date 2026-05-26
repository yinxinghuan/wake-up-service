interface TickerProps {
  items: string[];
}

/** Marquee strip — CSS animation only (preload-safe). Doubles items for seamless loop. */
export default function Ticker({ items }: TickerProps) {
  const all = [...items, ...items];
  return (
    <div className="wus-ticker">
      <div className="wus-ticker__track">
        {all.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  );
}
