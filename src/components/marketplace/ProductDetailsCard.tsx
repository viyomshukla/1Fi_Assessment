import { Check } from "lucide-react";
import type { ProductSpec } from "@/types";

/** Bullet list of selling points, styled like the app's "How to use" card. */
export function HighlightsCard({ highlights }: { highlights: string[] }) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <h2 className="text-[17px] font-extrabold text-ink">Highlights</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {highlights.map((highlight) => (
          <li key={highlight} className="flex gap-2.5">
            <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-soft">
              <Check size={11} strokeWidth={3.2} className="text-brand" />
            </span>
            <span className="text-[14px] leading-relaxed text-ink-muted">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Label/value table of product specifications. */
export function SpecsCard({ specs }: { specs: ProductSpec[] }) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <h2 className="text-[17px] font-extrabold text-ink">Product details</h2>
      <dl className="mt-3">
        {specs.map((spec, index) => (
          <div
            key={spec.label}
            className={
              index === 0
                ? "flex gap-4 py-2.5"
                : "flex gap-4 border-t border-hairline py-2.5"
            }
          >
            <dt className="w-[38%] shrink-0 text-[13.5px] font-medium text-ink-subtle">
              {spec.label}
            </dt>
            <dd className="text-[13.5px] font-semibold text-ink">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
