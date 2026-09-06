import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional recovery action, e.g. "Clear filters". */
  action?: ReactNode;
}

/** Shown when a request succeeds but returns nothing. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-tile bg-canvas">
        <Icon size={24} strokeWidth={1.8} className="text-ink-subtle" />
      </span>
      <p className="mt-4 text-base font-extrabold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-[16rem] text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
