import type { LucideIcon } from "lucide-react";

interface ScreenPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Stands in for screens that already exist in the shipped 1Fi app and are out
 * of scope here. Keeping them navigable means the bottom nav never dead-ends.
 */
export function ScreenPlaceholder({
  icon: Icon,
  title,
  description,
}: ScreenPlaceholderProps) {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-10 text-center">
      <span className="grid size-16 place-items-center rounded-tile bg-brand-soft">
        <Icon size={28} strokeWidth={1.8} className="text-brand" />
      </span>
      <h1 className="mt-5 text-xl font-extrabold text-ink">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
    </div>
  );
}
