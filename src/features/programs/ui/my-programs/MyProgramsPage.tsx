"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { EmptyState } from "@/shared/ui/components/EmptyState";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { ProgramSkeleton } from "@/features/programs/ui/program-list/components/ProgramSkeleton";
import { useMyCoursesQuery } from "@/features/programs/hooks";
import { MyCourseCard } from "./components/MyCourseCard";

const COURSES_PER_PAGE = 15;

export function MyProgramsPage() {
  const t = useTranslations("programs.my");
  const { push } = useNavigationLoader();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useMyCoursesQuery(page, COURSES_PER_PAGE);
  const courses = data?.data.items ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-600 mt-1">{t("subtitle")}</p>
        </div>

        {(isLoading || isFetching) && <ProgramSkeleton count={6} />}

        {!isLoading && !isFetching && isError && (
          <EmptyState
            type="error"
            title={t("errorTitle")}
            description={t("errorDesc")}
            actionText={t("retry")}
            onAction={() => window.location.reload()}
          />
        )}

        {!isLoading && !isFetching && !isError && courses.length === 0 && (
          <EmptyState
            type="empty"
            title={t("emptyTitle")}
            description={t("emptyDesc")}
            actionText={t("browse")}
            onAction={() => push("/programs")}
          />
        )}

        {!isLoading && !isFetching && !isError && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <MyCourseCard key={course.program_id} course={course} />
            ))}
          </div>
        )}

        {pagination && (
          <PaginationControls
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            isLoading={isLoading || isFetching}
            onPageChange={(nextPage) => {
              if (nextPage < 1 || nextPage > pagination.last_page) return;
              setPage(nextPage);
            }}
          />
        )}
      </div>
    </div>
  );
}
