import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Activity,
  UserPlus,
  Wallet,
} from "lucide-react";

export const sidebarMenus = {
  patient: [
    { icon: LayoutDashboard, labelKey: "home", href: "/" },
    { icon: UserPlus, labelKey: "myProfile", href: "/profile" },
    // { icon: Users, labelKey: "users", href: "/coming-soon" },
    { icon: Calendar, labelKey: "consultationRequests", href: "/profile/consultations" },
    // { icon: Activity, labelKey: "sessions", href: "/coming-soon" },
    { icon: Wallet, labelKey: "financialWallet", href: "/profile/financial" },

    // { icon: FileText, labelKey: "reports", href: "/coming-soon" },
    // { icon: Settings, labelKey: "settings", href: "/coming-soon" },
    // { icon: HelpCircle, labelKey: "help", href: "/coming-soon" },
  ],

  therapist: [
    { icon: LayoutDashboard, labelKey: "home", href: "/" },
    { icon: UserPlus, labelKey: "myProfile", href: "/profile" },
    { icon: Calendar, labelKey: "appointments", href: "/profile/consultations" },
    // { icon: Activity, labelKey: "sessions", href: "/coming-soon" },
    { icon: Wallet, labelKey: "financialWallet", href: "/profile/financial" },
    { icon: FileText, labelKey: "reports", href: "/coming-soon" },
    { icon: HelpCircle, labelKey: "help", href: "/coming-soon" },
  ],

  rehabilitation_center: [
    { icon: LayoutDashboard, labelKey: "home", href: "/" },
    { icon: Calendar, labelKey: "appointments", href: "/appointments" },
    { icon: Users, labelKey: "patients", href: "/patients" },
    { icon: HelpCircle, labelKey: "help", href: "/coming-soon" },
  ],
};
