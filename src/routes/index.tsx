import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SearchPanel } from "@/components/search-panel";
import { POPULAR_ROUTES } from "@/lib/busgo-data";
import { actions, useBusGo } from "@/lib/booking-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BusGo — Book intercity bus tickets" },
      {
        name: "description",
        content:
          "Search 40+ bus operators, compare departures and prices, and pick your exact seat on BusGo.",
      },
      { property: "og:title", content: "BusGo — Book intercity bus tickets" },
      {
        property: "og:description",
        content: "Search 40+ bus operators, compare departures and prices, and pick your exact seat.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { query } = useBusGo();
  const navigate = useNavigate();

  const pick = (from: string, to: string) => {
    actions.setQuery({ ...query, from, to });
    actions.setSelection(null);
    navigate({ to: "/search" });
  };

  return (
    <>
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-signal">
            Boarding now · 4-field search
          </p>
          <h1 className="max-w-[20ch] font-display text-5xl font-bold leading-none tracking-tighter sm:text-7xl">
            Book the bus
            <br />
            like a local.
          </h1>
          <p className="mt-5 max-w-[46ch] font-mono text-sm text-cream/60">
            Real operators, real seats, real prices. Snap your ticket and roll.
          </p>

          <div className="mt-10">
            <SearchPanel />
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold tracking-tight">Popular routes</h2>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">
              Tap to prefill
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_ROUTES.slice(0, 8).map((r) => (
              <button
                key={`${r.from}-${r.to}`}
                type="button"
                onClick={() => pick(r.from, r.to)}
                className="rounded-2xl bg-cream p-5 text-left ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:ring-signal"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  {r.from} → {r.to}
                </div>
                <div className="mt-3 font-display text-2xl font-bold">from ${r.price}</div>
                <div className="mt-1 font-mono text-xs text-ink/50">
                  {r.duration} · {r.daily} daily
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
