/** Deterministic mock QR block rendered from a booking reference. */
export function MockQr({ value, size = 128 }: { value: string; size?: number }) {
  const cells = 21;
  let h = 5381;
  for (let i = 0; i < value.length; i++) h = (h * 33 + value.charCodeAt(i)) >>> 0;

  const grid = Array.from({ length: cells * cells }, (_, i) => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    const row = Math.floor(i / cells);
    const col = i % cells;
    const finder =
      (row < 7 && col < 7) || (row < 7 && col >= cells - 7) || (row >= cells - 7 && col < 7);
    if (finder) {
      const r = Math.min(row, cells - 1 - row);
      const c = Math.min(col, cells - 1 - col);
      const rr = row < 7 ? row : r;
      const cc = col < 7 ? col : c;
      const ring = Math.max(Math.abs(rr - 3), Math.abs(cc - 3));
      return ring === 1 ? 0 : 1;
    }
    return h % 100 < 46 ? 1 : 0;
  });

  return (
    <div
      className="grid gap-0 rounded-lg bg-cream p-2 ring-2 ring-ink/15"
      style={{ width: size, height: size, gridTemplateColumns: `repeat(${cells}, 1fr)` }}
      aria-label={`QR code for ${value}`}
      role="img"
    >
      {grid.map((on, i) => (
        <span key={i} className={on ? "bg-ink" : "bg-transparent"} />
      ))}
    </div>
  );
}
