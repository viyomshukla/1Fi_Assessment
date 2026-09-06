"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Announced to screen readers; the visual design has no label. */
  label?: string;
  className?: string;
}

/** Full-width pill search input, matching the Shop page's search bar. */
export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  label = "Search",
  className,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "flex h-14 items-center gap-3 rounded-full bg-surface px-5 shadow-card",
        "focus-within:ring-2 focus-within:ring-brand-muted",
        className,
      )}
    >
      <Search size={20} strokeWidth={2} className="shrink-0 text-ink-subtle" />
      <input
        type="search"
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-subtle [&::-webkit-search-cancel-button]:hidden"
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="grid size-6 shrink-0 place-items-center rounded-full bg-canvas text-ink-muted"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
