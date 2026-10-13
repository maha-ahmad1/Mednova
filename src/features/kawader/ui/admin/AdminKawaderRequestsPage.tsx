"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "@/i18n/navigation";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { EmptyState } from "@/shared/ui/components/states/EmptyState";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useAdminKawaderRequests } from "../../hooks/useAdminKawaderRequests";
import type { AdminKawaderScope } from "../../types/kawader";
import {
  ADMIN_SCOPES,
  applyAdminKawaderPatch,
  hasActiveAdminKawaderFilters,
  parseAdminKawaderView,
  serializeAdminKawaderView,
  toAdminKawaderApiFilters,
  type AdminKawaderViewPatch,
} from "../../utils/kawader-admin-filters";
import { AdminKawaderFilters } from "./components/AdminKawaderFilters";
import { AdminKawaderRequestsTable } from "./components/AdminKawaderRequestsTable";

export function AdminKawaderRequestsPage() {
  const t = useTranslations("kawader");
  const ta = useTranslations("kawader.admin");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Scope, every filter and the page live in the URL; the server does all the filtering.
  const view = useMemo(() => parseAdminKawaderView(searchParams), [searchParams]);
  const hasActiveFilters = hasActiveAdminKawaderFilters(view);

  const { items, pagination, isPending, isError, isFetching, isPlaceholderData, refetch } =
    useAdminKawaderRequests(toAdminKawaderApiFilters(view));

  const updateView = useCallback(
    (patch: AdminKawaderViewPatch) => {
      const params = applyAdminKawaderPatch(new URLSearchParams(searchParams.toString()), patch);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    // Filters only: the scope tab stays where it is.
    const params = new URLSearchParams();
    if (view.scope !== "open") params.set("scope", view.scope);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, view.scope]);

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          title={ta("errorTitle")}
          description={ta("errorDescription")}
          retryLabel={ta("retry")}
          onRetry={() => void refetch()}
        />
      );
    }

    // `isPending` (not `isLoading`): the query stays disabled until the session is ready.
    if (isPending) return <AdminKawaderRequestsTable items={[]} isLoading />;

    if (items.length === 0) {
      return (
        <EmptyState
          title={hasActiveFilters ? ta("emptyFilteredTitle") : ta("emptyTitle")}
          description={hasActiveFilters ? ta("emptyFilteredDescription") : ta("emptyDescription")}
          actionLabel={ta("filters.clear")}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      );
    }

    return (
      <div className="space-y-3">
        <AdminKawaderRequestsTable
          items={items}
          isRefreshing={isFetching && isPlaceholderData}
          listQuery={serializeAdminKawaderView(view)}
        />

        {pagination ? (
          <PaginationControls
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            isLoading={isFetching}
            onPageChange={(page) => updateView({ page })}
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
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{ta("title")}</h1>
        <p className="text-sm text-muted-foreground">{ta("subtitle")}</p>
      </div>

      {/* A selected status overrides the scope on the server, so no tab is active then. */}
      <Tabs
        value={view.status ? "" : view.scope}
        onValueChange={(scope) => updateView({ scope: scope as AdminKawaderScope, status: null })}
      >
        <TabsList aria-label={ta("tabsLabel")}>
          {ADMIN_SCOPES.map((scope) => (
            <TabsTrigger key={scope} value={scope} className="px-4">
              {ta(`tabs.${scope}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AdminKawaderFilters
        view={view}
        onChange={updateView}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {renderContent()}
    </div>
  );
}
