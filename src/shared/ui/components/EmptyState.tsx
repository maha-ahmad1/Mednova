import { SearchIcon, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-results" | "error" | "empty";
  title: string;
  description: string;
  onAction?: () => void;
  actionText?: string;
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  onAction, 
  actionText 
}: EmptyStateProps) {
  const iconConfig = {
    "no-results": {
      icon: SearchIcon,
      iconClass: "w-12 h-12 text-gray-400",
      bgClass: "bg-gray-100",
    },
    "error": {
      icon: Award,
      iconClass: "w-8 h-8 text-red-500",
      bgClass: "bg-red-100",
    },
    "empty": {
      icon: SearchIcon,
      iconClass: "w-12 h-12 text-gray-400",
      bgClass: "bg-gray-100",
    },
  };

  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <div className="text-center py-20">
      <div className={`w-24 h-24 mx-auto mb-4 ${config.bgClass} rounded-full flex items-center justify-center`}>
        <Icon className={config.iconClass} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      {onAction && actionText && (
        <Button
          onClick={onAction}
          className={`${
            type === "error" 
              ? "border-red-300 text-red-700 hover:bg-red-50"
              : "bg-[#32A88D] hover:bg-[#2a8a7a] text-white"
          }`}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}