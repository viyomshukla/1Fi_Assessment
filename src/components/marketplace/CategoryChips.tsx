"use client";

import { cn } from "@/lib/cn";
import type { Category, CategoryId } from "@/types";

interface CategoryChipsProps {
  categories: Category[];
  value: CategoryId;
  onChange: (category: CategoryId) => void;
}

/** Horizontally scrolling filter row above the product grid. */
export function CategoryChips({
  categories,
  value,
  onChange,
}: CategoryChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5"
    >
      {categories.map((category) => {
        const active = category.id === value;

        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(category.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-colors",
              active
                ? "bg-brand text-white"
                : "bg-surface text-ink-muted shadow-card",
            )}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
