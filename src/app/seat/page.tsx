"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { searchTrainByNumber } from "@/lib/data";
import type { Train } from "@/data/seed";

interface SeatAvailability {
  trainId: string;
  trainName: string;
  classCode: string;
  journeyDate: string;
  quota: string;
  availability: string;
}

export default function SeatAvailabilityPage() {
  const [trainQuery, setTrainQuery] = useState("");
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [classCode, setClassCode] = useState("SL");
  const [journeyDate, setJourneyDate] = useState("");

  useEffect(() => {
    setJourneyDate(new Date().toISOString().split("T")[0]);
  }, []);
  const [quota, setQuota] = useState("GN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SeatAvailability | null>(null);

  const classes = ["SL", "3A", "2A", "1A", "CC", "EC", "2S"];
  const quotas = ["GN", "LD", "HO", "DF", "PH", "SS", "TQ"];

  function handleCheck() {
    setError(null);
    setResult(null);

    if (!selectedTrain) {
      setError("Search and select a train first.");
      return;
    }
    if (!journeyDate) {
      setError("Enter a journey date.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setResult({
        trainId: selectedTrain.id,
        trainName: selectedTrain.name,
        classCode,
        journeyDate,
        quota,
        availability: "AVAILABLE 12",
      });
      setIsLoading(false);
    }, 500);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/search" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Seat Availability</h1>
      <p className="mb-4 text-sm text-text-muted">Check availability by train, class, and date.</p>

      {/* Train search */}
      <div className="mb-4">
        <label htmlFor="train-query" className="mb-1 block text-xs font-medium text-text-muted">
          Train number or name
        </label>
        <input
          id="train-query"
          type="text"
          placeholder="e.g. 12658 or Chennai Mail"
          value={trainQuery}
          onChange={(e) => {
            setTrainQuery(e.target.value);
            setSelectedTrain(null);
          }}
          className="w-full rounded-md border border-border-input bg-surface-raised px-3 py-2 text-sm text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        {trainQuery && !selectedTrain && (
          <div className="mt-1 rounded-md border border-border bg-surface-raised">
            {searchTrainByNumber(trainQuery).map(({ train }) => (
              <button
                key={train.id}
                onClick={() => {
                  setSelectedTrain(train);
                  setTrainQuery(train.name);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-text hover:bg-accent-subtle"
              >
                {train.number} — {train.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Class */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-text-muted">Class</label>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select class">
          {classes.map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={classCode === c}
              onClick={() => setClassCode(c)}
              className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-all ${
                classCode === c
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border bg-surface-raised text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="mb-4">
        <label htmlFor="journey-date" className="mb-1 block text-xs font-medium text-text-muted">
          Journey date
        </label>
        <input
          id="journey-date"
          type="date"
          value={journeyDate}
          onChange={(e) => setJourneyDate(e.target.value)}
          className="w-full rounded-md border border-border-input bg-surface-raised px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Quota */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-text-muted">Quota</label>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select quota">
          {quotas.map((q) => (
            <button
              key={q}
              role="radio"
              aria-checked={quota === q}
              onClick={() => setQuota(q)}
              className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-all ${
                quota === q
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border bg-surface-raised text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        onClick={handleCheck}
        disabled={isLoading}
        className="mt-4 w-full rounded-pill bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {isLoading ? "Checking…" : "Check availability"}
      </button>

      {result && (
        <div className="mt-4 rounded-lg border border-border bg-surface-raised p-4 shadow-card" aria-live="polite">
          <h2 className="mb-3 text-sm font-semibold text-text">Availability</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Train</span>
              <span className="font-medium text-text">{result.trainId} — {result.trainName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Class</span>
              <span className="font-medium text-text">{result.classCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Date</span>
              <span className="font-medium text-text">{result.journeyDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Quota</span>
              <span className="font-medium text-text">{result.quota}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-text-muted">Status</span>
              <span className="rounded-pill bg-success-subtle px-2 py-0.5 text-xs font-semibold text-success">
                {result.availability}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
