
import { ReactNode } from "react";





export interface ApiNotification {
  id: number;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
  createdAt: string;
  source: 'api' | 'pusher';
}

export type NotificationType =
  // Consultation lifecycle
  | 'consultation_requested'
  | 'consultation_accepted'
  | 'consultation_active'
  | 'consultation_cancelled'
  | 'consultation_cancelled_by_consultant'
  | 'consultation_cancelled_by_patient'
  | 'consultation_completed'
  | 'consultation_updated'
  // Account status
  | 'account_approved'
  | 'account_rejected'
  // Messaging / Social
  | 'message'
  | 'comment'
  | 'like'
  | 'follow'
  // System
  | 'system'
  | 'alert'
  | (string & {}); // escape hatch for future/unknown types — keeps literals useful

export interface NotificationsPageResult {
  notifications: Notification[];
  nextCursor: string | null;
}

export interface NotificationsQueryParams {
  limit?: number;
  cursor?: string | null;
}




export interface NotificationData {
  consultation_id?: number;
  patient_name?: string;
  video_room_link?: string;
}

export interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  read: boolean;
  // createdAt: string;
  source: "api" | "pusher";
  onMarkAsRead: (id: string) => void;
  getIcon: (type: NotificationType) => ReactNode;
  getColor: (type: NotificationType) => string;
  formatTimeAgo: (dateString: string) => string;
}
