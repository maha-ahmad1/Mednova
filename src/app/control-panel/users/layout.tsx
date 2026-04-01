import type { ReactNode } from "react";
import { AdminLayoutShell } from "@/features/control-panel/admin-layout/ui";

export default function AdminUsersLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
