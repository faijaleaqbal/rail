"use client";

import { useRef, useState, useEffect } from "react";
import type { Station } from "@/lib/data";

interface SearchBarProps {
  label: string;
  placeholder: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  variant?: "from" | "to" | "train-number" | "station-board";
}

export function SearchBar({ label, placeholder, value, onChange, variant = "from" }: SearchBarProps) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [prevValueId, setPrevValueId] = useState<string | null>(value?.id ?? null);
  if ((value?.id ?? null) !== prevValueId) {
    setPrevValueId(value?.id ?? null);
    if (value) setQuery(value.name);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const requestIdRef = useRef(0);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    setHighlightIdx(-1);

    if (variant === "from" || variant === "to" || variant === "station-board") {
      if (q.trim().length < 1) {
        setSuggestions([]);
        setIsOpen(false);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const requestId = ++requestIdRef.current;
      fetch(`/api/search/stations?q=${encodeURIComponent(q)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (requestIdRef.current !== requestId) return;
          const raw = json?.data?.stations ?? json?.data ?? [];
          const results = Array.isArray(raw) ? (raw as Station[]) : [];
          setSuggestions(results);
          setIsOpen(q.trim().length > 0);
        })
        .catch(() => {
          if (requestIdRef.current !== requestId) return;
          setSuggestions([]);
          setIsOpen(false);
        })
        .finally(() => {
          if (requestIdRef.current !== requestId) return;
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  }

  function handleSelect(station: Station) {
    setQuery(station.name);
    onChange(station);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && highlightIdx >= 0 && suggestions[highlightIdx]) {
      e.preventDefault();
      handleSelect(suggestions[highlightIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const isStationSearch = variant === "from" || variant === "to" || variant === "station-board";

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-xs font-medium text-text-muted" htmlFor={`search-${variant}`}>
        {label}
      </label>
      <div className="relative">
        <input
          id={`search-${variant}`}
          type="text"
          role={isStationSearch ? "combobox" : "searchbox"}
          aria-expanded={isOpen}
          aria-controls={isStationSearch ? `suggestions-${variant}` : undefined}
          aria-activedescendant={highlightIdx >= 0 ? `suggestion-${variant}-${highlightIdx}` : undefined}
          aria-autocomplete={isStationSearch ? "list" : undefined}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (isStationSearch && suggestions.length > 0) setIsOpen(true);
          }}
          className="w-full rounded-pill border border-border-input bg-surface-raised px-4 py-3 text-base text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-label="Searching" />
          </div>
        )}
      </div>

      {isStationSearch && isOpen && (
        <ul
          id={`suggestions-${variant}`}
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-md border border-border bg-surface-raised py-1 shadow-pop"
        >
          {suggestions.map((station, idx) => (
            <li
              key={station.id}
              id={`suggestion-${variant}-${idx}`}
              role="option"
              aria-selected={idx === highlightIdx}
              className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-accent-subtle ${
                idx === highlightIdx ? "bg-accent-subtle" : ""
              }`}
              onClick={() => handleSelect(station)}
            >
              <span className="text-text">{station.name}</span>
              <span className="ml-2 text-xs text-text-muted">{station.code}</span>
            </li>
          ))}
          {suggestions.length === 0 && query.length > 1 && (
            <li className="px-4 py-3 text-sm text-text-muted">No station found</li>
          )}
        </ul>
      )}
    </div>
  );
}
