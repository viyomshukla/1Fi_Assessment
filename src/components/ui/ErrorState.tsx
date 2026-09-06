import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  /** Safe to show the user; API messages are already sanitised server-side. */
  description?: string;
  onRetry?: () => void;
  retrying?: boolean;
}

/** Shown when a request fails. Always offers a way forward. */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this right now. Please try again.",
  onRetry,
  retrying = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center px-8 py-14 text-center"
    >
      <span className="grid size-14 place-items-center rounded-tile bg-danger-soft">
        <CircleAlert size={24} strokeWidth={1.9} className="text-danger" />
      </span>
      <p className="mt-4 text-base font-extrabold text-ink">{title}</p>
      <p className="mt-1.5 max-w-[17rem] text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          loading={retrying}
          onClick={onRetry}
        >
          {!retrying && <RefreshCw size={15} strokeWidth={2.4} />}
          Try again
        </Button>
      )}
    </div>
  );
}
