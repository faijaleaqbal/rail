"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { CoachLayoutData } from "@/lib/data";
import { Skeleton } from "@/components/Skeleton";

function CoachLayoutContent() {
  const params = useParams();
  const trainId = params.trainId as string;
  const [layout, setLayout] = useState<CoachLayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/train/${encodeURIComponent(trainId)}/coach-layout`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || json?.success === false) {
          if (res.status === 404) {
            setLayout(null);
          } else {
            setError(json?.error?.message ?? "Failed to load coach layout.");
          }
          return;
        }
        const data = json.data as NonNullable<CoachLayoutData>;
        setLayout(data);
        const firstWithBerths = data.berths.find((b) => b.berths.length > 0);
        setSelectedCoachId(firstWithBerths?.coach.id ?? data.berths[0]?.coach.id ?? data.rake[0]?.id ?? null);
      } catch {
        if (!cancelled) setError("Failed to load coach layout. Check your connection.");
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
        <h1 className="sr-only">Loading coach layout</h1>
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-lg font-bold text-text">Coach & Seat Arrangement</h1>
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">{error}</p>
          <Link href="/" className="mt-2 inline-block text-sm text-accent hover:underline">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  if (!layout) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-lg font-bold text-text">Coach & Seat Arrangement</h1>
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">coach layout not available for this train.</p>
          <Link href="/" className="mt-2 inline-block text-sm text-accent hover:underline">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  const { rake, berths } = layout;
  const selected = berths.find((b) => b.coach.id === selectedCoachId && b.berths.length > 0)
    ?? berths.find((b) => b.berths.length > 0)
    ?? berths[0];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Coach & Seat Arrangement</h1>
      <p className="mb-4 text-sm text-text-muted">Train {trainId}</p>

      {/* Rake strip */}
      <div className="mb-4 rounded-md border border-border bg-surface-raised p-4 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-text">Rake Order</h2>
        <div className="flex items-center gap-1 overflow-x-auto" role="list" aria-label="Coach sequence">
          {rake.map((coach) => (
            <div
              key={coach.id}
              role="listitem"
              className={`flex h-12 min-w-14 flex-col items-center justify-center rounded-sm border px-2 ${
                coach.coachType === "sleeper"
                  ? "border-accent bg-accent-subtle"
                  : "border-border bg-surface"
              }`}
              aria-label={`${coach.coachCode} ${coach.coachType}, position ${coach.positionInRake} of ${coach.totalCoaches}`}
            >
              <span className="text-xs font-semibold text-text">{coach.coachCode}</span>
              <span className="text-[10px] text-text-muted">{coach.coachType}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
          <span>Position 1 (Engine)</span>
          <span>Position {rake.length} (Last)</span>
        </div>
      </div>

      {/* Berth layout for selected coach */}
      {selected && (
        <div className="rounded-md border border-border bg-surface-raised p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-text">
            {selected.coach.coachCode} — {selected.coach.coachType}
          </h2>
          <div className="grid grid-cols-4 gap-2" role="grid" aria-label="Seat layout">
            <div role="row" className="contents">
            {selected.berths.map((berth) => (
              <div
                key={berth.id}
                role="gridcell"
                className={`flex h-12 flex-col items-center justify-center rounded-sm border ${
                  berth.isBooked
                    ? "border-accent bg-accent text-on-accent"
                    : "border-border bg-surface text-text"
                }`}
                aria-label={`Seat ${berth.berthNumber}, ${berth.berthType}${berth.isBooked ? ", booked" : ""}`}
              >
                <span className="text-xs font-semibold">{berth.berthNumber}</span>
                <span className="text-[10px]">{berth.berthType.replace("_", " ")}</span>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {/* Coach selector */}
      <div className="mt-4 rounded-md border border-border bg-surface-raised p-4 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-text">Select Coach</h2>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select coach">
          {rake.map((coach) => (
            <button
              key={coach.id}
              role="radio"
              aria-checked={coach.id === selected?.coach.id}
              onClick={() => setSelectedCoachId(coach.id)}
              className={`rounded-pill border px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-accent ${
                coach.id === selected?.coach.id
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {coach.coachCode}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CoachLayoutPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <CoachLayoutContent />
    </Suspense>
  );
}
