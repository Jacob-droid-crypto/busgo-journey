import { useSyncExternalStore } from "react";
import { addDaysISO, type Trip } from "./busgo-data";

export type SearchQuery = { from: string; to: string; date: string; passengers: number };

export type Passenger = { seat: string; name: string; age: string; gender: string; email: string; phone: string };

export type Selection = {
  trip: Trip;
  seats: string[];
  boarding: string;
  dropping: string;
};

export type Booking = {
  ref: string;
  trip: Trip;
  seats: string[];
  boarding: string;
  dropping: string;
  passengers: Passenger[];
  total: number;
  status: "upcoming" | "completed" | "cancelled";
};

type State = {
  query: SearchQuery;
  selection: Selection | null;
  bookings: Booking[];
  hydrated: boolean;
};

const STORAGE_KEY = "busgo-state-v1";

const demoTrip = (over: Partial<Trip>): Trip => ({
  id: "demo",
  operator: "MetroLine",
  rating: 4.6,
  types: ["AC", "Seater"],
  layout: "2+2",
  rows: 10,
  departure: "06:30",
  arrival: "10:15",
  durationMinutes: 225,
  price: 24,
  seatsLeft: 18,
  from: "New York",
  to: "Boston",
  date: addDaysISO(-20),
  boardingPoints: ["Port Authority"],
  droppingPoints: ["South Station"],
  ...over,
});

const demoBookings: Booking[] = [
  {
    ref: "BG-4K21XD",
    trip: demoTrip({ id: "demo-1", date: addDaysISO(-21) }),
    seats: ["B2", "B3"],
    boarding: "Port Authority",
    dropping: "South Station",
    passengers: [
      { seat: "B2", name: "Jacob Thomas", age: "31", gender: "Male", email: "jacob@example.com", phone: "+1 202 555 0143" },
      { seat: "B3", name: "Mira Thomas", age: "29", gender: "Female", email: "mira@example.com", phone: "+1 202 555 0188" },
    ],
    total: 52.8,
    status: "completed",
  },
  {
    ref: "BG-9PLM03",
    trip: demoTrip({
      id: "demo-2",
      operator: "SwiftCoach",
      from: "Austin",
      to: "Dallas",
      departure: "08:15",
      arrival: "11:35",
      price: 15,
      date: addDaysISO(-6),
      boardingPoints: ["Downtown Station"],
      droppingPoints: ["Central Bus Terminal"],
    }),
    seats: ["C1"],
    boarding: "Downtown Station",
    dropping: "Central Bus Terminal",
    passengers: [
      { seat: "C1", name: "Jacob Thomas", age: "31", gender: "Male", email: "jacob@example.com", phone: "+1 202 555 0143" },
    ],
    total: 16.5,
    status: "cancelled",
  },
];

const initialState: State = {
  query: { from: "New York", to: "Boston", date: addDaysISO(3), passengers: 2 },
  selection: null,
  bookings: demoBookings,
  hydrated: false,
};

let state: State = initialState;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ query: state.query, selection: state.selection, bookings: state.bookings }),
    );
  } catch {
    /* storage unavailable */
  }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

export function hydrateStore() {
  if (state.hydrated) return;
  let restored: Partial<State> = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) restored = JSON.parse(raw) as Partial<State>;
  } catch {
    /* ignore */
  }
  state = { ...state, ...restored, hydrated: true };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useBusGo(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initialState,
  );
}

export const actions = {
  setQuery(query: SearchQuery) {
    set({ query });
  },
  setSelection(selection: Selection | null) {
    set({ selection });
  },
  addBooking(booking: Booking) {
    set({ bookings: [booking, ...state.bookings] });
  },
  cancelBooking(ref: string) {
    set({
      bookings: state.bookings.map((b) => (b.ref === ref ? { ...b, status: "cancelled" as const } : b)),
    });
  },
};

export function makeRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `BG-${out}`;
}

export const TAX_RATE = 0.1;
