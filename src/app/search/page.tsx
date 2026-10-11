"use client";

import { useState } from "react";
import { TopTabs } from "@/components/TopTabs";
import { SearchBar } from "@/components/SearchBar";
import { DateFilterChips } from "@/components/DateFilterChips";
import { SkeletonList } from "@/components/Skeleton";
import { TrainCard } from "@/components/TrainCard";
import type {
  Station,
  TrainsBetweenResult,
  TrainWithStations,
  DepartureBoardEntry,
} from "@/lib/data";

type SearchMode = "between" | "number" | "station";

export default function HomePage() {
  const [mode, setMode] = useState<SearchMode>("between");
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [trainNumberQuery, setTrainNumberQuery] = useState("");
  const [stationQuery, setStationQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"today" | "tomorrow" | "calendar">("today");
  const [results, setResults] = useState<
    | { type: "between"; data: TrainsBetweenResult[] }
    | { type: "number"; data: TrainWithStations[] }
    | { type: "departures"; stationName: string; data: DepartureBoardEntry[] }
    | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postJson<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      throw new Error(json?.error?.message ?? `Request to ${url} failed (${res.status})`);
    }
    return json as T;
  }

  async function handleSearch() {
    setError(null);
    setResults(null);

    if (mode === "between") {
      if (!fromStation || !toStation) {
        setError("Pick both stations to find trains.");
        return;
      }
      if (fromStation.id === toStation.id) {
        setError("From and To stations must be different.");
        return;
      }
      setIsLoading(true);
      try {
        const json = await postJson<{
          data: TrainsBetweenResult[];
        }>("/api/search/trains-between", {
          from_station_id: fromStation.id,
          to_station_id: toStation.id,
        });
        setResults({ type: "between", data: json.data ?? [] });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed. Try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (mode === "number") {
      if (!trainNumberQuery.trim()) {
        setError("Enter a train number or name.");
        return;
      }
      setIsLoading(true);
      try {
        const json = await postJson<{ data: TrainWithStations[] }>(
          "/api/search/train-by-number",
          { query: trainNumberQuery.trim() },
        );
        setResults({ type: "number", data: json.data ?? [] });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed. Try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!stationQuery.trim()) {
        setError("Station not found. Try another name or code.");
        return;
      }
      setIsLoading(true);
      try {
        const searchRes = await fetch(
          `/api/search/stations?q=${encodeURIComponent(stationQuery.trim())}`,
        );
        const searchJson = await searchRes.json();
        const station = (searchJson?.data ?? [])[0] as Station | undefined;
        if (!station) {
          setError("Station not found. Try another name or code.");
          return;
        }
        const json = await postJson<{
          data: DepartureBoardEntry[];
        }>("/api/station/departures", { station_id: station.id });
        setResults({
          type: "departures",
          stationName: station.name,
          data: json.data ?? [],
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed. Try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-text">RailYatra</h1>
      <p className="mb-5 text-sm text-text-muted">Live train tracking, offline schedules, station boards.</p>

      <TopTabs
        tabs={[
          { id: "between", label: "From / To" },
          { id: "number", label: "Train No. / Name" },
          { id: "station", label: "Station Board" },
        ]}
        activeTab={mode}
        onTabChange={(id) => {
          setMode(id as SearchMode);
          setResults(null);
          setError(null);
        }}
      />

      <div className="mt-4 rounded-lg border border-border bg-surface-raised p-4 shadow-card">
        {mode === "between" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <SearchBar
                label="From station"
                placeholder="Start typing a station name or code"
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
            <div className="mt-3">
              <DateFilterChips selected={dateFilter} onChange={setDateFilter} />
            </div>
          </>
        )}

        {mode === "number" && (
          <>
            <label htmlFor="train-number" className="mb-1 block text-xs font-medium text-text-muted">
              Train number or name
            </label>
            <input
              id="train-number"
              type="text"
              placeholder="e.g. 12658 or Chennai Mail"
              value={trainNumberQuery}
              onChange={(e) => setTrainNumberQuery(e.target.value)}
              className="w-full rounded-md border border-border-input bg-surface-raised px-3 py-2 text-sm text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </>
        )}

        {mode === "station" && (
          <>
            <label htmlFor="station-board" className="mb-1 block text-xs font-medium text-text-muted">
              Station name or code
            </label>
            <input
              id="station-board"
              type="text"
              placeholder="e.g. Guwahati or GHY"
              value={stationQuery}
              onChange={(e) => setStationQuery(e.target.value)}
              className="w-full rounded-md border border-border-input bg-surface-raised px-3 py-2 text-sm text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </>
        )}

        {error && (
          <p role="alert" className="mt-3 rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="mt-4 w-full rounded-pill bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Searching…" : "Find trains"}
        </button>
      </div>

      <div className="mt-6" aria-live="polite">
        {isLoading && <SkeletonList count={4} />}

        {results && results.type === "between" && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text">
              {results.data.length} train{results.data.length !== 1 ? "s" : ""} between stations
            </h2>
            {results.data.length === 0 ? (
              <div className="rounded-md border border-border bg-surface p-6 text-center">
                <p className="text-sm text-text-muted">No trains found between these stations.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.data.map(({ train, source, dest, fromDeparture, toArrival, distanceKm, durationMinutes }) => (
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

        {results && results.type === "number" && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text">Train lookup</h2>
            {results.data.length === 0 ? (
              <div className="rounded-md border border-border bg-surface p-6 text-center">
                <p className="text-sm text-text-muted">No train matched that number or name.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.data.map(({ train, source, dest }) => (
                  <TrainCard key={train.id} train={train} source={source} dest={dest} />
                ))}
              </div>
            )}
          </div>
        )}

        {results && results.type === "departures" && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text">
              Upcoming departures — {results.stationName} ({results.data.length})
            </h2>
            {results.data.length === 0 ? (
              <div className="rounded-md border border-border bg-surface p-6 text-center">
                <p className="text-sm text-text-muted">No upcoming departures found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.data.map(({ routeStop, train, dest }) =>
                  train ? (
                    <TrainCard
                      key={routeStop.id}
                      train={train}
                      dest={dest}
                      fromDeparture={routeStop.departureTime}
                      toArrival={undefined}
                    />
                  ) : null,
                )}
              </div>
            )}
            <p className="mt-2 text-xs text-text-muted">
              Times shown are scheduled departures. Delays:{" "}
              {results.data.filter((d) => (d.delayMinutes ?? 0) > 0).length} delayed · Platform
              and status update live.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
