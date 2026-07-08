import { useTranslations } from "next-intl";

export const medicalSpecialties = [
  { id: "1", key: "physicalTherapy", name: "العلاج الطبيعي" },
  { id: "2", key: "occupationalTherapy", name: "العلاج الوظيفي" },
  { id: "3", key: "neurologicalTherapy", name: "العلاج العصبي" },
  { id: "4", key: "geriatricRehab", name: "علاج أمراض الشيخوخة وإعادة تأهيل كبار السن" },
  { id: "5", key: "pediatricRehab", name: "تأهيل الأطفال" },
  { id: "6", key: "aiMotionAnalysis", name: "العلاج بالذكاء الاصطناعي والتحليل الحركي" },
  { id: "7", key: "speechLanguageTherapy", name: "علاج النطق واللغة" },
  { id: "8", key: "supportivePsychotherapy", name: "العلاج النفسي الداعم" },
] as const;

export function useLocalizedMedicalSpecialties() {
  const t = useTranslations("medicalSpecialties");
  return medicalSpecialties.map((specialty) => ({
    id: specialty.id,
    name: t(specialty.key),
  }));
}
