import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link href="/" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-text">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-text-muted">
        <section>
          <h2 className="mb-1 text-base font-semibold text-text">Data We Collect</h2>
          <p>Search history and saved trips stay on your device. PNR checks are cached temporarily. We do not run ads or third-party trackers.</p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-text">Processors</h2>
          <p>Neon (database), Vercel (hosting), Stripe (payments), Resend (email), Supabase (auth). Each processor only receives data needed to provide its service.</p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-text">Your Rights</h2>
          <p>You can delete your account and all associated data at any time. Export your saved trips before deletion by contacting support.</p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-text">Contact</h2>
          <p>Questions about this policy: support@railyatra.com</p>
        </section>
      </div>
    </main>
  );
}
