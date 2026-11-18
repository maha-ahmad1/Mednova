import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { NormalizedProvider } from "@/utils/normalizeProvider";

interface ProfileDetailsProps {
  provider: NormalizedProvider;
}

export default function ProfileDetails({ provider }: ProfileDetailsProps) {
  const t = useTranslations("specialists.publicProfile");
  const tCard = useTranslations("specialists.card");

  return (
    <div className="text-start">
      {/* Same heading style as ServicesPricing so both columns match. */}
      <h3 className="text-gray-500 text-sm mb-4">{t("professionalInfoTitle")}</h3>

      {/* Two-column grid: the label column sizes to the widest label, so all values line up. */}
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-3 rounded-xl bg-gray-50 p-4">
        <dt className="text-gray-500 text-sm whitespace-nowrap">{t("specialtiesLabel")}</dt>
        <dd className="flex min-w-0 flex-wrap gap-2">
          {provider.specialties?.length > 0 ? (
            provider.specialties.map((specialty) => (
              <Badge
                key={specialty.id}
                className="h-auto max-w-full shrink whitespace-normal text-start leading-snug bg-[#32A88D]/10 text-[#32A88D] px-3 py-1 text-sm"
              >
                {specialty.name}
              </Badge>
            ))
          ) : (
            <Badge className="h-auto max-w-full shrink whitespace-normal text-start leading-snug bg-[#32A88D]/10 text-[#32A88D] px-3 py-1 text-sm">
              {tCard("notSpecified")}
            </Badge>
          )}
        </dd>

        {provider.details.map((detail) => (
          <Fragment key={detail.label}>
            <dt className="text-gray-500 text-sm whitespace-nowrap">{detail.label}:</dt>
            <dd className="text-gray-800 break-words">{detail.value}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
