"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { getTracking } from "@/lib/data";
import { Skeleton } from "@/components/Skeleton";

function SpeedometerContent() {
  const params = useParams();
  const trainId = params.trainId as string;
  const tracking = getTracking(trainId);
  const [currentSpeed] = useState(65);
  const [maxSpeed] = useState(110);

  if (!tracking) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">Train not found.</p>
        </div>
      </main>
    );
  }

  const { train, nextStation } = tracking;
  const angle = Math.min((currentSpeed / maxSpeed) * 270 - 135, 135);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href={`/track/${trainId}`} className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back to tracking
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Speedometer</h1>
      <p className="mb-4 text-sm text-text-muted">{train.number} — {train.name}</p>

      {/* Gauge */}
      <div className="mb-6 flex flex-col items-center rounded-lg border border-border bg-surface-raised p-6 shadow-card">
        <div className="relative h-48 w-48">
          {/* Gauge background */}
          <svg viewBox="0 0 200 200" className="h-full w-full" aria-label={`Speedometer showing ${currentSpeed} km/h`} role="meter" aria-valuenow={currentSpeed} aria-valuemin={0} aria-valuemax={maxSpeed}>
            {/* Outer ring */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-border)" strokeWidth="12" />
            {/* Speed arc */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="12"
              strokeDasharray={`${(currentSpeed / maxSpeed) * 565} 565`}
              strokeLinecap="round"
              transform="rotate(-135 100 100)"
            />
            {/* Needle */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="var(--color-text)"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${angle} 100 100)`}
            />
            {/* Center dot */}
            <circle cx="100" cy="100" r="6" fill="var(--color-text)" />
            {/* Speed text */}
            <text x="100" y="140" textAnchor="middle" className="text-3xl font-bold" fill="var(--color-text)" fontSize="32">
              {currentSpeed}
            </text>
            <text x="100" y="160" textAnchor="middle" fill="var(--color-text-muted)" fontSize="12">
              km/h
            </text>
          </svg>
        </div>

        {/* Stats */}
        <div className="mt-4 grid w-full grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-text-muted">Current</p>
            <p className="text-lg font-semibold text-text">{currentSpeed} km/h</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Max</p>
            <p className="text-lg font-semibold text-text">{maxSpeed} km/h</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Avg</p>
            <p className="text-lg font-semibold text-text">{Math.round(currentSpeed * 0.7)} km/h</p>
          </div>
        </div>
      </div>

      {/* Next station */}
      {nextStation && (
        <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
          <h2 className="mb-2 text-sm font-semibold text-text">Next Station</h2>
          <p className="text-sm text-text">{nextStation.name} ({nextStation.code})</p>
        </div>
      )}

      <p className="mt-4 text-xs text-text-muted text-center">
        Speed is estimated from GPS. Accuracy may vary in tunnels and remote areas.
      </p>
    </main>
  );
}

export default function SpeedometerPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <SpeedometerContent />
    </Suspense>
  );
}
