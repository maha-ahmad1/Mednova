"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Check, Loader2, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/shared/ui/forms";
import type { KawaderRequestFormValues } from "../../../types/kawader-form";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 60_000,
};

export function LocationField() {
  const t = useTranslations("kawader");
  const {
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext<KawaderRequestFormValues>();
  const [isLocating, setIsLocating] = useState(false);

  // Coordinates are hidden form state, not inputs.
  const hasCoordinates = Boolean(watch("latitude")) && Boolean(watch("longitude"));

  const setCoordinates = (latitude: string, longitude: string) => {
    setValue("latitude", latitude, { shouldDirty: true });
    setValue("longitude", longitude, { shouldDirty: true });
  };

  const handleUseCurrentLocation = () => {
    if (isLocating) return;

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      toast.error(t("location.unsupported"));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates(position.coords.latitude.toFixed(6), position.coords.longitude.toFixed(6));
        clearErrors("location_address");
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) toast.error(t("location.denied"));
        else if (error.code === error.TIMEOUT) toast.error(t("location.timeout"));
        else toast.error(t("location.unavailable"));
      },
      GEOLOCATION_OPTIONS,
    );
  };

  return (
    <div className="space-y-3">
      <FormInput
        label={t("location.label")}
        placeholder={t("location.placeholder")}
        autoComplete="street-address"
        error={errors.location_address?.message}
        {...register("location_address")}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation} disabled={isLocating}>
          {isLocating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t("location.locating")}
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" aria-hidden />
              {t("location.useCurrent")}
            </>
          )}
        </Button>

        {hasCoordinates ? (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Check className="h-4 w-4" aria-hidden />
            <span>{t("location.captured")}</span>
            <button
              type="button"
              onClick={() => setCoordinates("", "")}
              className="inline-flex items-center gap-1 text-muted-foreground underline hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              {t("location.clear")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
