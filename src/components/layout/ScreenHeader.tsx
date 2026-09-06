"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface ScreenHeaderProps {
  title: string;
  /** Rendered on the right, e.g. a share or wishlist button. */
  action?: ReactNode;
}

/** Sticky back-navigation bar for screens pushed on top of a tab. */
export function ScreenHeader({ title, action }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-hairline bg-surface/95 px-4 py-3 backdrop-blur">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-canvas text-ink"
      >
        <ChevronLeft size={20} strokeWidth={2.4} />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-[15px] font-extrabold text-ink">
        {title}
      </h1>
      {action}
    </header>
  );
}
