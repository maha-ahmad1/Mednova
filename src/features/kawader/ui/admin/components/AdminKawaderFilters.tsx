"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AdminKawaderMeta,
  KawaderPriority,
  KawaderStatus,
} from "../../../types/kawader";
import type {
  AdminKawaderViewPatch,
  AdminKawaderViewState,
} from "../../../utils/kawader-admin-filters";

const SEARCH_DEBOUNCE_MS = 400;
// Radix Select cannot use "" as an item value, so "any" stands for "no filter".
const ANY = "any";

interface AdminKawaderFiltersProps {
  view: AdminKawaderViewState;
  onChange: (patch: AdminKawaderViewPatch) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  /** Options and labels for the selects. While it is missing (loading / failed) they are disabled. */
  meta?: AdminKawaderMeta;
}

interface FilterOption {
  value: string;
  label: string;
  /** Small marker next to the label (e.g. legacy areas). */
  badge?: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  anyLabel: string;
  options?: FilterOption[];
  /** Used instead of `options` to render grouped items. */
  groups?: { label: string; options: FilterOption[] }[];
  disabled?: boolean;
  onChange: (value: string | null) => void;
}

function FilterItem({ option }: { option: FilterOption }) {
  return (
    <SelectItem value={option.value}>
      <span>{option.label}</span>
      {option.badge ? (
        <span className="ms-2 rounded-full border px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
          {option.badge}
        </span>
      ) : null}
    </SelectItem>
  );
}

function FilterSelect({
  label,
  value,
  anyLabel,
  options = [],
  groups,
  disabled,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(next) => onChange(next === ANY ? null : next)}
      >
        <SelectTrigger className="w-full" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
          {groups
            ? groups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((option) => (
                    <FilterItem key={option.value} option={option} />
                  ))}
                </SelectGroup>
              ))
            : options.map((option) => <FilterItem key={option.value} option={option} />)}
        </SelectContent>
      </Select>
    </div>
  );
}

export function AdminKawaderFilters({
  view,
  onChange,
  onClear,
  hasActiveFilters,
  meta,
}: AdminKawaderFiltersProps) {
  const ta = useTranslations("kawader.admin");
  const tf = useTranslations("kawader.admin.filters");
  const metaMissing = !meta;

  // Labels come from the API. Open statuses first, then closed (from `group`).
  const statusGroups = (["open", "closed"] as const)
    .map((group) => ({
      label: ta(`tabs.${group}`),
      options: (meta?.statuses ?? [])
        .filter((status) => status.group === group)
        .map((status) => ({ value: status.key, label: status.label })),
    }))
    .filter((group) => group.options.length > 0);

  // Legacy areas stay selectable (old requests) but go last, with a marker.
  const areaOptions = [...(meta?.areas ?? [])]
    .sort((a, b) => Number(a.legacy) - Number(b.legacy))
    .map((area) => ({
      value: area.key,
      label: area.name,
      badge: area.legacy ? tf("legacy") : undefined,
    }));

  // The input keeps its own text and writes to the URL after a pause.
  const [searchText, setSearchText] = useState(view.search);
  const committedSearch = useRef(view.search);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // The URL changed from outside (clear filters, back button): follow it.
  useEffect(() => {
    if (view.search !== committedSearch.current) {
      committedSearch.current = view.search;
      setSearchText(view.search);
    }
  }, [view.search]);

  useEffect(() => {
    const next = searchText.trim();
    if (next === committedSearch.current) return;

    const timer = setTimeout(() => {
      committedSearch.current = next;
      onChangeRef.current({ search: next || null });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchText]);

  const insuranceValue = view.has_insurance === undefined ? ANY : view.has_insurance ? "1" : "0";

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={tf("searchPlaceholder")}
          aria-label={tf("searchPlaceholder")}
          className="w-full ps-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label={tf("status")}
          anyLabel={tf("anyStatus")}
          value={view.status ?? ANY}
          groups={statusGroups}
          disabled={metaMissing}
          onChange={(value) => onChange({ status: value as KawaderStatus | null })}
        />
        <FilterSelect
          label={tf("priority")}
          anyLabel={tf("anyPriority")}
          value={view.priority ?? ANY}
          options={(meta?.priorities ?? []).map((priority) => ({
            value: priority.key,
            label: priority.label,
          }))}
          disabled={metaMissing}
          onChange={(value) => onChange({ priority: value as KawaderPriority | null })}
        />
        <FilterSelect
          label={tf("service")}
          anyLabel={tf("anyService")}
          value={view.service_key ?? ANY}
          options={(meta?.services ?? []).map((service) => ({
            value: service.key,
            label: service.name,
          }))}
          disabled={metaMissing}
          onChange={(value) => onChange({ service_key: value })}
        />
        <FilterSelect
          label={tf("area")}
          anyLabel={tf("anyArea")}
          value={view.service_area ?? ANY}
          options={areaOptions}
          disabled={metaMissing}
          onChange={(value) => onChange({ service_area: value })}
        />
        {/* Hidden once the backend turns insurance off; old requests keep showing it in details. */}
        {meta?.insurance_enabled === false ? null : (
          <FilterSelect
            label={tf("insurance")}
            anyLabel={tf("anyInsurance")}
            value={insuranceValue}
            options={[
              { value: "1", label: tf("insuranceYes") },
              { value: "0", label: tf("insuranceNo") },
            ]}
            disabled={metaMissing}
            onChange={(value) => onChange({ has_insurance: value === null ? null : value === "1" })}
          />
        )}
        <div className="space-y-1.5">
          <Label htmlFor="kawader-admin-date-from" className="text-xs text-muted-foreground">
            {tf("dateFrom")}
          </Label>
          <Input
            id="kawader-admin-date-from"
            type="date"
            value={view.date_from ?? ""}
            max={view.date_to}
            onChange={(event) => onChange({ date_from: event.target.value || null })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kawader-admin-date-to" className="text-xs text-muted-foreground">
            {tf("dateTo")}
          </Label>
          <Input
            id="kawader-admin-date-to"
            type="date"
            value={view.date_to ?? ""}
            min={view.date_from}
            onChange={(event) => onChange({ date_to: event.target.value || null })}
          />
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" aria-hidden />
            {tf("clear")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
