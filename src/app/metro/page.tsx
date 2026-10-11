"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { TrainCard } from "@/components/TrainCard";
import { searchStations, searchTrainsBetween, type Station } from "@/lib/data";

export default function MetroLocalPage() {
  const [city, setCity] = useState("");
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [results, setResults] = useState<ReturnType<typeof searchTrainsBetween> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = ["Bengaluru", "Mumbai", "Chennai", "Delhi", "Kolkata", "Hyderabad"];

  function handleSearch() {
    setError(null);
    setResults(null);

    if (!fromStation || !toStation) {
      setError("Pick both stations to find metro/local trains.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const data = searchTrainsBetween(fromStation.id, toStation.id);
      setResults(data);
      setIsLoading(false);
    }, 300);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/search" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Metro & Local Trains</h1>
      <p className="mb-4 text-sm text-text-muted">Find metro and local trains in your city.</p>

      {/* City selector */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-text-muted">City</label>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select city">
          {cities.map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={city === c}
              onClick={() => setCity(c)}
              className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-all ${
                city === c
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border bg-surface-raised text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Station search */}
      <div className="grid gap-3 sm:grid-cols-2">
        <SearchBar
          label="From station"
          placeholder="Start typing a station name"
          value={fromStation}
          onChange={setFromStation}
          variant="from"
        />
        <SearchBar
          label="To station"
          placeholder="Where are you headed"
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
        {isLoading ? "Searching…" : "Find metro trains"}
      </button>

      <div className="mt-6" aria-live="polite">
        {results && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text">
              {results.length} train{results.length !== 1 ? "s" : ""} between stations
            </h2>
            {results.length === 0 ? (
              <div className="rounded-md border border-border bg-surface p-6 text-center">
                <p className="text-sm text-text-muted">No metro/local trains found on this route.</p>
                <p className="mt-1 text-xs text-text-muted">This feature is available for select cities.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(({ train, source, dest, fromDeparture, toArrival, distanceKm, durationMinutes }) => (
                  <TrainCard
                    key={train.id}
                    train={train}
                    source={source}
                    dest={dest}
                    fromDeparture={fromDeparture}
                    toArrival={toArrival}
                    distanceKm={distanceKm}
                    durationMinutes={durationMinutes}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
