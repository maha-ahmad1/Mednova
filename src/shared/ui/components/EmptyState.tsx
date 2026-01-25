import { SearchIcon, Award, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type: "no-results" | "error" | "empty" | "no-data";
  title: string;
  description: string;
  onAction?: () => void;
  actionText?: string;
  className?: string;
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  onAction, 
  actionText,
  className 
}: EmptyStateProps) {
  const config = {
    "no-results": {
      icon: SearchIcon,
      iconClass: "text-gray-400",
      iconBgClass: "bg-gray-100",
      cardBgClass: "bg-gray-50 border-gray-200",
      titleClass: "text-gray-800",
      descClass: "text-gray-600",
      buttonClass: "border-gray-300 text-gray-700 hover:bg-gray-50",
      buttonVariant: "outline" as const,
    },
    "error": {
      icon: Award,
      iconClass: "text-red-500",
      iconBgClass: "bg-red-100",
      cardBgClass: "bg-red-50 border-red-200",
      titleClass: "text-red-800",
      descClass: "text-red-600",
      buttonClass: "border-red-300 text-red-700 hover:bg-red-50",
      buttonVariant: "outline" as const,
    },
    "empty": {
      icon: Users,
      iconClass: "text-[#32A88D]",
      iconBgClass: "bg-[#32A88D]/10",
      cardBgClass: "bg-gray-50 border-gray-200",
      titleClass: "text-gray-800",
      descClass: "text-gray-600",
      buttonClass: "bg-[#32A88D] hover:bg-[#2a8a7a] text-white",
      buttonVariant: "default" as const,
    },
    "no-data": {
      icon: FileText,
      iconClass: "text-blue-500",
      iconBgClass: "bg-blue-100",
      cardBgClass: "bg-blue-50 border-blue-200",
      titleClass: "text-blue-800",
      descClass: "text-blue-600",
      buttonClass: "border-blue-300 text-blue-700 hover:bg-blue-50",
      buttonVariant: "outline" as const,
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <section className={cn(
      "py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white",
      className
    )}>
      <div className="max-w-7xl mx-auto text-center">
        <div className={cn(
          "rounded-2xl p-8 max-w-md mx-auto border border-red-200 ",
          currentConfig.cardBgClass
        )}>
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
            currentConfig.iconBgClass
          )}>
            <Icon className={cn("w-8 h-8", currentConfig.iconClass)} />
          </div>
          <h3 className={cn(
            "text-lg font-semibold mb-2",
            currentConfig.titleClass
          )}>
            {title}
          </h3>
          <p className={cn("text-sm", currentConfig.descClass)}>
            {description}
          </p>
          {onAction && actionText && (
            <Button 
              variant={currentConfig.buttonVariant}
              className={cn("mt-4 cursor-pointer ", currentConfig.buttonClass)}
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}