import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EmailVerificationIndicatorProps {
  isVerified: boolean;
}

export function EmailVerificationIndicator({
  isVerified,
}: EmailVerificationIndicatorProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-full px-2",
        isVerified
          ? "border-emerald-200 bg-emerald-100 text-emerald-700"
          : "border-gray-200 bg-gray-100 text-gray-500",
      )}
      aria-label={isVerified ? "Verified email" : "Email not verified"}
      title={isVerified ? "Verified" : "Not verified"}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
    </Badge>
  );
}
