"use client";

import { useState } from "react";
import Link from "next/link";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
];

export default function LanguagePage() {
  const [selected, setSelected] = useState("en");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>

      <h1 className="mb-1 text-lg font-bold text-text">Language</h1>
      <p className="mb-4 text-sm text-text-muted">Choose your preferred language.</p>

      <div className="grid gap-2" role="radiogroup" aria-label="Select language">
        {languages.map((lang) => (
          <button
            key={lang.code}
            role="radio"
            aria-checked={selected === lang.code}
            onClick={() => setSelected(lang.code)}
            className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition-all ${
              selected === lang.code
                ? "border-accent bg-accent-subtle"
                : "border-border bg-surface-raised hover:border-accent"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-text">{lang.name}</p>
              <p className="text-xs text-text-muted">{lang.native}</p>
            </div>
            {selected === lang.code && (
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-text-muted">
        Language is saved on your device. No account needed.
      </p>
    </main>
  );
}
