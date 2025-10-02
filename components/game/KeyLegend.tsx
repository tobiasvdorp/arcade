type KeyLegendProps = {
  items: { key: string; label: string }[];
};

export function KeyLegend({ items }: KeyLegendProps) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Controls legend">
      {items.map((it) => (
        <li
          key={it.key}
          className="inline-flex items-center gap-2 rounded-xl border px-2 py-1 text-xs glass"
        >
          <kbd className="rounded bg-muted px-1 py-0.5 text-foreground/90 shadow-sm">
            {it.key}
          </kbd>
          <span className="text-muted-foreground">{it.label}</span>
        </li>
      ))}
    </ul>
  );
}
