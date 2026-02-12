"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  users: "Users",
  patients: "Patients",
  specialists: "Specialists",
  centers: "Centers",
  "pending-requests": "Pending Requests",
  stats: "Stats",
  finance: "Finance",
  transactions: "Transactions",
  wallets: "Wallets",
  payouts: "Payouts",
  revenue: "Revenue",
  hardware: "Hardware",
  devices: "Devices",
  assigned: "Assigned Devices",
  status: "Device Status",
  reports: "Reports",
  "usage-analytics": "Usage Analytics",
  "growth-metrics": "Growth Metrics",
  settings: "System Settings",
  platform: "Platform Settings",
  roles: "Roles & Permissions",
  notifications: "Notifications",
  "commission-rate": "Commission Rate",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        href,
        label: segmentLabels[segment] ?? segment,
        isLast: index === segments.length - 1,
      };
    });
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {index > 0 ? <Slash className="h-3.5 w-3.5" /> : null}
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
