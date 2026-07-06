import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Video,
  MessageSquare,
  AlertCircle,
  XCircle,
  Heart,
  UserPlus,
  Info,
  Wallet,
  AlarmClock,
} from 'lucide-react';

export interface NotificationTypeConfigEntry {
  icon: LucideIcon;
  colorClass: string;
  titleKey: string;
}

const DEFAULT_CONFIG: NotificationTypeConfigEntry = {
  icon: Bell,
  colorClass: 'bg-gray-500',
  titleKey: 'types.unknown',
};

const CONFIG_MAP: Record<string, NotificationTypeConfigEntry> = {
  consultation_requested: {
    icon: MessageSquare,
    colorClass: 'bg-yellow-500',
    titleKey: 'types.consultation_requested',
  },
  consultation_accepted: {
    icon: Check,
    colorClass: 'bg-green-500',
    titleKey: 'types.consultation_accepted',
  },
  consultation_active: {
    icon: Video,
    colorClass: 'bg-blue-500',
    titleKey: 'types.consultation_active',
  },
  consultation_cancelled: {
    icon: AlertCircle,
    colorClass: 'bg-red-500',
    titleKey: 'types.consultation_cancelled',
  },
  consultation_cancelled_by_consultant: {
    icon: AlertCircle,
    colorClass: 'bg-red-500',
    titleKey: 'types.consultation_cancelled_by_consultant',
  },
  consultation_cancelled_by_patient: {
    icon: AlertCircle,
    colorClass: 'bg-red-500',
    titleKey: 'types.consultation_cancelled_by_patient',
  },
  consultation_completed: {
    icon: CheckCircle2,
    colorClass: 'bg-purple-500',
    titleKey: 'types.consultation_completed',
  },
  consultation_updated: {
    icon: Clock,
    colorClass: 'bg-orange-500',
    titleKey: 'types.consultation_updated',
  },
  consultation_cancelled_by_system: {
    icon: XCircle,
    colorClass: 'bg-gray-500',
    titleKey: 'types.consultation_cancelled_by_system',
  },
  consultation_review_window_opened: {
    icon: Clock,
    colorClass: 'bg-yellow-500',
    titleKey: 'types.consultation_review_window_opened',
  },
  consultation_review_window_expiring_patient: {
    icon: Clock,
    colorClass: 'bg-orange-600',
    titleKey: 'types.consultation_review_window_expiring_patient',
  },
  consultation_settlement_completed_patient: {
    icon: Wallet,
    colorClass: 'bg-green-600',
    titleKey: 'types.consultation_settlement_completed_patient',
  },
  consultation_reminder_for_all: {
    icon: AlarmClock,
    colorClass: 'bg-blue-500',
    titleKey: 'types.consultation_reminder_for_all',
  },
  account_approved: {
    icon: CheckCircle2,
    colorClass: 'bg-green-500',
    titleKey: 'types.account_approved',
  },
  account_rejected: {
    icon: XCircle,
    colorClass: 'bg-red-500',
    titleKey: 'types.account_rejected',
  },
  message: {
    icon: MessageSquare,
    colorClass: 'bg-blue-500',
    titleKey: 'types.message',
  },
  comment: {
    icon: MessageSquare,
    colorClass: 'bg-indigo-500',
    titleKey: 'types.comment',
  },
  like: {
    icon: Heart,
    colorClass: 'bg-pink-500',
    titleKey: 'types.like',
  },
  follow: {
    icon: UserPlus,
    colorClass: 'bg-teal-500',
    titleKey: 'types.follow',
  },
  system: {
    icon: Info,
    colorClass: 'bg-gray-500',
    titleKey: 'types.system',
  },
  alert: {
    icon: AlertCircle,
    colorClass: 'bg-orange-500',
    titleKey: 'types.alert',
  },
};

export const NOTIFICATION_TYPE_CONFIG = CONFIG_MAP;

export const getTypeConfig = (type: string): NotificationTypeConfigEntry =>
  CONFIG_MAP[type] ?? DEFAULT_CONFIG;
