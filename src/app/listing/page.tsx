export default function ListingPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-text">Store Listing</h1>

      {/* App Store */}
      <section className="mb-12 rounded-lg border border-border bg-surface-raised p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-text">Apple App Store</h2>
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-medium text-text-muted">App Name:</span>
            <span className="ml-2 text-text">RailYatra — Live Train Tracking</span>
          </div>
          <div>
            <span className="font-medium text-text-muted">Subtitle:</span>
            <span className="ml-2 text-text">Track trains, schedules & PNR status</span>
          </div>
          <div>
            <span className="font-medium text-text-muted">Keywords:</span>
            <span className="ml-2 text-text">train, tracking, live, indian, railways, schedule, pnr, coach, platform, offline, metro, local</span>
          </div>
          <div>
            <span className="font-medium text-text-muted">Description:</span>
            <p className="mt-1 text-text">
              RailYatra is the fast, accurate way to track Indian Railways trains. See live train position,
              station-by-station ETAs, platform numbers, and coach layout — all on a clean vertical timeline.
              Works offline. No ads. Free forever.
            </p>
          </div>
          <div>
            <span className="font-medium text-text-muted">Ratings:</span>
            <span className="ml-2 text-text">Coming soon</span>
          </div>
        </div>
      </section>

      {/* Play Store */}
      <section className="mb-12 rounded-lg border border-border bg-surface-raised p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-text">Play Store</h2>
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-medium text-text-muted">App Name:</span>
            <span className="ml-2 text-text">RailYatra — Live Train Tracking</span>
          </div>
          <div>
            <span className="font-medium text-text-muted">Short Description:</span>
            <span className="ml-2 text-text">Live train tracking, offline schedules, coach layout & PNR status. No ads.</span>
          </div>
          <div>
            <span className="font-medium text-text-muted">Full Description:</span>
            <p className="mt-1 text-text">
              Where is your train? Exactly where. Right now.

              RailYatra gives you:
              • Live train tracking on a vertical timeline
              • Station departure boards
              • Platform numbers and coach layout
              • PNR status check
              • Offline schedules (no internet needed)
              • Metro and local train tracking

              No ads. No account needed. Free forever.
            </p>
          </div>
        </div>
      </section>

      {/* Screenshots placeholder */}
      <section className="rounded-lg border border-border bg-surface-raised p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-text">Screenshots</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex h-48 items-center justify-center rounded-md border border-border bg-surface text-xs text-text-muted">Search screen</div>
          <div className="flex h-48 items-center justify-center rounded-md border border-border bg-surface text-xs text-text-muted">Tracking timeline</div>
          <div className="flex h-48 items-center justify-center rounded-md border border-border bg-surface text-xs text-text-muted">Coach layout</div>
        </div>
      </section>
    </main>
  );
}
