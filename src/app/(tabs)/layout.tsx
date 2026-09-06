import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

/**
 * Wraps every screen that keeps the primary navigation visible. The padding
 * reserves room for the floating nav so content is never hidden behind it.
 */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex-1 pb-28">{children}</div>
      <BottomNav />
    </>
  );
}
