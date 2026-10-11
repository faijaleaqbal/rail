"use client";

import { useState } from "react";
import Link from "next/link";

export default function PNRPage() {
  const [pnr, setPnr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    pnr: string;
    train: string;
    passengers: { name: string; status: string; coach: string; berth: string }[];
    chartStatus: string;
  } | null>(null);

  async function handleCheck() {
    setError(null);
    setResult(null);

    if (!pnr.trim()) {
      setError("Enter a 10-digit PNR number.");
      return;
    }
    if (!/^\d{10}$/.test(pnr.trim())) {
      setError("PNR must be exactly 10 digits.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/pnr/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr: pnr.trim() }),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        setError(
          res.status === 404
            ? "PNR not found. Check the number and try again."
            : (json?.error?.message ?? "PNR lookup failed. Try again."),
        );
        return;
      }
      const data = json.data as {
        pnr: string;
        found: boolean;
        train: { id: string; number: string; name: string } | null;
        passengers: { coach: string; berth: number; berthType: string; status: string }[];
        chartStatus: string | null;
      };
      if (!data.found) {
        setError("PNR not found. Check the number and try again.");
        return;
      }
      setResult({
        pnr: data.pnr,
        train: data.train ? `${data.train.number} — ${data.train.name}` : "PNR booking",
        passengers: data.passengers.map((p, i) => ({
          name: `Passenger ${i + 1}`,
          status: p.status,
          coach: p.coach,
          berth: `${p.berth} — ${p.berthType.replace(/_/g, " ")}`,
        })),
        chartStatus: data.chartStatus ?? "Unknown",
      });
    } catch {
      setError("PNR lookup failed. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">PNR Status</h1>
      <p className="mb-4 text-sm text-text-muted">Check your booking status by PNR number.</p>

      <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
        <label htmlFor="pnr-input" className="mb-1 block text-xs font-medium text-text-muted">
          PNR Number
        </label>
        <div className="flex gap-2">
          <input
            id="pnr-input"
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit PNR"
            value={pnr}
            onChange={(e) => setPnr(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheck();
            }}
            className="flex-1 rounded-md border border-border-input bg-surface-raised px-3 py-2.5 text-base text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            aria-describedby="pnr-hint"
          />
          <button
            onClick={handleCheck}
            disabled={isLoading}
            className="rounded-pill bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Checking…" : "Check"}
          </button>
        </div>
        <p id="pnr-hint" className="mt-1 text-xs text-text-muted">
          Find your PNR on your ticket or in your booking confirmation email.
        </p>

        {error && (
          <p role="alert" className="mt-3 rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="mt-4 rounded-lg border border-border bg-surface-raised p-4 shadow-card" aria-live="polite">
          <h2 className="mb-3 text-sm font-semibold text-text">Booking Status</h2>
          <div className="mb-3 rounded-sm bg-surface p-3">
            <p className="text-sm font-medium text-text">{result.train}</p>
            <p className="text-xs text-text-muted">PNR: {result.pnr}</p>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-text-muted">Chart Status</span>
            <span className="rounded-pill bg-success-subtle px-2 py-0.5 text-xs font-semibold text-success">
              {result.chartStatus}
            </span>
          </div>

          <div role="table" aria-label="Passenger details">
            <div className="grid grid-cols-4 gap-2 border-b border-border pb-2 text-xs font-semibold text-text-muted">
              <span>Passenger</span>
              <span>Status</span>
              <span>Coach</span>
              <span>Berth</span>
            </div>
            {result.passengers.map((p, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 border-b border-border py-2 text-sm text-text last:border-0">
                <span>{p.name}</span>
                <span>
                  <span className="rounded-pill bg-success-subtle px-2 py-0.5 text-xs font-semibold text-success">
                    {p.status}
                  </span>
                </span>
                <span>{p.coach}</span>
                <span>{p.berth}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
