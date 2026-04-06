// app/notifications/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import {
  Bell,
  Check,
  Clock,
  Video,
  MessageSquare,
  AlertCircle,
  User,
  CheckCircle,
  Filter,
  Trash2,
  MoreVertical,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import type {Notification} from "@/features/notifications/types/notification";
import type {
  Notification as AppNotification,
  NotificationData,
} from "@/features/notifications/types";


// ===== Helper Functions =====
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "consultation_requested":
      return <MessageSquare className="h-5 w-5" />;
    case "consultation_accepted":
      return <Check className="h-5 w-5" />;
    case "consultation_active":
      return <Video className="h-5 w-5" />;
    case "consultation_cancelled":
      return <AlertCircle className="h-5 w-5" />;
    case "consultation_completed":
      return <Check className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getNotificationColor = (type: string) => {
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

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    consultation_requested: "طلب استشارة",
    consultation_accepted: "تم القبول",
    consultation_active: "جلسة نشطة",
    consultation_cancelled: "ملغية",
    consultation_completed: "مكتملة",
    consultation_updated: "محدثة",
  };
  return labels[type] || "إشعار";
};

// ===== Notification Item Component =====
const NotificationItem = ({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
}: {
  notification: AppNotification & { data: NotificationData | null };
  isSelected: boolean;
  onSelect: () => void;
  onMarkAsRead: () => void;
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead();
    }
  };

  const renderActionButton = () => {
    if (
      notification.type === "consultation_active" &&
      notification.data.video_room_link
    ) {
      return (
        <Button
          size="sm"
          variant="default"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            window.open(notification.data.video_room_link, "_blank");
          }}
        >
          <Video className="h-3 w-3" />
          انضم للجلسة
        </Button>
      );
    }

    if (notification.data.consultation_id) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `/consultations/${notification.data.consultation_id}`,
              "_blank"
            );
          }}
        >
          <ExternalLink className="h-3 w-3" />
          عرض التفاصيل
        </Button>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 transition-colors cursor-pointer hover:bg-gray-50",
        !notification.read && "bg-blue-50/50",
        isSelected && "bg-primary/5"
      )}
      onClick={handleClick}
    >
      {/* Checkbox */}
      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </div>

      {/* Icon */}
      <div className="relative">
        <div
          className={cn(
            "h-2 w-2 rounded-full absolute -top-1 -right-1",
            getNotificationColor(notification.type),
            notification.read && "opacity-50"
          )}
        />
        <div
          className={cn(
            "p-2 rounded-lg",
            notification.read ? "bg-gray-100" : "bg-primary/10"
          )}
        >
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4
                className={cn(
                  "font-semibold text-sm",
                  !notification.read && "text-primary"
                )}
              >
                {notification.title}
              </h4>
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>

            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

            {/* Metadata */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {notification.data.patient_name && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {notification.data.patient_name}
                </span>
              )}

              {notification.data.consultation_id && (
                <span>#{notification.data.consultation_id}</span>
              )}

              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {/* يمكنك استخدام formatTimeAgo هنا */}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {renderActionButton()}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onMarkAsRead}>
                  <Check className="h-4 w-4 ml-2" />
                  تعيين كمقروء
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== Main Page Component =====
export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    notifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === "all") return true;
      if (filter === "unread") return !notification.read;
      if (filter === "consultations")
        return notification.type.includes("consultation");
      return notification.type === filter;
    });
  }, [notifications, filter]);
  // تحقق من هذا console.log
  console.log("Filtered notifications:", {
    count: filteredNotifications.length,
    allCount: notifications.length,
    filter: filter,
  });
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBulkMarkAsRead = () => {
    selectedIds.forEach((id) => handleMarkAsRead(id));
    setSelectedIds([]);
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // ===== Filters UI =====
  const filters = [
    { id: "all", label: "الكل" },
    { id: "unread", label: "غير المقروء" },
    { id: "consultations", label: "الاستشارات" },
    { id: "consultation_requested", label: "طلبات جديدة" },
    { id: "consultation_accepted", label: "مقبول" },
    { id: "consultation_active", label: "نشطة" },
    { id: "consultation_completed", label: "مكتملة" },
  ];

  const getCount = (filterId: string) => {
    if (filterId === "all") return notifications.length;
    if (filterId === "unread")
      return notifications.filter((n) => !n.read).length;
    if (filterId === "consultations")
      return notifications.filter((n) => n.type.includes("consultation"))
        .length;
    return notifications.filter((n) => n.type === filterId).length;
  };

  // ===== Stats =====
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    today: notifications.filter((n) => {
      const date = new Date(parseInt(n.createdAt));
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length,
    consultation: notifications.filter((n) => n.type.includes("consultation"))
      .length,
  };

  const readPercentage =
    stats.total > 0
      ? Math.round(((stats.total - stats.unread) / stats.total) * 100)
      : 0;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-600 mt-2">إدارة جميع إشعاراتك في مكان واحد</p>
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkAsRead}
              className="gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              تعيين المحددة كمقروء ({selectedIds.length})
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            تعيين الكل كمقروء
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المجموع</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">غير مقروء</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.unread}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">اليوم</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">النسبة المقروءة</p>
                <p className="text-2xl font-bold">{readPercentage}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">التصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Filter className="h-4 w-4" />
                  <span>تصفية حسب:</span>
                </div>
                {filters.map((filterItem) => {
                  const count = getCount(filterItem.id);
                  if (count === 0) return null;
                  return (
                    <Button
                      key={filterItem.id}
                      variant={filter === filterItem.id ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setFilter(filterItem.id)}
                    >
                      <span>{filterItem.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {filter === "all" && "جميع الإشعارات"}
                  {filter === "unread" && "الإشعارات غير المقروءة"}
                  {filter === "consultations" && "إشعارات الاستشارات"}
                  <span className="text-gray-500 text-sm font-normal mr-2">
                    ({filteredNotifications.length})
                  </span>
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {selectedIds.length > 0 ? (
                    <span>{selectedIds.length} محددة</span>
                  ) : (
                    <span>{unreadCount} غير مقروء</span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading && notifications.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </div>
              ) : (
                <Virtuoso
  style={{ height: "70vh" }}
  data={filteredNotifications}
  itemContent={(index, notification) => {
    // 🔍 تحقق من أن البيانات تصل
    if (index === 0) {
      console.log('📦 Virtuoso rendering first item:', {
        totalItems: filteredNotifications.length,
        notification: notification?.id,
      });
    }
    
    if (index === filteredNotifications.length - 1) {
      console.log('📍 Virtuoso rendering LAST item:', {
        index,
        total: filteredNotifications.length,
        hasNextPage,
      });
    }
    
    return (
      <NotificationItem
        key={notification.id}
        notification={notification}
        isSelected={selectedIds.includes(notification.id)}
        onSelect={() => handleSelect(notification.id)}
        onMarkAsRead={() => handleMarkAsRead(notification.id)}
      />
    );
  }}
  endReached={() => {
    console.log('🔥🔥🔥 END REACHED FIRED!', {
      currentTime: new Date().toISOString(),
      filteredCount: filteredNotifications.length,
      hasNextPage,
      isFetchingNextPage,
    });
    
    if (!hasNextPage) {
      console.log('❌ No next page available');
      return;
    }
    
    if (isFetchingNextPage) {
      console.log('⏳ Already fetching next page');
      return;
    }

    console.log('🚀 Fetching next page...');
    fetchNextPage();
  }}
  overscan={200} // 🔧 زيادة overscan لتحسين الكشف
/>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
