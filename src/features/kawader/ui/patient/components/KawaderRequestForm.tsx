"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormInput, FormSubmitButton } from "@/shared/ui/forms";
import { useCreateKawaderRequest } from "../../../hooks/useCreateKawaderRequest";
import type { KawaderRequest, KawaderServicesResponse } from "../../../types/kawader";
import {
  createKawaderRequestSchema,
  getKawaderFormDefaults,
  type KawaderRequestFormValues,
} from "../../../types/kawader-form";
import { DEFAULT_COUNTRY_CODE } from "../../../utils/kawader-phone";
import { buildCreatePayload } from "../../../utils/kawader-payload";
import { AreaSelect } from "./AreaSelect";
import { ConsentField } from "./ConsentField";
import { EmergencyNotice } from "./EmergencyNotice";
import { InsuranceFields } from "./InsuranceFields";
import { LocationField } from "./LocationField";
import { PhoneField } from "./PhoneField";
import { PreferredAtField } from "./PreferredAtField";
import { ServiceSelect } from "./ServiceSelect";

interface KawaderRequestFormProps {
  servicesData: KawaderServicesResponse;
  onCreated: (request: KawaderRequest) => void;
}

// Server field names that are shown under a differently named form field.
const SERVER_FIELD_ALIASES: Record<string, keyof KawaderRequestFormValues> = {
  patient_phone: "phone_number",
  preferred_at: "preferred_date",
  timezone: "preferred_date",
  latitude: "location_address",
  longitude: "location_address",
};

export function KawaderRequestForm({ servicesData, onCreated }: KawaderRequestFormProps) {
  const t = useTranslations("kawader");
  const { data: session } = useSession();
  const sessionName = session?.user?.full_name;

  const areas = useMemo(() => servicesData.areas ?? [], [servicesData.areas]);
  const areasEnabled = areas.length > 0;
  const insuranceEnabled = servicesData.insurance_enabled === true;

  const [serviceKey, setServiceKey] = useState("");
  const service = useMemo(
    () => servicesData.services.find((item) => item.key === serviceKey),
    [servicesData.services, serviceKey],
  );

  // Rebuilt when the service changes: needs_details / needs_destination change the rules.
  const schema = useMemo(
    () => createKawaderRequestSchema(t, { service, areasEnabled, insuranceEnabled }),
    [t, service, areasEnabled, insuranceEnabled],
  );

  const form = useForm<KawaderRequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getKawaderFormDefaults(sessionName ?? "", DEFAULT_COUNTRY_CODE),
    mode: "onSubmit",
  });
  const { register, setValue, getValues, clearErrors, setError, handleSubmit, formState } = form;
  const { errors } = formState;

  // The session can finish loading after the first render: prefill the name once it does.
  useEffect(() => {
    if (sessionName && !getValues("patient_name")) setValue("patient_name", sessionName);
  }, [sessionName, getValues, setValue]);

  // Errors of fields whose rules just changed would otherwise be stale.
  useEffect(() => {
    clearErrors(["transfer_destination", "patient_notes"]);
  }, [serviceKey, clearErrors]);

  const isFieldRendered = (field: keyof KawaderRequestFormValues) => {
    if (field === "service_area") return areasEnabled;
    if (field === "transfer_destination") return Boolean(service?.needs_destination);
    if (field.startsWith("insurance_") || field === "has_insurance") return insuranceEnabled;
    return field in getValues();
  };

  const handleServerErrors = (serverErrors: Record<string, string>) => {
    Object.entries(serverErrors).forEach(([field, message], index) => {
      const target = SERVER_FIELD_ALIASES[field] ?? (field as keyof KawaderRequestFormValues);
      if (isFieldRendered(target)) {
        setError(target, { type: "server", message }, { shouldFocus: index === 0 });
      } else {
        toast.error(message);
      }
    });
  };

  const { createRequest, isLoading } = useCreateKawaderRequest({ onValidationError: handleServerErrors });

  // A ref guards the handler itself: `disabled` alone leaves a render-cycle window for a
  // second submit (Enter key or a fast double-click).
  const submittingRef = useRef(false);

  const onSubmit = handleSubmit(async (values) => {
    if (submittingRef.current || isLoading) return;
    submittingRef.current = true;

    try {
      const response = await createRequest(
        buildCreatePayload(values, { service, areasEnabled, insuranceEnabled }),
      );
      onCreated(response.data);
    } catch {
      // The mutation hook already showed the toast / mapped the field errors.
    } finally {
      submittingRef.current = false;
    }
  });

  const notesRequired = Boolean(service?.needs_details);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <EmergencyNotice phone={servicesData.emergency_phone} />

        <p className="flex items-start gap-2 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {t("pricing.note")}
        </p>

        <div className="space-y-5 rounded-xl border bg-white p-4 sm:p-6">
          <ServiceSelect services={servicesData.services} selected={service} onSelect={setServiceKey} />

          {areasEnabled ? <AreaSelect areas={areas} /> : null}

          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <FormInput
              label={t("patientName.label")}
              placeholder={t("patientName.placeholder")}
              autoComplete="name"
              error={errors.patient_name?.message}
              {...register("patient_name")}
            />
            <FormInput
              label={t("patientAge.label")}
              inputMode="numeric"
              maxLength={3}
              error={errors.patient_age?.message}
              {...register("patient_age")}
            />
          </div>

          <PhoneField />

          <LocationField />

          {service?.needs_destination ? (
            <FormInput
              label={t("destination.label")}
              placeholder={t("destination.placeholder")}
              error={errors.transfer_destination?.message}
              {...register("transfer_destination")}
            />
          ) : null}

          <PreferredAtField />

          <div className="space-y-2">
            <Label htmlFor="kawader-patient-notes">
              {notesRequired ? t("notes.label") : t("notes.labelOptional")}
            </Label>
            <Textarea
              id="kawader-patient-notes"
              rows={4}
              maxLength={1000}
              placeholder={service?.hint ?? t("notes.placeholder")}
              aria-invalid={!!errors.patient_notes}
              {...register("patient_notes")}
            />
            {errors.patient_notes?.message ? (
              <p className="text-sm text-destructive">{errors.patient_notes.message}</p>
            ) : null}
          </div>

          <InsuranceFields enabled={insuranceEnabled} />

          <ConsentField />

          <FormSubmitButton isLoading={isLoading} loadingText={t("submit.loading")}>
            {t("submit.label")}
          </FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
