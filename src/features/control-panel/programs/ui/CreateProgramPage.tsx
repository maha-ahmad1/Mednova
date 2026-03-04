"use client";

import { ProgramForm } from "./components/ProgramForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CreateProgramPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            إنشاء برنامج
          </h1>
          <p className="text-sm text-muted-foreground">
            أدخل تفاصيل البرنامج وارفع الفيديوهات المرتبطة به.
          </p>
        </div>

        <Button asChild variant="outline" className="gap-2">
          <Link href="/control-panel/programs">
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Link>
        </Button>
      </div>
      <ProgramForm mode="create" />
    </div>
  );
}
