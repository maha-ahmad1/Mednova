import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  HelpCircle,
  Activity,
  UserPlus,
  Wallet,
} from "lucide-react";

export const sidebarMenus = {
  patient: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: UserPlus, label: "الصفحة الشخصية", href: "/profile" },
    // { icon: Users, label: "المستخدمين", href: "/coming-soon" },
    { icon: Calendar, label: "طلبات الاستشارة", href: "/profile/consultations" },
    { icon: Activity, label: "الجلسات", href: "/coming-soon" },
    { icon: Wallet, label: "المحفظة المالية", href: "/wallet" },
    // { icon: FileText, label: "التقارير", href: "/coming-soon" },
    // { icon: Settings, label: "الإعدادات", href: "/coming-soon" },
    // { icon: HelpCircle, label: "المساعدة", href: "/coming-soon" },
  ],

  therapist: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: Calendar, label: "المواعيد", href: "/profile/consultations" },
    { icon: Activity, label: "الجلسات", href: "/coming-soon" },
    { icon: Wallet, label: "المحفظة المالية", href: "/wallet" },
    { icon: FileText, label: "التقارير", href: "/coming-soon" },
    { icon: HelpCircle, label: "المساعدة", href: "/coming-soon" },
  ],

  rehabilitation_center: [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
    { icon: Calendar, label: "المواعيد", href: "/appointments" },
    { icon: Users, label: "المرضى", href: "/patients" },
    { icon: Wallet, label: "المحفظة المالية", href: "/wallet" },
    { icon: HelpCircle, label: "المساعدة", href: "/coming-soon" },
  ],
};
