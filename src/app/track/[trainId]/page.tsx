"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { TrackingData } from "@/lib/data";
import { StatusBadge, PlatformBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/Skeleton";

type BadgeStatus = "on_time" | "late" | "early" | "delayed" | "cancelled" | "unknown";

function toBadgeStatus(s: string): BadgeStatus {
  return s === "on_time" ||
    s === "late" ||
    s === "early" ||
    s === "delayed" ||
    s === "cancelled" ||
    s === "unknown"
    ? s
    : "unknown";
}

function TrackingContent() {
  const params = useParams();
  const trainId = params.trainId as string;
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/train/${encodeURIComponent(trainId)}/tracking`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || json?.success === false) {
          if (res.status === 404) {
            setTracking(null);
          } else {
            setError(json?.error?.message ?? "Failed to load tracking.");
          }
          return;
        }
        setTracking(json.data as TrackingData);
      } catch {
        if (!cancelled) setError("Failed to load tracking. Check your connection.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    if (trainId) void load();
    return () => {
      cancelled = true;
    };
  }, [trainId]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <h1 className="sr-only">Loading train tracking</h1>
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-lg font-bold text-text">Train Tracking</h1>
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">{error}</p>
          <Link href="/" className="mt-2 inline-block text-sm text-accent hover:underline">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  if (!tracking) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-lg font-bold text-text">Train Tracking</h1>
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">Train not found.</p>
          <Link href="/" className="mt-2 inline-block text-sm text-accent hover:underline">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  const { train, source, dest, stops, running, currentStation, nextStation } = tracking;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <Link href="/" className="mb-2 inline-block text-sm text-accent hover:underline">
          ← Back
        </Link>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-text">
              {train ? `${train.number} — ${train.name}` : "Unknown train"}
            </h1>
            <p className="text-sm text-text-muted">
              {source?.name} → {dest?.name}
            </p>
          </div>
          {running && (
            <div className="ml-auto">
              <StatusBadge status={toBadgeStatus(running.status)} delayMinutes={running.delayMinutes} />
            </div>
          )}
        </div>
      </div>

      {/* Day selector */}
      <div className="mb-4 flex items-center justify-between rounded-md border border-border bg-surface-raised px-4 py-3 shadow-card">
        <span className="text-sm font-medium text-text">Day 1 — {today}</span>
        <span className="rounded-pill bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent">
          {running?.source === "cell_tower" ? "Cell Tower" : "Live"}
        </span>
      </div>

      {/* Timeline */}
      {stops.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">No route data available for this train.</p>
        </div>
      ) : (
        <div className="relative ml-4 border-l-2 border-accent pl-6" role="list" aria-label="Route stations">
          {stops.map((stop, idx) => {
            const isCurrent = currentStation?.id === stop.stationId;
            const isNext = nextStation?.id === stop.stationId;
            const isPassed = running?.currentStationId
              ? stops.findIndex((s) => s.stationId === running.currentStationId) > idx
              : false;

            return (
              <div
                key={stop.id}
                role="listitem"
                className="relative pb-6 last:pb-0"
                aria-label={`${stop.station.name}, ${stop.distanceKm} km, ${stop.platform ? `Platform ${stop.platform}` : "Platform TBD"}`}
              >
                {/* Station dot */}
                <div
                  className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 ${
                    isCurrent
                      ? "border-accent bg-accent"
                      : isNext
                        ? "border-accent bg-accent-subtle"
                        : isPassed
                          ? "border-border bg-surface"
                          : "border-border bg-bg"
                  }`}
                  aria-hidden="true"
                />

                {/* Train icon at current position */}
                {isCurrent && (
                  <div className="absolute -left-[37px] top-0 flex h-6 w-6 items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="currentColor" aria-hidden="true">
                      <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2h3.54l2 2H18v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  </div>
                )}

                {/* Station info */}
                <div className={`rounded-md border border-border bg-surface-raised p-3 shadow-card ${isCurrent ? "ring-2 ring-accent/20" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${isPassed ? "text-text-muted" : isCurrent ? "text-accent" : "text-text"}`}>
                        {stop.station.name}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {stop.distanceKm} km
                        {stop.platform && ` · Platform ${stop.platform}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text">{stop.arrivalTime}</p>
                      <p className="text-xs text-text-muted">{stop.departureTime}</p>
                    </div>
                  </div>

                  {isCurrent && running && (
                    <div className="mt-2 flex items-center gap-2 rounded-sm bg-accent-subtle px-2 py-1">
                      <span className="text-xs font-medium text-accent">Current location</span>
                      {running.delayMinutes > 0 && (
                        <span className="text-xs text-danger">+{running.delayMinutes} min</span>
                      )}
                    </div>
                  )}

                  {isNext && running?.etaNext && (
                    <div className="mt-2 flex items-center gap-2 rounded-sm bg-surface px-2 py-1">
                      <span className="text-xs text-text-muted">Next: ETA {running.etaNext}</span>
                      <span className="text-xs text-text-muted">
                        ({running.distanceToNextKm?.toFixed(0)} km away)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom sheet — ETA details */}
      {running && (
        <div className="mt-6 rounded-lg border border-border bg-surface-raised p-4 shadow-card" role="region" aria-label="Journey details">
          <h2 className="mb-3 text-sm font-semibold text-text">Journey Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-muted">Next station</p>
              <p className="text-sm font-medium text-text">{nextStation?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">ETA next</p>
              <p className="text-sm font-medium text-text">{running.etaNext ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Distance to next</p>
              <p className="text-sm font-medium text-text">
                {running.distanceToNextKm !== null ? `${running.distanceToNextKm.toFixed(0)} km` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Distance to destination</p>
              <p className="text-sm font-medium text-text">
                {running.distanceToDestKm !== null ? `${running.distanceToDestKm.toFixed(0)} km` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Status</p>
              <div className="mt-0.5">
                <StatusBadge status={toBadgeStatus(running.status)} delayMinutes={running.delayMinutes} />
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted">Last updated</p>
              <p className="text-sm font-medium text-text">
                {running.lastUpdated
                  ? new Date(running.lastUpdated).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          {nextStation && (
            <div className="mt-3">
              <PlatformBadge platform={stops.find((s) => s.stationId === nextStation.id)?.platform ?? null} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <TrackingContent />
    </Suspense>
  );
}
