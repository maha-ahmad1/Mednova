import { Badge } from "@/components/ui/badge";

interface SubscriptionBadgeProps {
  isSubscribed: boolean;
}

export function SubscriptionBadge({ isSubscribed }: SubscriptionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={isSubscribed ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}
    >
      {isSubscribed ? "مشترك" : "غير مشترك"}
    </Badge>
  );
}
