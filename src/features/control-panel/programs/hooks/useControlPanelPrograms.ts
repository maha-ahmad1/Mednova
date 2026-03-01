"use client";

import { useMemo } from "react";
import { useFetcher } from "@/hooks/useFetcher";
import type { ProgramsApiItem, ProgramsFilters } from "../types/program";
import { buildProgramsQueryParams, mapApiProgramToControlPanelProgram } from "../utils/programs";

export function useControlPanelPrograms(filters: ProgramsFilters) {
  const params = useMemo(() => buildProgramsQueryParams(filters), [filters]);

  const query = useFetcher<ProgramsApiItem[], Record<string, string | number>>(
    ["control-panel-programs"],
    "/api/control-panel/programs",
    { params },
  );

  const programs = useMemo(
    () => (query.data ?? []).map((program) => mapApiProgramToControlPanelProgram(program)),
    [query.data],
  );

  return {
    ...query,
    programs,
  };
}
