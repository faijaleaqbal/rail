import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-text sm:text-5xl">
          Where is your train? <span className="text-accent">Exactly where. Right now.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-text-muted">
          Live train tracking with NTES-sourced accuracy, offline schedules, coach layout, and PNR checks.
          No ads. No guesswork.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/search" className="rounded-pill bg-accent px-8 py-3 text-base font-semibold text-on-accent shadow-card transition-colors hover:bg-accent-hover">
            Track a train
          </Link>
          <Link href="/pricing" className="rounded-pill border border-border bg-surface-raised px-8 py-3 text-base font-semibold text-text shadow-card transition-colors hover:border-accent hover:text-accent">
            See pricing
          </Link>
        </div>
        <p className="mt-4 text-xs text-text-muted">Free forever · No ads · Offline-ready</p>
      </section>

      <section className="mb-16 flex flex-wrap items-center justify-center gap-6 rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-2 text-sm text-text">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          No ads
        </div>
        <div className="flex items-center gap-2 text-sm text-text">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" /></svg>
          Offline schedules
        </div>
        <div className="flex items-center gap-2 text-sm text-text">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          NTES-sourced accuracy
        </div>
        <div className="flex items-center gap-2 text-sm text-text">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
          PNR status check
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text">Everything you need for your journey</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface-raised p-6 shadow-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text">Live Tracking</h3>
            <p className="text-sm text-text-muted">Real-time train location on a vertical timeline. See every station, ETA, and platform number.</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-raised p-6 shadow-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text">Offline Schedules</h3>
            <p className="text-sm text-text-muted">Full Indian Railways timetable works without internet or GPS. Search by station or train number.</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-raised p-6 shadow-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text">Coach Layout</h3>
            <p className="text-sm text-text-muted">See rake position, seat/berth layout, and your booked coach before you board.</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text">Three steps to your platform</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-on-accent">1</div>
            <h3 className="mb-1 text-base font-semibold text-text">Search</h3>
            <p className="text-sm text-text-muted">Enter stations or train number. Smart search handles spelling errors.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-on-accent">2</div>
            <h3 className="mb-1 text-base font-semibold text-text">Track</h3>
            <p className="text-sm text-text-muted">See live position, ETA, and platform on a vertical timeline.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-on-accent">3</div>
            <h3 className="mb-1 text-base font-semibold text-text">Arrive</h3>
            <p className="text-sm text-text-muted">Get alarm before your stop. Know your coach position.</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text">Why RailYatra</h2>
        <div className="overflow-x-auto rounded-lg border border-border shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-medium text-text-muted">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-accent">RailYatra</th>
                <th className="px-4 py-3 text-center font-medium text-text-muted">Other apps</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border"><td className="px-4 py-3 text-text">Ads</td><td className="px-4 py-3 text-center text-success font-medium">No</td><td className="px-4 py-3 text-center text-danger font-medium">Yes</td></tr>
              <tr className="border-b border-border"><td className="px-4 py-3 text-text">Accuracy indicator</td><td className="px-4 py-3 text-center text-success font-medium">Yes</td><td className="px-4 py-3 text-center text-danger font-medium">No</td></tr>
              <tr className="border-b border-border"><td className="px-4 py-3 text-text">Offline schedules</td><td className="px-4 py-3 text-center text-success font-medium">Yes</td><td className="px-4 py-3 text-center text-danger font-medium">No</td></tr>
              <tr className="border-b border-border"><td className="px-4 py-3 text-text">Price</td><td className="px-4 py-3 text-center text-success font-medium">Free</td><td className="px-4 py-3 text-center text-warning font-medium">Free + Paid</td></tr>
              <tr><td className="px-4 py-3 text-text">Data source</td><td className="px-4 py-3 text-center text-success font-medium">NTES</td><td className="px-4 py-3 text-center text-warning font-medium">Mixed</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16 rounded-lg bg-accent-subtle p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-text">Ready to track your train?</h2>
        <p className="mb-4 text-text-muted">Start with the free tier. No account needed.</p>
        <Link href="/search" className="inline-block rounded-pill bg-accent px-8 py-3 text-base font-semibold text-on-accent shadow-card transition-colors hover:bg-accent-hover">
          Find your train
        </Link>
      </section>

      <footer className="border-t border-border pt-8 text-center">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
          <Link href="/search" className="hover:text-accent">Search</Link>
          <Link href="/pricing" className="hover:text-accent">Pricing</Link>
          <Link href="/pnr" className="hover:text-accent">PNR Check</Link>
          <Link href="/track/tr-12658" className="hover:text-accent">Live Demo</Link>
        </div>
        <p className="text-xs text-text-muted">RailYatra — Live train tracking. An independent app, not affiliated with any railway operator.</p>
      </footer>
    </main>
  );
}
