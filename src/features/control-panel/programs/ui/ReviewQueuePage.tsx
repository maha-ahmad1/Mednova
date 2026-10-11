"use client";

import { Link } from "@/i18n/navigation";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReviewQueue } from "../hooks/useReviewQueue";

const SKELETON_ROWS_COUNT = 4;

export function ReviewQueuePage() {
  const { data, isLoading, isFetching, isError } = useReviewQueue();

  const programs = data?.programs ?? [];
  const videos = data?.videos ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6" dir="rtl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">قائمة المراجعة</h1>
        <p className="text-sm text-muted-foreground">
          راجعي الكورسات المرسلة حديثًا والفيديوهات الجديدة المضافة إلى كورسات منشورة.
        </p>
      </div>

      <Tabs defaultValue="programs" dir="rtl">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="programs">كورسات مرسلة للمراجعة</TabsTrigger>
            <TabsTrigger value="videos">فيديوهات جديدة على كورسات منشورة</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="programs" className="space-y-3">
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">العنوان</th>
                  <th className="px-4 py-3 font-medium">المنشئ</th>
                  <th className="px-4 py-3 font-medium">السعر</th>
                  <th className="px-4 py-3 font-medium">عدد الفيديوهات</th>
                  <th className="px-4 py-3 font-medium">تاريخ الإرسال</th>
                  <th className="px-4 py-3 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) &&
                  Array.from({ length: SKELETON_ROWS_COUNT }).map((_, index) => (
                    <tr key={`review-program-skeleton-${index}`} className="border-t align-middle">
                      <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-8 w-16" /></td>
                    </tr>
                  ))}

                {!isLoading && !isFetching && isError && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-destructive">
                      تعذر تحميل قائمة المراجعة. حاول مرة أخرى.
                    </td>
                  </tr>
                )}

                {!isLoading && !isFetching && !isError && programs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      لا توجد كورسات بانتظار المراجعة.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isFetching &&
                  !isError &&
                  programs.map((program) => (
                    <tr key={program.id} className="border-t align-middle">
                      <td className="px-4 py-3">{program.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{program.title}</span>
                          {program.submission_number > 1 && (
                            <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-700">
                              أُعيد الإرسال
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">{program.creator_name}</td>
                      <td className="px-4 py-3">{program.price}</td>
                      <td className="px-4 py-3">{program.videos_count}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(program.submitted_at).toLocaleDateString("ar")}
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild variant="outline" size="sm" className="gap-1">
                          <Link href={`/control-panel/programs/${program.id}`}>
                            <Eye className="h-4 w-4" />
                            عرض
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-3">
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">الكورس</th>
                  <th className="px-4 py-3 font-medium">عنوان الفيديو</th>
                  <th className="px-4 py-3 font-medium">تاريخ الإضافة</th>
                  <th className="px-4 py-3 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) &&
                  Array.from({ length: SKELETON_ROWS_COUNT }).map((_, index) => (
                    <tr key={`review-video-skeleton-${index}`} className="border-t align-middle">
                      <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-8 w-28" /></td>
                    </tr>
                  ))}

                {!isLoading && !isFetching && isError && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-destructive">
                      تعذر تحميل قائمة المراجعة. حاول مرة أخرى.
                    </td>
                  </tr>
                )}

                {!isLoading && !isFetching && !isError && videos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      لا توجد فيديوهات جديدة بانتظار المراجعة.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isFetching &&
                  !isError &&
                  videos.map((video) => (
                    <tr key={video.id} className="border-t align-middle">
                      <td className="px-4 py-3">{video.id}</td>
                      <td className="px-4 py-3">{video.program_title}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{video.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(video.created_at).toLocaleDateString("ar")}
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild variant="outline" size="sm" className="gap-1">
                          <Link href={`/control-panel/programs/${video.program_id}?video=${video.id}`}>
                            <Eye className="h-4 w-4" />
                            معاينة
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
}
