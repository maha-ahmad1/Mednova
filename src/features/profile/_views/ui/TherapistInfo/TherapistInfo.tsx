"use client";

import React from "react";
import { useFetcher } from "@/hooks/useFetcher";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import type { TherapistProfile } from "@/types/therpist";
import { TherapistPersonalCard } from "./TherapistPersonalCard";
import { TherapistMedicalCard } from "./TherapistMedicalCard";
import { TherapistLocationCard } from "./TherapistLocationCard";
import { TherapistBioCard } from "./TherapistBioCard";
import { TherapistscheduleCard } from "./TherapistscheduleCard";
import { TherapistLicensesCard } from "./TherpistLicensesCard";

export default function TherapistInfo() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading, isError, error, refetch } =
    useFetcher<TherapistProfile>(["therapistProfile", userId], `/api/customer/${userId}`);

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
        <span className="ml-3 text-gray-600">جارٍ التحميل...</span>
      </div>
    );
  }

  if (isError) {
    toast.error(`حدث خطأ أثناء جلب البيانات: ${String((error as Error)?.message)}`);
  }

  const profile = (data ?? {}) as TherapistProfile;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div dir="rtl" className="space-y-6">
        <TherapistPersonalCard profile={profile} userId={userId!} refetch={refetch} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TherapistMedicalCard details={profile.therapist_details} userId={userId!} refetch={refetch} />
          <TherapistLicensesCard details={profile.therapist_details} userId={userId!} refetch={refetch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TherapistscheduleCard details={profile} userId={userId!} refetch={refetch} />
          <TherapistLocationCard details={profile} userId={userId!} refetch={refetch} />
        </div>

        <TherapistBioCard details={profile.therapist_details} userId={userId!} refetch={refetch} />
      </div>
    </div>
  );
}