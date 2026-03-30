"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgramDetails } from "../hooks/useProgramDetails";
import { ProgramForm } from "./components/ProgramForm";
import { WithSkeleton } from "@/shared/ui/components/WithSkeleton";

interface EditProgramPageProps {
  programId: string;
}

export function EditProgramPage({ programId }: EditProgramPageProps) {
  const { data: program, isLoading, isError } = useProgramDetails(programId);

  const loadingSkeleton = (
      <div className="mx-auto w-full max-w-7xl space-y-4 p-6" dir="rtl">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-64 w-full" />
      </div>
    );

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
    <WithSkeleton isLoading={isLoading} skeleton={loadingSkeleton}>
      <div className="mx-auto w-full max-w-7xl space-y-5 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-1 text-right">
          <h1 className="text-2xl font-semibold">تحديث البرنامج</h1>
          <p className="text-sm text-muted-foreground">قم بتحديث بيانات البرنامج وإدارة فيديوهاته.</p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/control-panel/programs">
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Link>
        </Button>
      </div>

      <ProgramForm
        mode="edit"
        programId={program.id}
        initialValues={{
          title_ar: program.titleAr || program.title,
          description_ar: program.descriptionAr || program.description,
          what_you_will_learn_ar: program.whatYouWillLearnAr || program.whatYouWillLearn,
          price: program.price ?? 0,
          currency: program.currency ?? "",
        }}
        initialVideos={program.videos}
      />
      </div>
    </WithSkeleton>
  );
}
