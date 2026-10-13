import type { KawaderPriority, KawaderStatus } from "../types/kawader";

// Badge classes only. Labels come from `status_label` / `priority_label` in the API
// response (already in the request language), so nothing is translated here.
// Each pair is -700 text on a -100 background (WCAG AA).

export const STATUS_STYLES: Record<KawaderStatus, string> = {
  pending: "border-amber-200 bg-amber-100 text-amber-700",
  sent_to_hospital: "border-sky-200 bg-sky-100 text-sky-700",
  confirmed: "border-blue-200 bg-blue-100 text-blue-700",
  completed: "border-emerald-200 bg-emerald-100 text-emerald-700",
  rejected: "border-rose-200 bg-rose-100 text-rose-700",
  cancelled: "border-slate-200 bg-slate-100 text-slate-700",
  expired: "border-slate-200 bg-slate-100 text-slate-700",
};

export const PRIORITY_STYLES: Record<KawaderPriority, string> = {
  urgent: "border-rose-200 bg-rose-100 text-rose-700",
  soon: "border-amber-200 bg-amber-100 text-amber-700",
  normal: "border-sky-200 bg-sky-100 text-sky-700",
};
