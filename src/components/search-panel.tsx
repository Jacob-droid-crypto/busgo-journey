import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight } from "lucide-react";
import { CITIES } from "@/lib/busgo-data";
import { actions, useBusGo } from "@/lib/booking-store";

const fieldClass = "rounded-2xl border-2 border-ink/10 bg-paper p-4";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50";
const inputClass =
  "mt-2 w-full bg-transparent font-display text-lg font-semibold outline-none placeholder:text-ink/30";

export function SearchPanel() {
  const { query } = useBusGo();
  const navigate = useNavigate();
  const [form, setForm] = useState(query);

  const submit = () => {
    actions.setQuery(form);
    actions.setSelection(null);
    navigate({ to: "/search" });
  };

  return (
    <div className="rounded-[28px] bg-cream p-4 text-ink ring-1 ring-black/5 sm:p-6">
      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        <div className={`${fieldClass} lg:col-span-3`}>
          <label className={labelClass} htmlFor="from">
            From · Origin
          </label>
          <div className="flex items-center gap-2">
            <span className="mt-2 size-2 shrink-0 rounded-full bg-signal" />
            <input
              id="from"
              list="busgo-cities"
              className={inputClass}
              value={form.from}
              placeholder="Origin city"
              onChange={(e) => setForm({ ...form, from: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-center lg:col-span-1">
          <button
            type="button"
            aria-label="Swap cities"
            onClick={() => setForm({ ...form, from: form.to, to: form.from })}
            className="grid size-11 place-items-center rounded-full bg-ink text-cream transition-colors hover:bg-signal"
          >
            <ArrowLeftRight className="size-5" />
          </button>
        </div>

        <div className={`${fieldClass} lg:col-span-3`}>
          <label className={labelClass} htmlFor="to">
            To · Destination
          </label>
          <div className="flex items-center gap-2">
            <span className="mt-2 size-2 shrink-0 rounded-full bg-amber" />
            <input
              id="to"
              list="busgo-cities"
              className={inputClass}
              value={form.to}
              placeholder="Destination city"
              onChange={(e) => setForm({ ...form, to: e.target.value })}
            />
          </div>
        </div>

        <div className={`${fieldClass} lg:col-span-2`}>
          <label className={labelClass} htmlFor="date">
            Travel date
          </label>
          <input
            id="date"
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className={`${fieldClass} lg:col-span-2`}>
          <label className={labelClass} htmlFor="passengers">
            Passengers
          </label>
          <input
            id="passengers"
            type="number"
            min={1}
            max={6}
            className={inputClass}
            value={form.passengers}
            onChange={(e) => setForm({ ...form, passengers: Math.max(1, Number(e.target.value) || 1) })}
          />
        </div>

        <div className="flex items-stretch lg:col-span-1">
          <button
            type="button"
            onClick={submit}
            className="w-full rounded-2xl bg-signal px-5 py-4 font-display text-lg font-bold text-cream transition-colors hover:bg-signal-deep"
          >
            Search
          </button>
        </div>
      </div>

      <datalist id="busgo-cities">
        {CITIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  );
}
