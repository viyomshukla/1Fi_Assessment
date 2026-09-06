import { User } from "lucide-react";
import { ScreenPlaceholder } from "@/components/layout/ScreenPlaceholder";

export default function ProfilePage() {
  return (
    <ScreenPlaceholder
      icon={User}
      title="Profile"
      description="An existing 1Fi screen, kept navigable but outside the scope of this assignment."
    />
  );
}
