"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { getTracking } from "@/lib/data";
import { Skeleton } from "@/components/Skeleton";

function ShareContent() {
  const params = useParams();
  const trainId = params.trainId as string;
  const tracking = getTracking(trainId);
  const [copied, setCopied] = useState(false);

  if (!tracking) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">Train not found.</p>
        </div>
      </main>
    );
  }

  const { train, source, dest, nextStation, running } = tracking;
  const shareUrl = `https://railyatra.app/track/${trainId}`;
  const shareMessage = `Track ${train.number} ${train.name} live on RailYatra. ${source?.code} → ${dest?.code}. ${running?.status === "late" ? `${running.delayMinutes} min late` : "On time"}.`;

  function handleCopy() {
    navigator.clipboard?.writeText(shareMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `RailYatra — ${train.name}`,
        text: shareMessage,
        url: shareUrl,
      });
    } else {
      handleCopy();
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href={`/track/${trainId}`} className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back to tracking
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Share Live Location</h1>
      <p className="mb-4 text-sm text-text-muted">Share train location with friends and family.</p>

      <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
        {/* Train info */}
        <div className="mb-4 rounded-sm bg-surface p-3">
          <p className="text-sm font-medium text-text">{train.number} — {train.name}</p>
          <p className="text-xs text-text-muted">{source?.name} → {dest?.name}</p>
        </div>

        {/* Status */}
        {running && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-text-muted">Status:</span>
            <span className={`rounded-pill px-2 py-0.5 text-xs font-semibold ${
              running.status === "on_time" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"
            }`}>
              {running.delayMinutes > 0 ? `${running.delayMinutes} min late` : "On time"}
            </span>
          </div>
        )}

        {/* Next station */}
        {nextStation && (
          <div className="mb-4 text-sm">
            <span className="text-text-muted">Next:</span>{" "}
            <span className="font-medium text-text">{nextStation.name}</span>
          </div>
        )}

        {/* Share message */}
        <div className="mb-4 rounded-md border border-border bg-surface p-3">
          <p className="text-sm text-text">{shareMessage}</p>
          <p className="mt-1 text-xs text-text-muted">{shareUrl}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 rounded-pill bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Share
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 rounded-pill border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-text-muted text-center">
        Share link shows live train position. Recipient does not need the app.
      </p>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ShareContent />
    </Suspense>
  );
}
