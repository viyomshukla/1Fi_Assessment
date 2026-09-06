import type { ReactNode } from "react";

/**
 * The app is designed mobile-first. On phones this is simply the page; on
 * larger screens it becomes a centred device-width column so the layout never
 * stretches into something the real app would never show.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-canvas shadow-[0_0_60px_rgba(16,16,20,0.08)]">
      {children}
    </div>
  );
}
