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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  KawaderArea,
  KawaderPriority,
  KawaderServiceKey,
  KawaderStatus,
} from "../../../types/kawader";
import {
  KAWADER_PRIORITIES,
  KAWADER_SERVICE_KEYS,
  KAWADER_STATUSES,
} from "../../../utils/kawader-constants";
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
  /** The area filter is rendered only when this list is non-empty. */
  areas?: KawaderArea[];
}

interface FilterSelectProps {
  label: string;
  value: string;
  anyLabel: string;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
}

function FilterSelect({ label, value, anyLabel, options, onChange }: FilterSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={(next) => onChange(next === ANY ? null : next)}>
        <SelectTrigger className="w-full" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
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
  areas = [],
}: AdminKawaderFiltersProps) {
  const t = useTranslations("kawader");
  const tf = useTranslations("kawader.admin.filters");

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
          options={KAWADER_STATUSES.map((status) => ({ value: status, label: t(`status.${status}`) }))}
          onChange={(value) => onChange({ status: value as KawaderStatus | null })}
        />
        <FilterSelect
          label={tf("priority")}
          anyLabel={tf("anyPriority")}
          value={view.priority ?? ANY}
          options={KAWADER_PRIORITIES.map((priority) => ({
            value: priority,
            label: tf(`priorities.${priority}`),
          }))}
          onChange={(value) => onChange({ priority: value as KawaderPriority | null })}
        />
        <FilterSelect
          label={tf("service")}
          anyLabel={tf("anyService")}
          value={view.service_key ?? ANY}
          options={KAWADER_SERVICE_KEYS.map((key) => ({ value: key, label: tf(`services.${key}`) }))}
          onChange={(value) => onChange({ service_key: value as KawaderServiceKey | null })}
        />
        {areas.length > 0 ? (
          <FilterSelect
            label={tf("area")}
            anyLabel={tf("anyArea")}
            value={view.service_area ?? ANY}
            options={areas.map((area) => ({ value: area.key, label: area.name }))}
            onChange={(value) => onChange({ service_area: value })}
          />
        ) : null}
        <FilterSelect
          label={tf("insurance")}
          anyLabel={tf("anyInsurance")}
          value={insuranceValue}
          options={[
            { value: "1", label: tf("insuranceYes") },
            { value: "0", label: tf("insuranceNo") },
          ]}
          onChange={(value) => onChange({ has_insurance: value === null ? null : value === "1" })}
        />
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
