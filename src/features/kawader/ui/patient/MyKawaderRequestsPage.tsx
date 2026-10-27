"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { EmptyState } from "@/shared/ui/components/states/EmptyState";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useMyKawaderRequests } from "../../hooks/useMyKawaderRequests";
import type { KawaderStatus, MyKawaderScope } from "../../types/kawader";
import { CLOSED_STATUSES, OPEN_STATUSES } from "../../utils/kawader-constants";
import { KawaderRequestCard } from "./components/KawaderRequestCard";
import { KawaderRequestsListSkeleton } from "./components/KawaderRequestsSkeleton";

const PER_PAGE = 10;
const SCOPES: readonly MyKawaderScope[] = ["open", "closed"];
const DEFAULT_SCOPE: MyKawaderScope = "open";
const STATUSES_BY_SCOPE: Record<MyKawaderScope, readonly KawaderStatus[]> = {
  open: OPEN_STATUSES,
  closed: CLOSED_STATUSES,
};

// An invalid scope falls back to the default tab.
const parseScope = (value: string | null): MyKawaderScope =>
  SCOPES.find((scope) => scope === value) ?? DEFAULT_SCOPE;

// A status that does not belong to the active tab is ignored.
const parseStatus = (value: string | null, scope: MyKawaderScope): KawaderStatus | undefined =>
  STATUSES_BY_SCOPE[scope].find((status) => status === value);

const parsePage = (value: string | null): number => {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page >= 1 ? page : 1;
};

export function MyKawaderRequestsPage() {
  const t = useTranslations("kawader");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Scope, status and page live in the URL so a refresh or a shared link keeps the same view.
  const scope = parseScope(searchParams.get("scope"));
  const status = parseStatus(searchParams.get("status"), scope);
  const page = parsePage(searchParams.get("page"));

  const { items, pagination, isPending, isError, isFetching, refetch } = useMyKawaderRequests({
    scope,
    status,
    page,
    per_page: PER_PAGE,
  });

  const updateParams = useCallback(
    (next: { scope?: MyKawaderScope; status?: KawaderStatus | null; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.scope !== undefined) {
        if (next.scope !== DEFAULT_SCOPE) params.set("scope", next.scope);
        else params.delete("scope");
        // Switching tabs resets the status and the page.
        params.delete("status");
        params.delete("page");
      }
      if (next.status !== undefined) {
        if (next.status) params.set("status", next.status);
        else params.delete("status");
        params.delete("page"); // a new filter starts from page 1
      }
      if (next.page !== undefined) {
        if (next.page > 1) params.set("page", String(next.page));
        else params.delete("page");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filters: { value: KawaderStatus | null; label: string }[] = [
    { value: null, label: t("list.filterAll") },
    ...STATUSES_BY_SCOPE[scope].map((value) => ({ value, label: t(`status.${value}`) })),
  ];

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          title={t("list.errorTitle")}
          description={t("list.errorDescription")}
          retryLabel={t("list.retry")}
          onRetry={() => void refetch()}
        />
      );
    }

    // `isPending` (not `isLoading`): the query stays disabled until the session is ready.
    if (isPending) return <KawaderRequestsListSkeleton />;

    if (items.length === 0) {
      return (
        <EmptyState
          title={status ? t("list.emptyFilteredTitle") : t(`list.empty.${scope}Title`)}
          description={status ? t("list.emptyFilteredDescription") : t(`list.empty.${scope}Description`)}
          actionLabel={t("list.emptyCta")}
          onAction={() => router.push("/profile/kawader/new")}
        />
      );
    }

    return (
      <div className="space-y-3">
        {items.map((request) => (
          <KawaderRequestCard key={request.id} request={request} />
        ))}

        {pagination ? (
          <PaginationControls
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            isLoading={isFetching}
            onPageChange={(next) => updateParams({ page: next })}
            prevLabel={t("pagination.prev")}
            nextLabel={t("pagination.next")}
            formatSummary={({ currentPage, lastPage, total }) =>
              t("pagination.summary", { current: currentPage, last: lastPage, total: total ?? 0 })
            }
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{t("list.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("list.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/profile/kawader/new">
            <Plus className="h-4 w-4" aria-hidden />
            {t("list.newRequest")}
          </Link>
        </Button>
      </div>

      <Tabs value={scope} onValueChange={(next) => updateParams({ scope: parseScope(next) })}>
        <TabsList aria-label={t("list.tabsLabel")}>
          {SCOPES.map((value) => (
            <TabsTrigger key={value} value={value} className="px-4">
              {t(`list.tabs.${value}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div role="group" aria-label={t("list.filterLabel")} className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = (filter.value ?? undefined) === status;
          return (
            <button
              key={filter.value ?? "all"}
              type="button"
              aria-pressed={isActive}
              onClick={() => updateParams({ status: filter.value })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-white text-foreground hover:border-primary/50",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {renderContent()}
    </div>
  );
}
