// export function formatBalance(value: number, hidden: boolean): string {
//   if (hidden) return "••••";
//   return value.toFixed(3);
// }

export function formatLastUpdated(isoDate: string): string {
  if (!isoDate) return "قبل لحظات";
  return new Date(isoDate).toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
