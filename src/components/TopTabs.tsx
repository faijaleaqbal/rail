"use client";

interface TopTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TopTabs({ tabs, activeTab, onTabChange }: TopTabsProps) {
  return (
    <div role="tablist" aria-label="Search mode" className="flex gap-1 rounded-pill border border-border bg-surface p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 rounded-pill px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-accent ${
            activeTab === tab.id
              ? "bg-accent text-on-accent shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
