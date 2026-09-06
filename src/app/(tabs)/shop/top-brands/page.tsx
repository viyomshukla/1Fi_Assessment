import { Store } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TopBrandsPage() {
  return (
    <EmptyState
      icon={Store}
      title="Top Brands"
      description="Comming Soon..."
    />
  );
}
