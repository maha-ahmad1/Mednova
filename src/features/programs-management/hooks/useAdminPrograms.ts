"use client";

import { useMemo } from "react";
import { useFetcher } from "@/hooks/useFetcher";
import { buildProgramsQueryParams } from "../api/programsManagement.api";
import type { AdminProgram, ProgramManagementFilters } from "../types/program";

export function useAdminPrograms(filters: ProgramManagementFilters) {
  const params = useMemo(() => buildProgramsQueryParams(filters), [filters]);

  return useFetcher<AdminProgram[], ReturnType<typeof buildProgramsQueryParams>>(
    ["admin-programs"],
    "/api/control-panel/programs",
    {
      params,
    },
  );
}
