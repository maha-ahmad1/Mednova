"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/shared/ui/components/TextArea";
import { useUpdateTherapist } from "@/features/profile/_views/hooks/useUpdateTherapist";
import { toast } from "sonner";
import type { TherapistFormValues } from "@/app/api/therapist";
import type { TherapistProfile } from "@/types/therpist";
import { bioSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Loader2, Edit, Building, FileText, BookOpen } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type CenterBioCardProps = {
  details: TherapistProfile["therapist_details"];
  userId: string;
  refetch: () => void;
};

export function CenterBioCard({
  details,
  userId,
  refetch,
}: CenterBioCardProps) {
  const t = useTranslations("profile.centerInfo");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [editing, setEditing] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [bio, setBio] = useState(details?.bio ?? "");
  const [localDetails, setLocalDetails] = useState<
    TherapistProfile["therapist_details"] | null
  >(null);
const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const { update, isUpdating } = useUpdateTherapist({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  useEffect(() => {
    if (details) {
      setLocalDetails(details);
      setBio(details.bio ?? "");
    }
  }, [details]);

  useEffect(() => {
    const el = bioRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [localDetails?.bio, details?.bio, editing]);

  const startEdit = () => {
    setBio(localDetails?.bio ?? "");
    setEditing(true);
  };

  const cancelEdit = () => {
    setBio(localDetails?.bio ?? "");
    setEditing(false);
    setServerErrors({});
  };

  const handleChange = (value: string) => {
    setBio(value);

    const result = bioSchema.safeParse({ bio: value });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setServerErrors(fieldErrors);
    } else {
      setServerErrors({});
    }
  };

  const handleSave = async () => {
    const result = bioSchema.safeParse({ bio });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setServerErrors(fieldErrors);
      toast.error(t("bioCard.validationError"));
      return;
    }

    const payload: TherapistFormValues = {
      bio,
      customer_id: String(userId),
    };

    try {
      await update(payload);
      await refetch();
      toast.success(t("bioCard.saveSuccess"));
      setLocalDetails((prev) => ({ ...prev, bio }));
      setEditing(false);
      setServerErrors({});
    } catch (err) {
      console.error(err);
      toast.error(t("bioCard.saveError"));
    }
  };

  const getFieldError = (field: "bio") => serverErrors[field];

  const displayDetails = localDetails ?? details;
  // const characterCount = bio.length;
  // const maxCharacters = 1000;
  const minCharacters = 120;
  const maxCharacters = 800;
  const characterCount = bio.trim().length;

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">{t("bioCard.title")}</h3>
        </div>

        {!editing ? (
          <Button
            onClick={startEdit}
            variant="outline"
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {t("bioCard.editButton")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              size="sm"
              className="bg-[#32A88D] hover:bg-[#32A88D]/90 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("saveButton")}
            </Button>
            <Button
              onClick={cancelEdit}
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-2"
            >
              {t("cancelButton")}
            </Button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-[#32A88D] mt-1" />
            <div className="flex-1">
              <span className="text-sm text-gray-500 block mb-3">
                {t("bioCard.bioLabel")}
              </span>
              {displayDetails?.bio ? (
                <div className="prose prose-sm max-w-none">
                  <p
                    ref={bioRef}
                    className={cn(
                      "text-gray-800 whitespace-pre-wrap leading-relaxed text-justify",
                      !expanded && "line-clamp-3",
                    )}
                  >
                    {displayDetails.bio}
                  </p>
                  {isClamped && (
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => !prev)}
                      className="text-[#32A88D] text-sm font-medium mt-2 hover:underline"
                    >
                      {expanded ? t("bioCard.showLess") : t("bioCard.showMore")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t("bioCard.noBioTitle")}</p>
                  <p className="text-sm mt-1">
                    {t("bioCard.noBioDesc")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            {t("bioCard.editTitle")}
          </h4>

          <div className="space-y-4">
            <TextArea
              label={t("bioCard.bioLabel")}
              rtl={isRtl}
              value={bio}
              onChange={(e) => handleChange(e.target.value)}
              error={getFieldError("bio")}
              className="bg-white min-h-[200px] resize-vertical"
              placeholder={t("bioCard.bioPlaceholder")}
            />

            <div className="flex justify-between items-center text-sm">
              <span
                className={`${
                  characterCount > maxCharacters * 0.8
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                {t("bioCard.charCount", { count: characterCount, max: maxCharacters })}
              </span>
              {characterCount > maxCharacters * 0.8 && (
                <span className="text-amber-600">
                  {characterCount > maxCharacters
                    ? t("bioCard.exceededLimit")
                    : t("bioCard.approachingLimit")}
                </span>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {t("bioCard.tipsTitle")}
              </h5>
              <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                <li>{t("bioCard.tip1")}</li>
                <li>{t("bioCard.tip2")}</li>
                <li>{t("bioCard.tip3")}</li>
                <li>{t("bioCard.tip4")}</li>
                <li>{t("bioCard.tip5")}</li>
              </ul>
            </div>

            {/* {bio && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">معاينة النبذة:</h5>
                <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                  {bio.length > 150 ? `${bio.substring(0, 150)}...` : bio}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {Math.ceil(bio.length / 200)} دقيقة قراءة تقريباً
                </p>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
