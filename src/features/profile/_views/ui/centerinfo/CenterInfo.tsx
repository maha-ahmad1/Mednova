"use client";
import { useFetcher } from "@/hooks/useFetcher";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { CenterProfile } from "@/types/center";

import { CenterBioCard } from "./CenterBioCard";
import { CenterPersonalCard } from "./CenterPersonalCard";
import { CenterSpecialtiesCard } from "./CenterSpecialtiesCard";
import { CenterRegistrationCard } from "./CenterRegistrationCard";
import { CenterScheduleCard } from "./CenterScheduleCard";
import { CenterLocationCard } from "./CenterLocationCard";

export default function CenterInfo() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  
console.log("roles" + session?.role)

  const { data, isLoading, isError, error, refetch } =
    useFetcher<CenterProfile>(
      ["centerProfile", userId],
      `/api/customer/${userId}`
    );

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
        <span className="ml-3 text-gray-600">جارٍ التحميل...</span>
      </div>
    );
  }

  if (isError) {
    toast.error(
      `حدث خطأ أثناء جلب البيانات: ${String((error as Error)?.message)}`
    );
  }

  const profile = (data ?? {}) as CenterProfile;

  return (
    <div className="container max-w-5xl mx-auto">
      <div dir="rtl" className="space-y-6">
        <CenterPersonalCard
          profile={profile}
          userId={userId!}
          refetch={refetch}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CenterSpecialtiesCard
            medicalSpecialtiesData={profile.medicalSpecialties}
            details={profile.center_details}
            userId={userId!}
            refetch={refetch}
          />
          <CenterRegistrationCard
            details={profile.center_details}
            userId={userId!}
            refetch={refetch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CenterScheduleCard
            details={profile}
            userId={userId!}
            refetch={refetch}
          />
          <CenterLocationCard
            details={profile}
            userId={userId!}
            refetch={refetch}
          />
        </div>

        <CenterBioCard
          details={profile.center_details}
          userId={userId!}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
