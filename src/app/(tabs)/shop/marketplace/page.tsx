import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MarketplacePage() {
  return (
    <EmptyState
      icon={PackageSearch}
      title="1Fi Marketplace"
      description="Product listing lands here in step 5, once the data layer is in place."
    />
  );
}
