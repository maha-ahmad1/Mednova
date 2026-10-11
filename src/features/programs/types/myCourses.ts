export interface MyCourseItem {
  program_id: number;
  title: string;
  cover_image: string | null;
  creator_name: string;
  enrolled_at: string;
  videos_count: number;
  videos_completed: number;
  progress_percent: number;
  last_video_id: number | null;
}

export interface MyCoursesPaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more_pages: boolean;
}

export interface MyCoursesResponse {
  success: boolean;
  // pagination is a sibling of data, not nested inside it — matches every other
  // paginated list in the project, unlike the my-programs guess from an earlier stage.
  data: { items: MyCourseItem[] };
  pagination: MyCoursesPaginationMeta;
}
