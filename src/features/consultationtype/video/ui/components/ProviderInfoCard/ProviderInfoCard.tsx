"use client"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import type { ServiceProvider } from "@/features/service-provider/types/provider"
import { getProviderSpecializationLabel } from "@/features/service-provider/utils/provider-specializations"

interface Props {
  provider?: ServiceProvider | null
  consultantType?: string
  selectedDate?: Date
  selectedTime?: string
  onBack: () => void
  isLoading?: boolean
}

export default function ProviderInfoCard({
  provider,
  consultantType,
  selectedDate,
  selectedTime,
  onBack,
  isLoading,
}: Props) {
  const t = useTranslations("booking.providerCard")
  const tCard = useTranslations("specialists.card")
  const locale = useLocale()
  const isRtl = locale === "ar"
  const dateFnsLocale = isRtl ? ar : enUS
  const BackIcon = isRtl ? ArrowRight : ArrowLeft

  const getSpecialty = () => getProviderSpecializationLabel(provider, t("specialtyFallback"))

  const getAddress = () => provider?.location_details?.formatted_address || t("addressFallback")

  const getProviderImage = () => {
    if (provider?.image) return provider.image
    return consultantType === "therapist" ? "/default-doctor.png" : "/default-center.png"
  }

  return (
    <>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center mb-3 sm:mb-4 overflow-hidden">
            <Image
              src={getProviderImage() || "/images/placeholder.svg"}
              alt={provider?.full_name || (consultantType === "therapist" ? t("specialistAlt") : t("centerAlt"))}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{provider?.full_name || tCard("notSpecified")}</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{getSpecialty()}</p>

          <div className="flex items-center gap-2 mt-3 sm:mt-4 text-gray-500">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-center">{getAddress()}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 sm:pt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{t("bookingInfoTitle")}</h3>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm sm:text-base text-gray-600">{t("serviceLabel")}</span>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm max-w-[60%] truncate">
                {getSpecialty()}
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm sm:text-base text-gray-600">{t("durationLabel")}</span>
              <span className="text-sm sm:text-base font-medium">{t("durationValue")}</span>
            </div>

            {selectedDate && selectedTime && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm sm:text-base text-gray-600">{t("dateLabel")}</span>
                  <div className="text-end">
                    <div className="text-sm sm:text-base font-medium">{format(selectedDate, "dd MMMM yyyy", { locale: dateFnsLocale })}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm sm:text-base text-gray-600">{t("timeLabel")}</span>
                  <div className="text-end">
                    <div className="text-sm sm:text-base font-medium">{selectedTime}</div>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm sm:text-base text-gray-600">{t("appointmentTypeLabel")}</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs sm:text-sm">{t("videoConsultation")}</Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full border-[#32A88D] text-[#32A88D] rounded-xl py-5 sm:py-6 text-sm sm:text-base cursor-pointer hover:bg-[#32A88D]/10 hover:border-[#2a8a7a] hover:text-[#2a8a7a] transition-colors flex items-center justify-center bg-transparent"
          onClick={onBack}
        >
          <BackIcon className="w-4 h-4 sm:w-5 sm:h-5 me-2" />
          {t("backButton")}
        </Button>
      </div>
    </>
  )
}
