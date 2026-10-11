"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { getTracking } from "@/lib/data";
import { Skeleton } from "@/components/Skeleton";

function AlarmContent() {
  const params = useParams();
  const trainId = params.trainId as string;
  const tracking = getTracking(trainId);

  const [alarmStation, setAlarmStation] = useState<string>("");
  const [minutesBefore, setMinutesBefore] = useState(10);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!tracking) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">Train not found.</p>
        </div>
      </main>
    );
  }

  const { train, stops } = tracking;

  function handleSetAlarm() {
    setIsEnabled(true);
    setShowConfirmation(true);
  }

  function handleDisableAlarm() {
    setIsEnabled(false);
    setShowConfirmation(false);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href={`/track/${trainId}`} className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back to tracking
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Destination Alarm</h1>
      <p className="mb-4 text-sm text-text-muted">Wake up before your station arrives.</p>

      <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
        {/* Train info */}
        <div className="mb-4 rounded-sm bg-surface p-3">
          <p className="text-sm font-medium text-text">{train.number} — {train.name}</p>
        </div>

        {/* Station selector */}
        <div className="mb-4">
          <label htmlFor="alarm-station" className="mb-1 block text-xs font-medium text-text-muted">
            Station
          </label>
          <select
            id="alarm-station"
            value={alarmStation}
            onChange={(e) => setAlarmStation(e.target.value)}
            className="w-full rounded-md border border-border-input bg-surface-raised px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="">Select a station</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.stationId}>
                {stop.station.name} ({stop.station.code}) — Arr {stop.arrivalTime}
              </option>
            ))}
          </select>
        </div>

        {/* Minutes before */}
        <div className="mb-4">
          <label htmlFor="minutes-before" className="mb-1 block text-xs font-medium text-text-muted">
            Minutes before arrival
          </label>
          <select
            id="minutes-before"
            value={minutesBefore}
            onChange={(e) => setMinutesBefore(Number(e.target.value))}
            className="w-full rounded-md border border-border-input bg-surface-raised px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value={5}>5 minutes before</option>
            <option value={10}>10 minutes before</option>
            <option value={15}>15 minutes before</option>
            <option value={20}>20 minutes before</option>
            <option value={30}>30 minutes before</option>
          </select>
        </div>

        {/* Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-text">Alarm</span>
          <button
            role="switch"
            aria-checked={isEnabled}
            onClick={isEnabled ? handleDisableAlarm : handleSetAlarm}
            disabled={!alarmStation}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40 ${
              isEnabled ? "bg-accent" : "bg-border"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {!alarmStation && (
          <p className="text-xs text-text-muted">Select a station to enable the alarm.</p>
        )}

        {isEnabled && (
          <button
            onClick={handleDisableAlarm}
            className="w-full rounded-pill border border-danger px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-subtle"
          >
            Disable alarm
          </button>
        )}
      </div>

      {/* Confirmation */}
      {showConfirmation && alarmStation && (
        <div className="mt-4 rounded-lg border border-success bg-success-subtle p-4" role="status">
          <p className="text-sm font-medium text-success">Alarm set</p>
          <p className="text-xs text-success/80">
            {stops.find((s) => s.stationId === alarmStation)?.station.name} — {minutesBefore} min before arrival
          </p>
        </div>
      )}
    </main>
  );
}

export default function AlarmPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <AlarmContent />
    </Suspense>
  );
}
