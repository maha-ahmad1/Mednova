import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Activity,
  UserPlus,
} from "lucide-react";

export const sidebarMenus = {
  patient: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: UserPlus, label: "التسجيل", href: "/register" },
    { icon: Users, label: "المستخدمين", href: "/users" },
    { icon: Calendar, label: "المواعيد", href: "/appointments" },
    { icon: Activity, label: "الجلسات", href: "/sessions" },
    { icon: FileText, label: "التقارير", href: "/reports" },
    { icon: Settings, label: "الإعدادات", href: "/settings" },
    { icon: HelpCircle, label: "المساعدة", href: "/help" },
  ],

  therapist: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: Calendar, label: "المواعيد", href: "/appointments" },
    { icon: Activity, label: "الجلسات", href: "/sessions" },
    { icon: FileText, label: "التقارير", href: "/reports" },
    { icon: HelpCircle, label: "المساعدة", href: "/help" },
  ],

  rehabilitation_center: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: Calendar, label: "المواعيد", href: "/appointments" },
    { icon: Users, label: "المرضى", href: "/patients" },
    { icon: HelpCircle, label: "المساعدة", href: "/help" },
  ],
};
