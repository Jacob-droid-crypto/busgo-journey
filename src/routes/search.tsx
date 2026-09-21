import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import {
  OPERATORS,
  formatDate,
  generateTrips,
  minutesToLabel,
  periodOf,
  type BusType,
  type Trip,
} from "@/lib/busgo-data";
import { actions, useBusGo } from "@/lib/booking-store";
import { SeatMap } from "@/components/seat-map";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search bus departures — BusGo" },
      {
        name: "description",
        content:
          "Filter bus departures by price, time of day, bus type and operator, then pick your seat.",
      },
      { property: "og:title", content: "Search bus departures — BusGo" },
      {
        property: "og:description",
        content: "Filter departures by price, time, bus type and operator, then pick your seat.",
      },
    ],
  }),
  component: SearchPage;
});

const PERIODS = ["Morning", "Afternoon", "Evening"] as const;
const BUS_TYPES: BusType[] = ["AC", "Non-AC", "Sleeper", "Seater"];

function chip(active: boolean) {
  return [
    "rounded-full px-3 py-1.5 font-mono text-xs transition-colors",
    active ? "bg-signal font-bold text-cream" : "bg-paper ring-1 ring-ink/15 hover:ring-signal",
  ].join(" ");
}

function SearchPage() {
  const { query, selection } = useBusGo();
  const navigate = useNavigate();

  const trips = useMemo(
    () => generateTrips(query.from, query.to, query.date),
    [query.from, query.to, query.date],
  );
  const maxPrice = trips.reduce((m, t) => Math.max(m, t.price), 60);

  const [priceCap, setPriceCap] = useState(maxPrice);
  const [periods, setPeriods] = useState<string[]>([]);
  const [types, setTypes] = useState<BusType[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [openTrip, setOpenTrip] = useState<string | null>(null);

  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const reset = () => {
    setPriceCap(maxPrice);
    setPeriods([]);
    setTypes([]);
    setOperators([]);
  };

  const filtered = trips.filter(
    (t) =>
      t.price <= priceCap &&
      (periods.length === 0 || periods.includes(periodOf(t.departure))) &&
      (types.length === 0 || types.some((ty) => t.types.includes(ty))) &&
      (operators.length === 0 || operators.includes(t.operator)),
  );

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h1 className="truncate font-display text-3xl font-bold tracking-tight">
              Results · {query.from} → {query.to}
            </h1>
            <p className="mt-1 font-mono text-xs text-ink/50">
              {formatDate(query.date)} · {query.passengers} passenger
              {query.passengers > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/"
            className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-signal hover:underline"
          >
            Edit search
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-2xl bg-cream p-5 ring-1 ring-black/5 lg:sticky lg:top-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Filters</span>
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono text-[11px] text-signal hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                    Price range
                  </span>
                  <span className="font-mono text-xs font-bold">$0 – ${priceCap}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={maxPrice}
                  value={priceCap}
                  onChange={(e) => setPriceCap(Number(e.target.value))}
                  className="w-full accent-signal"
                  aria-label="Maximum price"
                />
              </div>

              <div className="mb-6">
                <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  Departure time
                </span>
                <div className="flex flex-wrap gap-2">
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggle(periods, p as string, setPeriods)}
                      className={chip(periods.includes(p))}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  Bus type
                </span>
                <div className="flex flex-wrap gap-2">
                  {BUS_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggle(types, t, setTypes)}
                      className={chip(types.includes(t))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  Operator
                </span>
                <div className="space-y-2 font-mono text-xs">
                  {OPERATORS.map((o) => (
                    <label key={o.name} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="size-4 accent-signal"
                        checked={operators.includes(o.name)}
                        onChange={() => toggle(operators, o.name, setOperators)}
                      />
                      {o.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-4 lg:col-span-9">
            {filtered.length === 0 ? (
              <div className="rounded-2xl bg-cream p-8 text-center ring-1 ring-black/5">
                <p className="font-display text-xl font-bold">No departures match these filters</p>
                <p className="mt-2 font-mono text-xs text-ink/50">
                  Try widening the price cap or clearing the time filters.
                </p>
              </div>
            ) : (
              filtered.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  open={openTrip === trip.id}
                  onOpen={() => setOpenTrip(openTrip === trip.id ? null : trip.id)}
                  selectedSeats={selection?.trip.id === trip.id ? selection.seats : []}
                  onProceed={() => navigate({ to: "/checkout" })}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TripCard({
  trip,
  open,
  onOpen,
  selectedSeats,
  onProceed,
}: {
  trip: Trip;
  open: boolean;
  onOpen: () => void;
  selectedSeats: string[];
  onProceed: () => void;
}) {
  const [seats, setSeats] = useState<string[]>(selectedSeats);
  const [boarding, setBoarding] = useState(trip.boardingPoints[0]!);
  const [dropping, setDropping] = useState(trip.droppingPoints[0]!);

  const toggleSeat = (id: string) =>
    setSeats((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const proceed = () => {
    actions.setSelection({ trip, seats, boarding, dropping });
    onProceed();
  };

  return (
    <div className="rounded-2xl bg-cream p-5 ring-1 ring-black/5 transition-transform hover:ring-signal">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="shrink-0 md:w-44">
          <div className="font-display text-lg font-bold">{trip.operator}</div>
          <div className="font-mono text-[11px] text-ink/50">
            {trip.types.join(" ")} · {trip.layout}
          </div>
          <div className="mt-1 flex items-center gap-1 font-mono text-xs font-bold text-amber">
            <Star className="size-3.5 fill-amber" /> {trip.rating.toFixed(1)}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold">{trip.departure}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
                {trip.from}
              </div>
            </div>
            <div className="flex flex-1 items-center">
              <span className="h-0.5 flex-1 bg-ink/20" />
              <span className="px-2 font-mono text-[10px] text-ink/50">
                {minutesToLabel(trip.durationMinutes)}
              </span>
              <span className="h-0.5 flex-1 bg-ink/20" />
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold">{trip.arrival}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
                {trip.to}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 md:justify-end">
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink/40">Seats left</div>
            <div className="font-display text-lg font-bold">{trip.seatsLeft}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink/40">Per ticket</div>
            <div className="font-display text-3xl font-bold">${trip.price}</div>
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="rounded-full bg-signal px-5 py-3 font-display font-bold text-cream transition-colors hover:bg-signal-deep"
          >
            {open ? "Hide seats" : "Select seats"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-6 border-t-2 border-ink/10 pt-6">
          <SeatMap trip={trip} selected={seats} onToggle={toggleSeat} />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                Boarding point
              </span>
              <select
                value={boarding}
                onChange={(e) => setBoarding(e.target.value)}
                className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-paper px-3 py-3 font-display font-semibold outline-none"
              >
                {trip.boardingPoints.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                Dropping point
              </span>
              <select
                value={dropping}
                onChange={(e) => setDropping(e.target.value)}
                className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-paper px-3 py-3 font-display font-semibold outline-none"
              >
                {trip.droppingPoints.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t-2 border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                {seats.length} seat{seats.length === 1 ? "" : "s"} ·{" "}
                {seats.length ? seats.join(", ") : "none selected"}
              </div>
              <div className="font-display text-3xl font-bold">${seats.length * trip.price}</div>
            </div>
            <button
              type="button"
              disabled={seats.length === 0}
              onClick={proceed}
              className="rounded-full bg-ink px-6 py-3 font-display font-bold text-cream transition-colors hover:bg-signal disabled:cursor-not-allowed disabled:bg-ink/25"
            >
              Proceed to booking
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
