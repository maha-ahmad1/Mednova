import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ChartNoAxesCombined,
  Cpu,
  Landmark,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

export interface AdminSidebarSubItem {
  label: string;
  href: string;
  badge?: string;
}

export interface AdminSidebarGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: AdminSidebarSubItem[];
}

export interface AdminSidebarAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminSidebarGroups: AdminSidebarGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: ChartNoAxesCombined,
    items: [
      { label: "Overview", href: "/admin/users" },
      { label: "Stats", href: "/admin/users/stats" },
    ],
  },
  {
    id: "users-management",
    label: "Users Management",
    icon: Users,
    items: [
      { label: "All Users", href: "/admin/users" },
      { label: "Patients", href: "/admin/users/patients" },
      { label: "Specialists", href: "/admin/users/specialists" },
      { label: "Centers", href: "/admin/users/centers" },
      { label: "Pending Requests", href: "/admin/users/pending-requests", badge: "8" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: Landmark,
    items: [
      { label: "Transactions", href: "/admin/users/finance/transactions" },
      { label: "Wallets", href: "/admin/users/finance/wallets" },
      { label: "Payouts", href: "/admin/users/finance/payouts" },
      { label: "Revenue", href: "/admin/users/finance/revenue" },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    icon: Cpu,
    items: [
      { label: "Devices", href: "/admin/users/hardware/devices" },
      { label: "Assigned Devices", href: "/admin/users/hardware/assigned" },
      { label: "Device Status", href: "/admin/users/hardware/status" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    items: [
      { label: "Usage Analytics", href: "/admin/users/reports/usage-analytics" },
      { label: "Growth Metrics", href: "/admin/users/reports/growth-metrics" },
    ],
  },
  {
    id: "system-settings",
    label: "System Settings",
    icon: Settings,
    items: [
      { label: "Platform Settings", href: "/admin/users/settings/platform" },
      { label: "Roles & Permissions", href: "/admin/users/settings/roles" },
      { label: "Notifications", href: "/admin/users/settings/notifications" },
      { label: "Commission Rate", href: "/admin/users/settings/commission-rate" },
    ],
  },
];

export const adminSidebarLogoutAction: AdminSidebarAction = {
  label: "Logout",
  href: "/login",
  icon: LogOut,
};
