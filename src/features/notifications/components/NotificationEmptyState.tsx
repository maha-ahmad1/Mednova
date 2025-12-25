"use client";

export interface NotificationEmptyStateProps {
  isLoading: boolean;
}

export function NotificationEmptyState({ isLoading }: NotificationEmptyStateProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        جاري تحميل الإشعارات...
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-muted-foreground">
      لا توجد إشعارات جديدة
    </div>
  );
}