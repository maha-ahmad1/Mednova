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
    { icon: UserPlus, label: "الصفحة الشخصية", href: "/profile" },
    { icon: Users, label: "المستخدمين", href: "/coming-soon" },
    { icon: Calendar, label: "طلبات الاستشارة", href: "/profile/consultations" },
    { icon: Activity, label: "الجلسات", href: "/coming-soon" },
    { icon: FileText, label: "التقارير", href: "/coming-soon" },
    { icon: Settings, label: "الإعدادات", href: "/coming-soon" },
    { icon: HelpCircle, label: "المساعدة", href: "/coming-soon" },
  ],

  therapist: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: Calendar, label: "المواعيد", href: "/profile/consultations" },
    { icon: Activity, label: "الجلسات", href: "/coming-soon" },
    { icon: FileText, label: "التقارير", href: "/coming-soon" },
    { icon: HelpCircle, label: "المساعدة", href: "/coming-soon" },
  ],

  rehabilitation_center: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: Calendar, label: "المواعيد", href: "/appointments" },
    { icon: Users, label: "المرضى", href: "/patients" },
    { icon: HelpCircle, label: "المساعدة", href: "/coming-soon" },
  ],
};
