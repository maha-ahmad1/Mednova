// app/notifications/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import {
  Bell,
  Clock,
  AlertCircle,
  CheckCircle,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Notification as AppNotification } from "@/features/notifications/types";
import { NotificationItemFull } from "@/features/notifications/ui/NotificationItemFull";
import Navbar from "@/shared/ui/components/Navbar/Navbar";


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

  useEffect(() => {
    const toDedupKey = (notification: AppNotification) => {
      const payload = notification.data as Record<string, unknown>;
      const consultationId = payload?.consultation_id;
      const type = String(notification.type || "").trim().toLowerCase();
      const message = String(notification.message || "").trim().toLowerCase().slice(0, 80);
      return typeof consultationId === "number"
        ? `consultation:${consultationId}:${type}:${message}`
        : `generic:${type}:${message}`;
    };

    console.log("🧪 [TRACE][Notifications][UI][Page Rendered]", {
      timestamp: new Date().toISOString(),
      total: filteredNotifications.length,
      notifications: filteredNotifications.map((n) => ({
        id: n.id,
        source: n.source,
        type: n.type,
        message: n.message,
        consultation_id: (n.data as Record<string, unknown>)?.consultation_id,
        createdAt: n.createdAt,
        dedupKey: toDedupKey(n),
        reactKey: n.id,
      })),
    });
  }, [filteredNotifications]);

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
      return notifications.filter((n) => n.type.includes("consultation")).length;
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
    consultation: notifications.filter((n) => n.type.includes("consultation")).length,
  };

  const readPercentage =
    stats.total > 0
      ? Math.round(((stats.total - stats.unread) / stats.total) * 100)
      : 0;

  return (
    <>
      <Navbar variant="landing" />
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
                  <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
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
                    <span className="text-gray-500 text-sm font-normal me-2">
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
                    itemContent={(_index, notification) => (
                      <NotificationItemFull
                        key={notification.id}
                        notification={notification}
                        isSelected={selectedIds.includes(notification.id)}
                        onSelect={() => handleSelect(notification.id)}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                      />
                    )}
                    endReached={() => {
                      if (!hasNextPage || isFetchingNextPage) return;
                      fetchNextPage();
                    }}
                    overscan={200}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
