import {
  Bell,
  Check,
  Clock,
  Video,
  MessageSquare,
  AlertCircle,
  User,
} from "lucide-react";

// دالة لتنسيق الوقت النسبي
export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "الآن";
  if (diffInSeconds < 3600) return `قبل ${Math.floor(diffInSeconds / 60)} دقيقة`;
  if (diffInSeconds < 86400) return `قبل ${Math.floor(diffInSeconds / 3600)} ساعة`;
  if (diffInSeconds < 2592000) return `قبل ${Math.floor(diffInSeconds / 86400)} يوم`;

  return date.toLocaleDateString("ar-SA");
};

// الحصول على الأيقونة المناسبة
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "consultation_requested":
      return <MessageSquare className="h-4 w-4" />
    case "consultation_accepted":
      return <Check className="h-4 w-4" />;
    case "consultation_active":
      return <Video className="h-4 w-4" />;
    case "consultation_cancelled":
      return <AlertCircle className="h-4 w-4" />;
    case "consultation_completed":
      return <Check className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};


// الحصول على لون النقطة
export const getNotificationColor = (type: string) => {
  switch (type) {
    case "consultation_requested":
      return "bg-yellow-500";
    case "consultation_accepted":
      return "bg-green-500";
    case "consultation_active":
      return "bg-blue-500";
    case "consultation_cancelled":
      return "bg-red-500";
    case "consultation_completed":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};