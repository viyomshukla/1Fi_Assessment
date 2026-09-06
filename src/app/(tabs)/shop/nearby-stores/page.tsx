import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NearbyStoresPage() {
  return (
    <EmptyState
      icon={MapPin}
      title="Nearby Stores"
      description="Comming Soon..."
    />
  );
}
