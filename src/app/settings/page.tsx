"use client";

import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [language, setLanguage] = useState("en");
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/" className="mb-2 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>

      <h1 className="mb-4 text-lg font-bold text-text">Settings</h1>

      <div className="space-y-4">
        {/* Language */}
        <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
          <h2 className="mb-2 text-sm font-semibold text-text">Language</h2>
          <select
            aria-label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-md border border-border-input bg-surface-raised px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="te">తెలుగు</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        {/* Offline mode */}
        <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-text">Offline</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text">Offline mode</p>
              <p className="text-xs text-text-muted">Download schedules for offline use</p>
            </div>
            <button
              role="switch"
              aria-checked={offlineMode}
              onClick={() => setOfflineMode(!offlineMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                offlineMode ? "bg-accent" : "bg-border"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offlineMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-text">Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text">Push notifications</p>
              <p className="text-xs text-text-muted">Train updates and alarm alerts</p>
            </div>
            <button
              role="switch"
              aria-checked={notifications}
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? "bg-accent" : "bg-border"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-card">
          <h2 className="mb-2 text-sm font-semibold text-text">About</h2>
          <div className="space-y-1 text-sm text-text">
            <p>RailYatra v1.0.0</p>
            <p className="text-xs text-text-muted">An independent train tracking app. Not affiliated with any railway operator.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
