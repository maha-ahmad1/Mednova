"use client";

import React from "react";
import { useFetcher } from "@/hooks/useFetcher";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import type { TherapistProfile } from "@/types/therpist";
import { TherapistPersonalCard } from "./TherapistPersonalCard";
import { TherapistMedicalCard } from "./TherapistMedicalCard";
import { TherapistLocationCard } from "./TherapistLocationCard";
import { TherapistBioCard } from "./TherapistBioCard";
import { TherapistscheduleCard } from "./TherapistscheduleCard";
import { TherapistLicensesCard } from "./TherpistLicensesCard";
import { TherapistPricingCard } from "./TherapistPricingCard";
import { SidebarImageEditor } from "@/features/profile/_create/ui/sidebar/SidebarImageEditor";
import { type UserType } from "@/features/profile/_views/hooks/useUpdateProfileImage";

export default function TherapistInfo() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const t = useTranslations("profile.therapistInfo");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const { data, isLoading, isError, error, refetch } =
    useFetcher<TherapistProfile>(["therapistProfile", userId], `/api/customer/${userId}`);

  if (isLoading) {
    return (
      <div dir={dir} className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
        <span className="ms-3 text-gray-600">{t("loading")}</span>
      </div>
    );
  }

  if (isError) {
    toast.error(t("loadError", { error: String((error as Error)?.message) }));
  }

  const profile = (data ?? {}) as TherapistProfile;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div dir={dir} className="space-y-6">
        <div className="lg:hidden">
          <SidebarImageEditor
            currentImage={(typeof profile.image === "string" ? profile.image : undefined) || session?.user?.image || "/images/placeholder.svg"}
            userType={(session?.user?.role as UserType) || "therapist"}
            userId={userId!}
            refetch={refetch}
          />
        </div>

        <TherapistPersonalCard profile={profile} userId={userId!} refetch={refetch} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TherapistMedicalCard details={profile.therapist_details} userId={userId!} refetch={refetch} />
          <TherapistLicensesCard details={profile.therapist_details} userId={userId!} refetch={refetch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TherapistscheduleCard details={profile} userId={userId!} refetch={refetch} />
          <TherapistLocationCard details={profile} userId={userId!} refetch={refetch} />
        </div>

        <TherapistPricingCard details={profile.therapist_details} userId={userId!} refetch={refetch} />

        <TherapistBioCard details={profile.therapist_details} userId={userId!} refetch={refetch} />
      </div>
    </div>
  );
}
