import { House } from "lucide-react";
import { ScreenPlaceholder } from "@/components/layout/ScreenPlaceholder";

export default function HomePage() {
  return (
    <ScreenPlaceholder
      icon={House}
      title="Home"
      description="The existing 1Fi home feed. Head to the Shop tab for the 1Fi Marketplace."
    />
  );
}
