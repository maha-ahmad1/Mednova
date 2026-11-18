import type { AxiosInstance } from "axios";

const progressPath = (programId: number, videoId: number) =>
  `/api/programs/${programId}/videos/${videoId}/progress`;

// Regular periodic save (every ~15s while playing, and on pause/end).
export const updateVideoProgress = async (
  axiosInstance: AxiosInstance,
  programId: number,
  videoId: number,
  positionSeconds: number,
): Promise<void> => {
  await axiosInstance.put(progressPath(programId, videoId), {
    position_seconds: positionSeconds,
  });
};

interface KeepaliveProgressArgs {
  programId: number;
  videoId: number;
  positionSeconds: number;
  token?: string;
  locale: string;
}

// Last save when the page is being left (tab closed, reload, SPA navigation, video switch).
// `keepalive` lets the request outlive the page; axios can't set it. sendBeacon isn't usable
// because it can't send PUT or an Authorization header.
export const sendVideoProgressKeepalive = ({
  programId,
  videoId,
  positionSeconds,
  token,
  locale,
}: KeepaliveProgressArgs): void => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL || !token) return;

  fetch(`${baseURL}${progressPath(programId, videoId)}`, {
    method: "PUT",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": locale,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ position_seconds: positionSeconds }),
  }).catch(() => {
    // Best effort: the page is going away, nothing left to report to.
  });
};
