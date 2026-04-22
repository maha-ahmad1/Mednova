import type { Session } from "next-auth";

export type NormalizedUserRole = "patient" | "therapist" | "center";
export type MenuRole = "patient" | "therapist" | "rehabilitation_center";
export type WalletAccessRole = "patient" | "consultant";

const ROLE_ALIASES: Record<string, NormalizedUserRole> = {
  patient: "patient",
  therapist: "therapist",
  center: "center",
  rehabilitation_center: "center",
};

export const normalizeUserRole = (rawRole?: string | null): NormalizedUserRole | null => {
  if (!rawRole) return null;
  return ROLE_ALIASES[rawRole] ?? null;
};

export const normalizeMenuRole = (rawRole?: string | null): MenuRole | null => {
  const normalized = normalizeUserRole(rawRole);
  if (!normalized) return null;

  return normalized === "center" ? "rehabilitation_center" : normalized;
};

export const normalizeWalletRole = (rawRole?: string | null): WalletAccessRole | null => {
  const normalized = normalizeUserRole(rawRole);
  if (!normalized) return null;

  return normalized === "patient" ? "patient" : "consultant";
};

export const resolveSessionRole = (session?: Session | null): string | null => {
  if (!session) return null;

  return session.user?.role ?? session.role ?? session.user?.type_account ?? null;
};
