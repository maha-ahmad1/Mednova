import type { ProgramManagementFilters } from "../types/program";

export const buildProgramsQueryParams = (filters: ProgramManagementFilters) => ({
  limit: filters.limit,
  status: filters.status,
  is_approved: filters.isApproved,
});
