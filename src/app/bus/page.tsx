"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { searchStations, type Station } from "@/lib/data";

interface BusRoute {
  id: string;
  operator: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  isLive: boolean;
}

const mockBusRoutes: BusRoute[] = [
  { id: "bus-1", operator: "KSRTC", from: "Bengaluru", to: "Mysuru", departureTime: "08:00", arrivalTime: "11:00", duration: "3h", isLive: true },
  { id: "bus-2", operator: "BMTC", from: "Bengaluru", to: "Chennai", departureTime: "09:30", arrivalTime: "15:30", duration: "6h", isLive: true },
  { id: "bus-3", operator: "MSRTC", from: "Mumbai", to: "Pune", departureTime: "07:00", arrivalTime: "10:30", duration: "3h 30m", isLive: false },
];

export default function BusPage() {
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [results, setResults] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch() {
    setError(null);
    setResults([]);
    setSearched(true);

    if (!fromStation || !toStation) {
      setError("Pick both locations to find buses.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setResults(mockBusRoutes);
      setIsLoading(false);
    }, 500);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/search" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Bus Tracking</h1>
      <p className="mb-4 text-sm text-text-muted">Find point-to-point bus routes with real-time location.</p>

      <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <SearchBar
            label="From location"
            placeholder="Start typing a city"
            value={fromStation}
            onChange={setFromStation}
            variant="from"
          />
          <SearchBar
            label="To location"
            placeholder="Destination"
            value={toStation}
            onChange={setToStation}
            variant="to"
          />
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="mt-4 w-full rounded-pill bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isLoading ? "Searching…" : "Find buses"}
        </button>
      </div>

      <div className="mt-6" aria-live="polite">
        {searched && results.length === 0 && !isLoading && (
          <div className="rounded-md border border-border bg-surface p-6 text-center">
            <p className="text-sm text-text-muted">No bus routes found for this search.</p>
            <p className="mt-1 text-xs text-text-muted">Bus tracking is available for select cities.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-text">{results.length} bus route{results.length !== 1 ? "s" : ""}</h2>
            {results.map((bus) => (
              <div key={bus.id} className="rounded-md border border-border bg-surface-raised p-4 shadow-card">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-text">{bus.operator}</span>
                  {bus.isLive && (
                    <span className="flex items-center gap-1 rounded-pill bg-success-subtle px-2 py-0.5 text-xs font-semibold text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Live
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-text">
                  <div>
                    <p className="font-medium">{bus.from}</p>
                    <p className="text-xs text-text-muted">{bus.departureTime}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-text-muted">{bus.duration}</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <div className="h-px flex-1 bg-border" />
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{bus.to}</p>
                    <p className="text-xs text-text-muted">{bus.arrivalTime}</p>
                  </div>
                </div>
                {bus.isLive && (
                  <button className="mt-3 w-full rounded-pill border border-accent px-4 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent-subtle">
                    Track this bus live
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
