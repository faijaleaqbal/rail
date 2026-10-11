"use client";

import { useRouter } from "next/navigation";
import type { Train, Station } from "@/lib/data";

interface TrainCardProps {
  train: Train;
  source?: Station | null;
  dest?: Station | null;
  fromDeparture?: string | null;
  toArrival?: string | null;
  distanceKm?: number | null;
  durationMinutes?: number;
  onSelect?: () => void;
  isAvailable?: boolean;
}

export function TrainCard({
  train,
  source,
  dest,
  fromDeparture,
  toArrival,
  distanceKm,
  durationMinutes,
  onSelect,
  isAvailable = true,
}: TrainCardProps) {
  const router = useRouter();
  const depTime = fromDeparture ?? train.departureTime;
  const arrTime = toArrival ?? train.arrivalTime;

  return (
    <button
      onClick={onSelect ?? (() => router.push(`/track/${train.id}`))}
      disabled={!isAvailable}
      className={`w-full rounded-md border border-border bg-surface-raised p-4 text-left shadow-card transition-all hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50`}
      aria-label={`Train ${train.number} ${train.name}, departs ${depTime}, arrives ${arrTime}`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-accent">{train.number}</span>
        <span className="text-sm font-medium text-text">{train.name}</span>
      </div>

      <div className="mb-2 flex items-center gap-2 text-xs text-text-muted">
        {source && <span>{source.code}</span>}
        <span aria-hidden="true">→</span>
        {dest && <span>{dest.code}</span>}
      </div>

      <div className="flex items-center gap-4 text-sm text-text">
        <div>
          <div className="text-base font-semibold">{depTime}</div>
          {source && <div className="text-xs text-text-muted">{source.code}</div>}
        </div>
        {durationMinutes && (
          <div className="flex-1 text-center text-xs text-text-muted">
            {Math.floor(durationMinutes / 60)}h {durationMinutes % 60}m
          </div>
        )}
        <div className="text-right">
          <div className="text-base font-semibold">{arrTime}</div>
          {dest && <div className="text-xs text-text-muted">{dest.code}</div>}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <span
            key={i}
            className={`inline-flex h-5 w-5 items-center justify-center rounded-sm text-xs font-medium ${
              train.runsOnDays.includes(i)
                ? "bg-accent text-on-accent"
                : "bg-surface text-text-muted"
            }`}
          >
            {day}
          </span>
        ))}
        {distanceKm !== undefined && (
          <span className="ml-auto text-xs text-text-muted">{distanceKm} km</span>
        )}
      </div>
    </button>
  );
}
