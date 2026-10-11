"use client";

interface DateFilterChipsProps {
  selected: "today" | "tomorrow" | "calendar";
  onChange: (value: "today" | "tomorrow" | "calendar") => void;
}

export function DateFilterChips({ selected, onChange }: DateFilterChipsProps) {
  const options: { id: "today" | "tomorrow" | "calendar"; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "calendar", label: "Pick a date" },
  ];

  return (
    <div role="radiogroup" aria-label="Date filter" className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          role="radio"
          aria-checked={selected === opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-pill border px-4 py-1.5 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-accent ${
            selected === opt.id
              ? "border-accent bg-accent text-on-accent"
              : "border-border bg-surface-raised text-text-muted hover:border-accent hover:text-accent"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
