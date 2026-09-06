import { ChartNoAxesCombined } from "lucide-react";
import { ScreenPlaceholder } from "@/components/layout/ScreenPlaceholder";

export default function LimitPage() {
  return (
    <ScreenPlaceholder
      icon={ChartNoAxesCombined}
      title="Limit"
      description="An existing 1Fi screen, kept navigable but outside the scope of this assignment."
    />
  );
}
