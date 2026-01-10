// import { useState, useEffect } from "react";

// interface UseSearchFiltersProps<T> {
//   initialFilters: T;
//   initialSearch?: string;
//   debounceDelay?: number;
// }

// export function useSearchFilters<T extends Record<string, string>>({
//   initialFilters,
//   initialSearch = "",
//   debounceDelay = 500,
// }: UseSearchFiltersProps<T>) {
//   const [searchQuery, setSearchQuery] = useState(initialSearch);
//   const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
//   const [filters, setFilters] = useState<T>(initialFilters);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//     }, debounceDelay);

//     return () => clearTimeout(handler);
//   }, [searchQuery, debounceDelay]);

//   const handleFilterChange = (key: keyof T, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const clearFilters = () => {
//     setFilters(initialFilters);
//     setSearchQuery("");
//   };

//   const getFilteredData = <D extends any[]>(data: D, filterFn: (item: D[0]) => boolean) => {
//     return data.filter(filterFn);
//   };

//   return {
//     searchQuery,
//     setSearchQuery,
//     debouncedSearch,
//     filters,
//     setFilters,
//     handleFilterChange,
//     clearFilters,
//     getFilteredData,
//   };
// }