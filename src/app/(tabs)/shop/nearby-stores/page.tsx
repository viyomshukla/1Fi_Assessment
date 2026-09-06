import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NearbyStoresPage() {
  return (
    <EmptyState
      icon={MapPin}
      title="Nearby Stores"
      description="Left blank on purpose — this assignment covers the 1Fi Marketplace tab."
    />
  );
}
