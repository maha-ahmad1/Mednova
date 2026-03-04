"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgramDetails } from "../hooks/useProgramDetails";

interface ProgramDetailsPageProps {
  programId: string;
}

const statusLabel = {
  draft: "مسودة",
  approved: "موافق عليه",
  rejected: "مرفوض",
  published: "منشور",
  archived: "مؤرشف",
};

export function ProgramDetailsPage({ programId }: ProgramDetailsPageProps) {
  const { data: program, isLoading, isError } = useProgramDetails(programId);

  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  const activeVideo = useMemo(() => {
    if (!program?.videos.length) {
      return null;
    }

    const selectedVideo = program.videos.find((video) => video.id === activeVideoId);
    return selectedVideo ?? program.videos[0];
  }, [activeVideoId, program?.videos]);

  const getPlayableVideoUrl = (videoPath: string | null) => {
    if (!videoPath) {
      return null;
    }

    if (videoPath.startsWith("http://") || videoPath.startsWith("https://")) {
      return videoPath;
    }

    return `https://api.mednovacare.com${videoPath.startsWith("/") ? "" : "/"}${videoPath}`;
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-4 p-6" dir="rtl">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6" dir="rtl">
        <Card>
          <CardContent className="space-y-3 pt-6 text-center">
            <p className="font-medium text-destructive">تعذر تحميل بيانات البرنامج.</p>
            <Button asChild variant="outline">
              <Link href="/control-panel/programs">العودة إلى البرامج</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-1 text-right">
          <h1 className="text-2xl font-semibold">تفاصيل البرنامج</h1>
          <p className="text-sm text-muted-foreground">مراجعة بيانات البرنامج والفيديوهات المرتبطة به.</p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/control-panel/programs">
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">معلومات البرنامج</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{program.title}</h2>
            <Badge variant="outline">{statusLabel[program.status]}</Badge>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">{program.description}</p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">المنشئ</p><p className="font-medium">{program.creator}</p></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">السعر</p><p className="font-medium">{program.price ?? "-"}</p></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">العملة</p><p className="font-medium">{program.currency ?? "-"}</p></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">عدد الفيديوهات</p><p className="font-medium">{program.videos.length}</p></div>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">ماذا ستتعلم</p>
            <p className="mt-1 text-sm text-foreground">{program.whatYouWillLearn}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">قائمة الفيديوهات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeVideo && (
            <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
              <p className="text-sm font-medium text-right">{activeVideo.title}</p>
              {getPlayableVideoUrl(activeVideo.videoPath) ? (
                <video
                  key={activeVideo.id}
                  controls
                  className="w-full rounded-lg bg-black"
                  src={getPlayableVideoUrl(activeVideo.videoPath) ?? undefined}
                >
                  متصفحك لا يدعم تشغيل الفيديو.
                </video>
              ) : (
                <p className="text-sm text-muted-foreground text-right">رابط الفيديو غير متاح.</p>
              )}
            </div>
          )}

          {program.videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد فيديوهات مرتبطة بهذا البرنامج.</p>
          ) : (
            program.videos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideoId(video.id)}
                className="flex w-full items-start justify-between rounded-lg border p-3 text-right transition hover:bg-muted/40"
              >
                <div className="space-y-1">
                  <p className="font-medium">{video.order ? `#${video.order} - ` : ""}{video.title}</p>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{video.durationMinute ?? "-"} دقيقة</span>
                    {video.isProgramIntro && <Badge variant="secondary">فيديو تعريفي</Badge>}
                  </div>
                </div>
                <PlayCircle className="h-5 w-5 text-muted-foreground" />
              </button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
