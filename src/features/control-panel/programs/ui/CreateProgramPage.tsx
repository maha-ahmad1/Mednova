"use client";

import { ProgramForm } from "./components/ProgramForm";

export function CreateProgramPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">إنشاء برنامج</h1>
        <p className="text-sm text-muted-foreground">أدخل تفاصيل البرنامج وارفع الفيديوهات المرتبطة به.</p>
      </div>
      <ProgramForm mode="create" />
    </div>
  );
}
