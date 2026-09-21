/** Mock data + deterministic schedule generation for BusGo. */

export type BusType = "AC" | "Non-AC" | "Sleeper" | "Seater";

export type Trip = {
  id: string;
  operator: string;
  rating: number;
  types: BusType[];
  layout: "2+2" | "2+1";
  rows: number;
  departure: string; // HH:MM
  arrival: string;
  durationMinutes: number;
  price: number;
  seatsLeft: number;
  from: string;
  to: string;
  date: string;
  boardingPoints: string[];
  droppingPoints: string[];
};

export const CITIES = [
  "New York",
  "Boston",
  "Chicago",
  "Detroit",
  "Austin",
  "Dallas",
  "Houston",
  "Seattle",
  "Portland",
  "San Francisco",
  "Los Angeles",
  "Washington DC",
  "Philadelphia",
  "London",
  "Paris",
  "Amsterdam",
  "Berlin",
];

export const OPERATORS = [
  { name: "MetroLine", rating: 4.6 },
  { name: "SwiftCoach", rating: 4.8 },
  { name: "NorthStar", rating: 4.2 },
  { name: "BlueRidge", rating: 4.4 },
  { name: "Coastal Transit", rating: 4.1 },
  { name: "Meridian Coach", rating: 4.7 },
];

export const POPULAR_ROUTES = [
  { from: "New York", to: "Boston", price: 24, duration: "3h 45m", daily: 12 },
  { from: "Chicago", to: "Detroit", price: 19, duration: "4h 10m", daily: 8 },
  { from: "Austin", to: "Dallas", price: 15, duration: "3h 20m", daily: 9 },
  { from: "Seattle", to: "Portland", price: 12, duration: "2h 50m", daily: 14 },
  { from: "London", to: "Paris", price: 49, duration: "8h 10m", daily: 6 },
  { from: "Los Angeles", to: "San Francisco", price: 29, duration: "7h 30m", daily: 11 },
  { from: "Philadelphia", to: "Washington DC", price: 17, duration: "3h 05m", daily: 15 },
  { from: "Amsterdam", to: "Berlin", price: 39, duration: "9h 20m", daily: 4 },
];

const STOPS: Record<string, string[]> = {
  default: ["Central Bus Terminal", "Downtown Plaza", "Airport Coach Bay", "Riverside Stop"],
  "New York": ["Port Authority", "34th St & 8th Ave", "Brooklyn Atlantic Ave", "Harlem 125th St"],
  Boston: ["South Station", "Back Bay", "Cambridge Alewife", "Logan Coach Bay"],
  Chicago: ["Union Station", "Midway Transit Hub", "Loop Adams St"],
  Austin: ["Downtown Station", "UT Guadalupe", "South Congress"],
  London: ["Victoria Coach Station", "Stratford", "Golders Green"],
  Paris: ["Bercy Seine", "Porte Maillot", "La Défense"],
};

export function stopsFor(city: string): string[] {
  return STOPS[city] ?? STOPS["default"]!;
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function minutesToLabel(m: number) {
  return `${Math.floor(m / 60)}h ${pad(m % 60)}m`;
}

export function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function periodOf(time: string): "Morning" | "Afternoon" | "Evening" {
  const h = Math.floor(timeToMinutes(time) / 60);
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

export function generateTrips(from: string, to: string, date: string): Trip[] {
  if (!from || !to) return [];
  const rand = rng(`${from}|${to}|${date}`);
  const count = 6 + Math.floor(rand() * 3);
  const baseDuration = 150 + Math.floor(rand() * 260);
  const basePrice = 14 + Math.floor(rand() * 26);

  return Array.from({ length: count }, (_, i) => {
    const op = OPERATORS[Math.floor(rand() * OPERATORS.length)]!;
    const depMinutes = Math.floor(rand() * 20) * 45 + 330; // 05:30 onwards
    const dep = `${pad(Math.floor((depMinutes % 1440) / 60))}:${pad(depMinutes % 60)}`;
    const duration = baseDuration + Math.floor(rand() * 60);
    const arrMinutes = (depMinutes + duration) % 1440;
    const sleeper = rand() > 0.6;
    const ac = rand() > 0.25;
    const types: BusType[] = [ac ? "AC" : "Non-AC", sleeper ? "Sleeper" : "Seater"];

    return {
      id: `${hash(`${from}${to}${date}${i}`)}`,
      operator: op.name,
      rating: Math.round((op.rating + (rand() - 0.5) * 0.4) * 10) / 10,
      types,
      layout: sleeper ? "2+1" : "2+2",
      rows: sleeper ? 11 : 10,
      departure: dep,
      arrival: `${pad(Math.floor(arrMinutes / 60))}:${pad(arrMinutes % 60)}`,
      durationMinutes: duration,
      price: basePrice + Math.floor(rand() * 22) + (sleeper ? 9 : 0),
      seatsLeft: 4 + Math.floor(rand() * 26),
      from,
      to,
      date,
      boardingPoints: stopsFor(from),
      droppingPoints: stopsFor(to),
    } satisfies Trip;
  }).sort((a, b) => timeToMinutes(a.departure) - timeToMinutes(b.departure));
}

export type SeatStatus = "available" | "booked" | "women";
export type Seat = { id: string; status: SeatStatus; row: number; col: number };

/** Deterministic seat map: columns per row depend on layout, aisle after col 2. */
export function seatMapFor(trip: Trip): { seats: Seat[]; perRow: number } {
  const perRow = trip.layout === "2+2" ? 4 : 3;
  const rand = rng(`seats-${trip.id}`);
  const seats: Seat[] = [];
  for (let r = 1; r <= trip.rows; r++) {
    for (let c = 1; c <= perRow; c++) {
      const roll = rand();
      const status: SeatStatus = roll < 0.28 ? "booked" : roll < 0.38 ? "women" : "available";
      seats.push({ id: `${String.fromCharCode(64 + r)}${c}`, status, row: r, col: c });
    }
  }
  return { seats, perRow };
}

export function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
