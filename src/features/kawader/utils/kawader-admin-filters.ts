import type {
  AdminKawaderFilters,
  AdminKawaderScope,
  KawaderPriority,
  KawaderServiceKey,
  KawaderStatus,
} from "../types/kawader";
import { KAWADER_PRIORITIES, KAWADER_SERVICE_KEYS, KAWADER_STATUSES } from "./kawader-constants";

export const ADMIN_SCOPES: readonly AdminKawaderScope[] = ["open", "closed", "all"];
const DEFAULT_ADMIN_SCOPE: AdminKawaderScope = "open";
const ADMIN_PER_PAGE = 15;

/** The list view as it is stored in the URL. Invalid URL values fall back to the defaults. */
export interface AdminKawaderViewState {
  scope: AdminKawaderScope;
  status?: KawaderStatus;
  priority?: KawaderPriority;
  service_key?: KawaderServiceKey;
  service_area?: string;
  has_insurance?: boolean;
  date_from?: string;
  date_to?: string;
  search: string;
  page: number;
}

/** `null` clears a key; leaving it out keeps the current value. */
export type AdminKawaderViewPatch = {
  [K in keyof AdminKawaderViewState]?: AdminKawaderViewState[K] | null;
};

type ParamReader = { get(name: string): string | null };

const pickFrom = <T extends string>(allowed: readonly T[], value: string | null): T | undefined =>
  allowed.find((item) => item === value);

const parseDate = (value: string | null): string | undefined =>
  value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : undefined;

const parseKey = (value: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length <= 64 ? trimmed : undefined;
};

export function parseAdminKawaderView(params: ParamReader): AdminKawaderViewState {
  const page = Number.parseInt(params.get("page") ?? "", 10);
  const hasInsurance = params.get("has_insurance");

  return {
    scope: pickFrom(ADMIN_SCOPES, params.get("scope")) ?? DEFAULT_ADMIN_SCOPE,
    status: pickFrom(KAWADER_STATUSES, params.get("status")),
    priority: pickFrom(KAWADER_PRIORITIES, params.get("priority")),
    service_key: pickFrom(KAWADER_SERVICE_KEYS, params.get("service_key")),
    service_area: parseKey(params.get("service_area")),
    has_insurance: hasInsurance === "1" ? true : hasInsurance === "0" ? false : undefined,
    date_from: parseDate(params.get("date_from")),
    date_to: parseDate(params.get("date_to")),
    search: (params.get("search") ?? "").trim().slice(0, 100),
    page: Number.isFinite(page) && page >= 1 ? page : 1,
  };
}

/** Applies a patch to the current query string. Any filter change goes back to page 1. */
export function applyAdminKawaderPatch(
  current: URLSearchParams,
  patch: AdminKawaderViewPatch,
): URLSearchParams {
  const params = new URLSearchParams(current.toString());

  const write = (key: string, value: string | undefined) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };

  for (const [key, value] of Object.entries(patch) as [keyof AdminKawaderViewState, unknown][]) {
    if (key === "page") continue;
    if (value === undefined) continue;

    if (key === "scope") write(key, value && value !== DEFAULT_ADMIN_SCOPE ? String(value) : undefined);
    else if (key === "has_insurance") write(key, value === true ? "1" : value === false ? "0" : undefined);
    else write(key, value === null ? undefined : String(value));
  }

  // Only an explicit `page` keeps a page; every other change starts again from page 1.
  const nextPage = patch.page ?? 1;
  write("page", nextPage > 1 ? String(nextPage) : undefined);

  return params;
}

export const hasActiveAdminKawaderFilters = (view: AdminKawaderViewState): boolean =>
  Boolean(
    view.status ||
      view.priority ||
      view.service_key ||
      view.service_area ||
      view.has_insurance !== undefined ||
      view.date_from ||
      view.date_to ||
      view.search,
  );

/** URL view state to A1 params. A status overrides the scope, so the scope is not sent with it. */
export function toAdminKawaderApiFilters(view: AdminKawaderViewState): AdminKawaderFilters {
  return {
    scope: view.status ? undefined : view.scope,
    status: view.status,
    priority: view.priority,
    service_key: view.service_key,
    service_area: view.service_area,
    has_insurance: view.has_insurance,
    date_from: view.date_from,
    date_to: view.date_to,
    search: view.search || undefined,
    page: view.page,
    per_page: ADMIN_PER_PAGE,
  };
}

/**
 * Rebuilds a clean query string from a view. Used to send the list's filters along to a detail
 * page and back: the `from` value is parsed and re-serialized, so only known, valid params survive.
 */
export function serializeAdminKawaderView(view: AdminKawaderViewState): string {
  const params = new URLSearchParams();

  if (view.scope !== DEFAULT_ADMIN_SCOPE) params.set("scope", view.scope);
  if (view.status) params.set("status", view.status);
  if (view.priority) params.set("priority", view.priority);
  if (view.service_key) params.set("service_key", view.service_key);
  if (view.service_area) params.set("service_area", view.service_area);
  if (view.has_insurance !== undefined) params.set("has_insurance", view.has_insurance ? "1" : "0");
  if (view.date_from) params.set("date_from", view.date_from);
  if (view.date_to) params.set("date_to", view.date_to);
  if (view.search) params.set("search", view.search);
  if (view.page > 1) params.set("page", String(view.page));

  return params.toString();
}
