"use client";

import { cn } from "@/lib/cn";
import type { VariantAxis } from "@/types";

interface VariantSelectorProps {
  axes: VariantAxis[];
  /** axisId -> optionId */
  selections: Record<string, string>;
  onChange: (axisId: string, optionId: string) => void;
  /** Option ids that lead to no purchasable variant, given the other axes. */
  unavailable?: Set<string>;
}

/**
 * Renders one row per variant axis. Axes whose options carry a `swatch` get
 * colour dots; everything else gets labelled pills. A single-option axis is
 * hidden, since there is nothing to choose.
 */
export function VariantSelector({
  axes,
  selections,
  onChange,
  unavailable,
}: VariantSelectorProps) {
  const choosable = axes.filter((axis) => axis.options.length > 1);
  if (choosable.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {choosable.map((axis) => {
        const selectedId = selections[axis.id];
        const selectedLabel = axis.options.find(
          (option) => option.id === selectedId,
        )?.label;
        const isSwatchAxis = axis.options.every((option) => option.swatch);

        return (
          <div key={axis.id}>
            <p className="mb-2 text-[13px] font-bold text-ink-muted">
              {axis.label}
              {selectedLabel && (
                <span className="ml-1.5 text-ink">{selectedLabel}</span>
              )}
            </p>

            <div
              role="radiogroup"
              aria-label={axis.label}
              className="flex flex-wrap gap-2"
            >
              {axis.options.map((option) => {
                const selected = option.id === selectedId;
                const soldOut = unavailable?.has(option.id) ?? false;

                if (isSwatchAxis) {
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={option.label}
                      title={option.label}
                      onClick={() => onChange(axis.id, option.id)}
                      className={cn(
                        "grid size-9 place-items-center rounded-full border-2 transition-colors",
                        selected ? "border-brand" : "border-hairline",
                        soldOut && "opacity-40",
                      )}
                    >
                      <span
                        className="size-6 rounded-full border border-black/10"
                        style={{ backgroundColor: option.swatch }}
                      />
                    </button>
                  );
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange(axis.id, option.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[13px] font-bold transition-colors",
                      selected
                        ? "border-brand bg-brand-tint text-brand"
                        : "border-hairline bg-surface text-ink",
                      soldOut && "text-ink-subtle line-through",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
