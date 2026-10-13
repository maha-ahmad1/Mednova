/** Drops `undefined`, `null` and blank-string entries so they never reach the query string. */
export function cleanParams<T extends object>(params: T): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) continue;
      result[key] = trimmed;
      continue;
    }
    if (typeof value === "boolean") {
      result[key] = value ? 1 : 0;
      continue;
    }
    result[key] = value as number;
  }

  return result;
}
