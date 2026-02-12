import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserType } from "../../types/user";

const userTypeClasses: Record<UserType, string> = {
  Patient: "bg-sky-100 text-sky-700 border-sky-200",
  Specialist: "bg-purple-100 text-purple-700 border-purple-200",
  Center: "bg-amber-100 text-amber-700 border-amber-200",
};

interface UserTypeBadgeProps {
  type: UserType;
}

export function UserTypeBadge({ type }: UserTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn("rounded-full", userTypeClasses[type])}>
      {type}
    </Badge>
  );
}
