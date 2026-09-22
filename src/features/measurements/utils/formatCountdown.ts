export function formatCountdown(expiresAt: string): { label: string; expired: boolean } {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return { label: "00:00", expired: true };
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return { label: `${minutes}:${seconds}`, expired: false };
}
