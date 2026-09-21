import { useMemo } from "react";
import { Ban, SteeringWheel } from "lucide-react";
import { seatMapFor, type Trip } from "@/lib/busgo-data";

type Props = {
  trip: Trip;
  selected: string[];
  onToggle: (seat: string) => void;
};

const legend = [
  { label: "Available", className: "border-2 border-ink/20 bg-paper" },
  { label: "Selected", className: "bg-signal" },
  { label: "Booked", className: "bg-ink/25" },
  { label: "Women only", className: "bg-pink-400" },
];

export function SeatMap({ trip, selected, onToggle }: Props) {
  const { seats, perRow } = useMemo(() => seatMapFor(trip), [trip]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-2 font-mono text-[11px] text-ink/60">
            <span className={`size-4 rounded ${l.className}`} />
            {l.label}
          </span>
        ))}
      </div>

      <div className="inline-block rounded-2xl border-2 border-ink/15 bg-paper p-4">
        <div className="mb-3 flex items-center justify-end gap-2 border-b border-ink/10 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
          Driver
          <SteeringWheel className="size-5 text-ink/50" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: trip.rows }, (_, r) => {
            const row = seats.filter((s) => s.row === r + 1);
            return (
              <div key={r} className="flex items-center gap-2">
                {row.map((seat, idx) => {
                  const isSelected = selected.includes(seat.id);
                  const disabled = seat.status === "booked";
                  const gap = perRow === 4 ? idx === 2 : idx === 2;
                  return (
                    <span key={seat.id} className="flex items-center">
                      {gap ? <span className="w-6" aria-hidden /> : null}
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onToggle(seat.id)}
                        aria-label={`Seat ${seat.id} ${seat.status}`}
                        className={[
                          "grid size-10 place-items-center rounded-lg font-mono text-[11px] font-bold transition-transform",
                          disabled
                            ? "cursor-not-allowed bg-ink/25 text-ink/40"
                            : isSelected
                              ? "scale-105 bg-signal text-cream"
                              : seat.status === "women"
                                ? "bg-pink-400/90 text-ink hover:-translate-y-0.5"
                                : "border-2 border-ink/20 bg-cream text-ink hover:-translate-y-0.5 hover:border-signal",
                        ].join(" ")}
                      >
                        {disabled ? <Ban className="size-4" /> : seat.id}
                      </button>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
