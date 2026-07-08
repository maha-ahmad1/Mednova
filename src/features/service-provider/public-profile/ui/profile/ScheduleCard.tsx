import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { formatTime } from "@/utils/timeUtils";
import { translateDay } from "@/utils/translationUtils/dayTranslator";
import type { NormalizedProvider } from "@/utils/normalizeProvider";

interface ScheduleCardProps {
  provider: NormalizedProvider;
}

export default function ScheduleCard({ provider }: ScheduleCardProps) {
  const t = useTranslations("specialists.publicProfile.schedule");
  const locale = useLocale() === "ar" ? "ar" : "en";
  const schedule = provider.schedule;

  const defaultDays =
    locale === "ar"
      ? ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"]
      : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  return (
    <div className="space-y-6">
      {schedule && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#32A88D]" />
              {t("workSchedule")}
            </h4>
            <Badge className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1">
              {schedule.type_time === "online" ? t("onlineSessions") : t("inPersonSessions")}
            </Badge>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{t("morning")}</span>
              <span className="font-semibold text-gray-800">
                {formatTime(schedule.start_time_morning, locale)} - {formatTime(schedule.end_time_morning, locale)}
              </span>
            </div>

            {schedule.is_have_evening_time && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">{t("evening")}</span>
                <span className="font-semibold text-gray-800">
                  {formatTime(schedule.start_time_evening, locale)} - {formatTime(schedule.end_time_evening, locale)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#32A88D]" />
          {t("availableDays")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {schedule && schedule.day_of_week && schedule.day_of_week.length > 0
            ? schedule.day_of_week.map((day, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-50 border-gray-200 px-3 py-1.5"
                >
                  {translateDay(day, locale)}
                </Badge>
              ))
            : defaultDays.map((day) => (
                <Badge
                  key={day}
                  variant="outline"
                  className="bg-gray-50 border-gray-200 px-3 py-1.5"
                >
                  {day}
                </Badge>
              ))}
        </div>
      </div>
    </div>
  );
}
