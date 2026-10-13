import type { AxiosInstance } from "axios";
import type { ReviewQueue, ReviewQueueProgram, ReviewQueueVideo } from "../types/review";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

interface PaginatedItems<T> {
  items?: T[];
}

// Raw payload: two separate paginated lists, each wrapped in `{ items, pagination }`.
// Item fields are read loosely (title_ar / title, creator / creator_name, ...) since the
// backend names differ from the UI-facing ReviewQueue* types.
type RawItem = Record<string, unknown>;

interface RawReviewQueue {
  pending_programs?: PaginatedItems<RawItem>;
  pending_videos?: PaginatedItems<RawItem>;
}

const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const num = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const nameOf = (value: unknown): string => {
  if (value && typeof value === "object") {
    const obj = value as RawItem;
    return str(obj.name ?? obj.full_name);
  }
  return str(value);
};

const mapProgram = (item: RawItem): ReviewQueueProgram => ({
  id: num(item.id),
  title: str(item.title_ar ?? item.title ?? item.title_en),
  creator_name: str(item.creator_name) || nameOf(item.creator ?? item.consultant),
  price: str(item.price),
  videos_count: num(item.videos_count ?? item.videos_total),
  submitted_at: str(item.submitted_at),
  submission_number: num(item.submission_number, 1),
});

const mapVideo = (item: RawItem): ReviewQueueVideo => ({
  id: num(item.id),
  program_id: num(item.program_id),
  program_title: str(item.program_title ?? item.program_title_ar) || nameOf(item.program),
  title: str(item.title_ar ?? item.title ?? item.title_en),
  created_at: str(item.created_at ?? item.submitted_at),
});

export const getReviewQueue = async (axiosInstance: AxiosInstance): Promise<ReviewQueue> => {
  const response = await axiosInstance.get<ApiResponse<RawReviewQueue>>(
    "/api/control-panel/programs/review-queue",
  );

  const raw = response.data.data;

  return {
    programs: (raw?.pending_programs?.items ?? []).map(mapProgram),
    videos: (raw?.pending_videos?.items ?? []).map(mapVideo),
  };
};
