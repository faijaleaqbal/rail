import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-text">Simple pricing</h1>
        <p className="mx-auto max-w-xl text-lg text-text-muted">
          Start free. Upgrade when you need saved trips, alarms, and PNR auto-updates.
        </p>
      </div>

      <div className="mb-16 grid gap-8 sm:grid-cols-2">
        {/* Free tier */}
        <div className="rounded-lg border border-border bg-surface-raised p-8 shadow-card">
          <h2 className="mb-2 text-xl font-bold text-text">Free</h2>
          <p className="mb-6 text-3xl font-bold text-text">₹0<span className="text-base font-normal text-text-muted">/forever</span></p>
          <ul className="mb-6 space-y-3 text-sm text-text">
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Live train search & tracking
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Station departure board
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Coach layout & seat map
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              PNR status check
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Offline schedules
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              No ads
            </li>
          </ul>
          <Link
            href="/search"
            className="block w-full rounded-pill border border-border bg-surface px-6 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
          >
            Start free
          </Link>
        </div>

        {/* Pro tier */}
        <div className="rounded-lg border-2 border-accent bg-surface-raised p-8 shadow-card">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-xl font-bold text-text">Pro</h2>
            <span className="rounded-pill bg-accent-subtle px-2 py-0.5 text-xs font-semibold text-accent">Recommended</span>
          </div>
          <p className="mb-6 text-3xl font-bold text-text">₹99<span className="text-base font-normal text-text-muted">/month</span> <span className="text-sm text-success">or ₹999/year</span></p>
          <ul className="mb-6 space-y-3 text-sm text-text">
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Everything in Free
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Saved trips & frequent routes
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Destination alarm (offline)
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              PNR auto-update + email alerts
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Speedometer (GPS)
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Metro & local train tracking
            </li>
          </ul>
          <button
            className="w-full rounded-pill bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
            aria-label="Subscribe to Pro plan via Stripe"
          >
            Subscribe — Stripe checkout
          </button>
        </div>
      </div>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-text">Frequently asked</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <h3 className="mb-1 text-sm font-semibold text-text">Is RailYatra affiliated with Indian Railways?</h3>
            <p className="text-sm text-text-muted">No. RailYatra is an independent app. We source data from public NTES APIs and our own compiled timetable.</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <h3 className="mb-1 text-sm font-semibold text-text">Does it work offline?</h3>
            <p className="text-sm text-text-muted">Yes. The schedule database works without internet or GPS. Live tracking needs a data connection.</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <h3 className="mb-1 text-sm font-semibold text-text">Can I cancel anytime?</h3>
            <p className="text-sm text-text-muted">Yes. Cancel from your account or the Stripe customer portal. One click, no emails needed.</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <h3 className="mb-1 text-sm font-semibold text-text">What data do you collect?</h3>
            <p className="text-sm text-text-muted">Search history and saved trips stay on your device. PNR checks are cached temporarily. No ads, no third-party trackers.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
