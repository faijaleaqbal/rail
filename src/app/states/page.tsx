"use client";

import Link from "next/link";

interface SystemStatesProps {
  type: "empty" | "error" | "offline" | "permission-denied";
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, message, actionLabel, actionHref }: Omit<SystemStatesProps, "type">) {
  return (
    <div className="rounded-md border border-border bg-surface p-8 text-center" role="status">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h2 className="mb-1 text-base font-semibold text-text">{title}</h2>
      <p className="text-sm text-text-muted">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-4 inline-block rounded-pill bg-accent px-6 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({ title, message, actionLabel, actionHref }: Omit<SystemStatesProps, "type">) {
  return (
    <div className="rounded-md border border-danger bg-danger-subtle p-8 text-center" role="alert">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger-subtle">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-danger" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h2 className="mb-1 text-base font-semibold text-danger">{title}</h2>
      <p className="text-sm text-danger/80">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-4 inline-block rounded-pill bg-danger px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger/90">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function OfflineState({ title, message }: Omit<SystemStatesProps, "type" | "actionLabel" | "actionHref">) {
  return (
    <div className="rounded-md border border-border bg-surface p-8 text-center" role="status">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      </div>
      <h2 className="mb-1 text-base font-semibold text-text">{title}</h2>
      <p className="text-sm text-text-muted">{message}</p>
      <p className="mt-2 text-xs text-text-muted">Offline schedules are still available. Live tracking needs a connection.</p>
    </div>
  );
}

export function PermissionDeniedState({ title, message }: Omit<SystemStatesProps, "type" | "actionLabel" | "actionHref">) {
  return (
    <div className="rounded-md border border-border bg-surface p-8 text-center" role="alert">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="mb-1 text-base font-semibold text-text">{title}</h2>
      <p className="text-sm text-text-muted">{message}</p>
      <button className="mt-4 rounded-pill border border-border bg-surface-raised px-6 py-2 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent">
        Grant permission
      </button>
    </div>
  );
}

export default function SystemStatesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-lg font-bold text-text">System States</h1>

      <div className="space-y-4">
        <EmptyState
          title="No trains found"
          message="No trains match your search. Try different stations or a train number."
          actionLabel="Search again"
          actionHref="/search"
        />
        <ErrorState
          title="Something went wrong"
          message="We couldn't load the data. Check your connection and try again."
          actionLabel="Retry"
          actionHref="/search"
        />
        <OfflineState
          title="You are offline"
          message="Live tracking is unavailable without a connection. Schedules still work."
        />
        <PermissionDeniedState
          title="Location permission needed"
          message="Grant location access to see your position relative to the train."
        />
      </div>
    </main>
  );
}
