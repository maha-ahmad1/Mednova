"use client";

import { useMemo } from "react";
import { useFetcher } from "@/hooks/useFetcher";
import type {
  ProgramsApiItem,
  ProgramsApiPaginatedData,
  ProgramsFilters,
  ProgramsPaginationMeta,
} from "../types/program";
import { buildProgramsQueryParams, mapApiProgramToControlPanelProgram } from "../utils/programs";

export function useControlPanelPrograms(filters: ProgramsFilters, page: number, perPage: number) {
  const params = useMemo(() => buildProgramsQueryParams(filters, page, perPage), [filters, page, perPage]);

  const query = useFetcher<ProgramsApiItem[] | ProgramsApiPaginatedData, Record<string, string | number>>(
    ["control-panel-programs"],
    "/api/control-panel/programs",
    { params },
  );

  const programsData = useMemo(
    () => (Array.isArray(query.data) ? query.data : (query.data?.data ?? [])),
    [query.data],
  );

  const pagination = useMemo(
    () => (Array.isArray(query.data) ? undefined : (query.data?.pagination as ProgramsPaginationMeta | undefined)),
    [query.data],
  );

  const programs = useMemo(
    () => programsData.map((program) => mapApiProgramToControlPanelProgram(program)),
    [programsData],
  );

  return {
    ...query,
    programs,
    pagination,
  };
}
