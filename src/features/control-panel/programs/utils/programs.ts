import type { ControlPanelProgram, ProgramsApiItem, ProgramsFilters } from "../types/program";

export const mapApiProgramToControlPanelProgram = (program: ProgramsApiItem): ControlPanelProgram => ({
  id: program.id,
  title: program.title,
  creator: program.creator?.full_name ?? program.creator?.name ?? program.creator_name ?? "-",
  status: program.status,
  isApproved: program.is_approved === 1,
  price: program.price === null ? null : Number(program.price),
  currency: program.currency,
  coverImage: program.cover_image,
});

export const buildProgramsQueryParams = (filters: ProgramsFilters) => ({
  limit: filters.limit,
  ...(filters.status !== "all" ? { status: filters.status } : {}),
  ...(filters.approval === "approved"
    ? { is_approved: 1 }
    : filters.approval === "unapproved"
      ? { is_approved: 0 }
      : {}),
});

export const filterAndSortPrograms = (programs: ControlPanelProgram[], filters: ProgramsFilters) => {
  const query = filters.search.trim().toLowerCase();

  const filtered = programs.filter((program) => {
    if (!query) return true;

    return (
      program.title.toLowerCase().includes(query) ||
      program.creator.toLowerCase().includes(query) ||
      String(program.id).includes(query)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const direction = filters.sortOrder === "asc" ? 1 : -1;

    if (filters.sortBy === "id") {
      return (a.id - b.id) * direction;
    }

    if (filters.sortBy === "price") {
      return ((a.price ?? 0) - (b.price ?? 0)) * direction;
    }

    return a.title.localeCompare(b.title) * direction;
  });

  const start = (filters.page - 1) * filters.limit;
  const end = start + filters.limit;

  return {
    total: sorted.length,
    rows: sorted.slice(start, end),
  };
};
