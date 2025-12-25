
export const NOTIFICATION_LIMITS = {
  DROPDOWN: 10,
  PAGE: 20,
} as const;

export const STALE_TIMES = {
  DROPDOWN: 1000 * 60, // 1 minute
  PAGE: 1000 * 60 * 5, // 5 minutes
} as const;

export const NOTIFICATION_ENDPOINTS = {
  LIST: '/api/notification',
  MARK_AS_READ: '/api/notification/mark-as-read',
  MARK_ALL_READ: '/api/notification/mark-as-read',
} as const;