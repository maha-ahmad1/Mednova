import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserType } from "../../types/user";

const userTypeClasses: Record<UserType, string> = {
  Patient: "bg-sky-100 text-sky-700 border-sky-200", // مريض باللون الأزرق
  Specialist: "bg-slate-200 text-slate-700 border-slate-300", // رمادي
  Center: "bg-slate-200 text-slate-700 border-slate-300",     // رمادي
};


const userTypeLabels: Record<UserType, string> = {
  Patient: "مريض",
  Specialist: "مختص",
  Center: "مركز",
};

interface UserTypeBadgeProps {
  type: UserType;
}

export function UserTypeBadge({ type }: UserTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full", userTypeClasses[type])}
    >
      {userTypeLabels[type]}{" "}
    </Badge>
  );
}
