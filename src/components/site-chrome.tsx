import { Link } from "@tanstack/react-router";
import { POPULAR_ROUTES } from "@/lib/busgo-data";

const navLinks = [
  { to: "/", label: "Routes" },
  { to: "/bookings", label: "My trips" },
] as const;

export function SiteHeader() {
  return (
    <>
      <header className="border-b-2 border-ink bg-cream">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-signal font-mono text-sm font-bold text-cream">
              B
            </span>
            <span className="font-display text-xl font-bold tracking-tight">BusGo</span>
            <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 sm:inline">
              Transit-grade booking
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-4 font-mono text-xs uppercase tracking-wider sm:gap-6">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="transition-colors hover:text-signal">
                {l.label}
              </Link>
            ))}
            <span className="rounded-full bg-ink px-4 py-2 font-bold text-cream">Sign in</span>
          </nav>
        </div>
      </header>

      <div className="overflow-hidden border-b-2 border-ink bg-ink text-cream">
        <div className="ticker-track flex whitespace-nowrap py-2 font-mono text-xs uppercase tracking-[0.15em]">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex">
              {POPULAR_ROUTES.slice(0, 4).map((r) => (
                <span key={`${dup}-${r.from}`} className="flex items-center">
                  <span className="px-6">
                    {r.from} → {r.to} · from ${r.price}
                  </span>
                  <span className="text-signal">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row sm:px-8">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream/50">
          BusGo · Transit-grade booking
        </span>
        <span className="font-mono text-xs text-cream/40">© 2026 · Depart on time</span>
      </div>
    </footer>
  );
}
