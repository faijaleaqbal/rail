import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link href="/" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-text">Support</h1>
      <div className="space-y-4 text-sm text-text-muted">
        <section>
          <h2 className="mb-1 text-base font-semibold text-text">Email</h2>
          <p>support@railyatra.com — we respond within 24 hours.</p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-text">Common Issues</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Train location shows &quot;Estimated&quot; — means no live data available for this train right now</li>
            <li>PNR check fails — make sure you entered the 10-digit number correctly</li>
            <li>Platform shows TBD — platform numbers are assigned by railways closer to departure</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-text">Data Disclaimer</h2>
          <p>RailYatra is an independent app. Always confirm critical travel information through official Indian Railways channels (NTES, IRCTC, station counters).</p>
        </section>
      </div>
    </main>
  );
}
