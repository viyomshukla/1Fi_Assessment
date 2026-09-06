import { Store } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TopBrandsPage() {
  return (
    <EmptyState
      icon={Store}
      title="Top Brands"
      description="Left blank on purpose — this assignment covers the 1Fi Marketplace tab."
    />
  );
}
