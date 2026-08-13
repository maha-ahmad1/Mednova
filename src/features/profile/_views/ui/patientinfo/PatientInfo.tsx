"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useFetcher } from "@/hooks/useFetcher";
import { useUpdatePatient } from "@/features/profile/_views/hooks/useUpdatePatient";
import { useUpdateLoction } from "../../hooks/useUpdateLoction";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createPersonal1Schema, createPersonal2Schema } from "@/lib/validation";
import PatientPersonal1Card from "./PatientPersonal1Card";
import PatientPersonal2Card from "./PatientPersonal2Card";
import type { PatientProfile } from "@/types/patient";
import type { ZodTypeAny } from "zod";
import { signIn } from "next-auth/react";
import { buildFullPhoneNumber, parsePhoneNumber } from "@/utils/phone";
import { isValidPhoneLength, phoneLengthErrorMessage } from "@/utils/phoneValidation";

export default function PatientInfo() {
  const { data: session } = useSession();
  const t = useTranslations("profile.patientInfo");
  const tValidation = useTranslations("profile.patientInfo.validation");
  const userId = session?.user?.id;

  const personal1Schema = useMemo(
    () =>
      createPersonal1Schema({
        fullNameMin: tValidation("fullNameMin"),
        emailInvalid: tValidation("emailInvalid"),
        phoneMin: tValidation("phoneMin"),
        birthDateInvalid: tValidation("birthDateInvalid"),
        emergencyContactMin: tValidation("emergencyContactMin"),
        genderRequired: tValidation("genderRequired"),
        countryRequired: tValidation("countryRequired"),
        cityRequired: tValidation("cityRequired"),
        addressMin: tValidation("addressMin"),
        imageTooLarge: tValidation("imageTooLarge"),
      }),
    [tValidation],
  );
  const personal2Schema = useMemo(
    () =>
      createPersonal2Schema({
        fullNameMin: tValidation("fullNameMin"),
        emailInvalid: tValidation("emailInvalid"),
        phoneMin: tValidation("phoneMin"),
        birthDateInvalid: tValidation("birthDateInvalid"),
        emergencyContactMin: tValidation("emergencyContactMin"),
        genderRequired: tValidation("genderRequired"),
        countryRequired: tValidation("countryRequired"),
        cityRequired: tValidation("cityRequired"),
        addressMin: tValidation("addressMin"),
        imageTooLarge: tValidation("imageTooLarge"),
      }),
    [tValidation],
  );

  const { data, isLoading, isError, error, refetch } =
    useFetcher<PatientProfile>(
      ["patientProfile", userId],
      `/api/customer/${userId}`
    );

  const { update: updateLocation } = useUpdateLoction({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  const { update, isUpdating } = useUpdatePatient({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const localProfileState = useState<Partial<PatientProfile> | null>(null);
  const localProfile = localProfileState[0];

  useEffect(() => {
    if (!editingCard) {
      setFormValues({});
      setEditingCard(null);
    }
  }, [data, editingCard]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
        <span className="ml-3 text-gray-600">{t("loading")}</span>
      </div>
    );
  }

  if (isError) {
    toast.error(
      t("loadError", { error: String((error as Error)?.message) })
    );
  }

  const d = (data ?? {}) as PatientProfile;

  const startEdit = (card: string) => {
    setEditingCard(card);
    const source = localProfile ?? d;

    const { countryCode, localNumber } = parsePhoneNumber(source.phone);
    const emergencyParsed = parsePhoneNumber(
      source.patient_details?.emergency_phone ?? ""
    );

    setFormValues({
      full_name: source.full_name ?? "",
      email: source.email ?? "",
      phone: localNumber,
      countryCode,
      birth_date: source.birth_date ?? "",
      gender: source.gender?.toLowerCase() ?? "",
      emergency_contact: emergencyParsed.localNumber,
      emergencyCountryCode: emergencyParsed.countryCode,
      relationship: source.patient_details?.relationship ?? "",
      formatted_address: source.location_details?.formatted_address ?? "",
      country: source.location_details?.country ?? "",
      city: source.location_details?.city ?? "",
      image: null,
    });
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setFormValues({});
    setServerErrors({});
  };

  const getFieldError = (field: string, card: string) => {
    const serverError = serverErrors[field];
    let clientError: string | undefined;

    if (field === "phone" && card === "personal1") {
      const cc = formValues.countryCode as string | undefined;
      const ph = (formValues.phone as string) || "";
      if (ph && cc && !isValidPhoneLength(cc, ph)) {
        clientError = phoneLengthErrorMessage(cc);
      }
    } else if (field === "emergency_contact" && card === "personal2") {
      const cc = formValues.emergencyCountryCode as string | undefined;
      const ph = (formValues.emergency_contact as string) || "";
      if (ph && cc && !isValidPhoneLength(cc, ph)) {
        clientError = phoneLengthErrorMessage(cc);
      }
    }

    if (!clientError) {
      const schema = card === "personal1" ? personal1Schema : personal2Schema;

      const fieldSchema = (schema.shape as Record<string, ZodTypeAny | undefined>)[field];
      if (fieldSchema) {
        const rawValue = formValues[field];
        const valueForParse = field === "image" ? rawValue ?? null : rawValue ?? "";
        const result = fieldSchema.safeParse(valueForParse);
        clientError = result.error?.issues[0]?.message;
      }
    }

    return serverError ?? clientError;
  };
  const handleSave = async (card: string) => {
    try {
      let validationResult;

      if (card === "personal1") {
        validationResult = personal1Schema.safeParse(formValues);
      } else {
        validationResult = personal2Schema.safeParse(formValues);
      }

      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          fieldErrors[field] = issue.message;
        });
        setServerErrors(fieldErrors);
        toast.error(t("validationError"));
        return;
      }

      if (card === "personal1") {
        const cc = formValues.countryCode as string | undefined;
        const ph = formValues.phone as string | undefined;
        if (cc && ph && !isValidPhoneLength(cc, ph)) {
          setServerErrors({ phone: phoneLengthErrorMessage(cc) });
          toast.error(t("validationError"));
          return;
        }
      } else if (card === "personal2") {
        const cc = formValues.emergencyCountryCode as string | undefined;
        const ph = formValues.emergency_contact as string | undefined;
        if (cc && ph && !isValidPhoneLength(cc, ph)) {
          setServerErrors({ emergency_contact: phoneLengthErrorMessage(cc) });
          toast.error(t("validationError"));
          return;
        }
      }

      if (card === "personal1") {
        const payload: Partial<PatientProfile> = {
          full_name: formValues.full_name as string | undefined,
          email: formValues.email as string | undefined,
          phone: buildFullPhoneNumber(
            formValues.countryCode as string | undefined,
            formValues.phone as string | undefined
          ),
          birth_date: formValues.birth_date as string | undefined,
          customer_id: String(userId),
        };
        await update(payload);
      } else if (card === "personal2") {
        const emergencyPhone = buildFullPhoneNumber(
          formValues.emergencyCountryCode as string | undefined,
          formValues.emergency_contact as string | undefined
        );

        const patientPayload = {
          customer_id: String(userId),
          gender:
            formValues.gender === "male"
              ? "Male"
              : formValues.gender === "female"
              ? "Female"
              : undefined,
          emergency_phone: emergencyPhone,
          relationship: formValues.relationship as string | undefined,
          image: formValues.image as File | undefined,
        };

        const locationPayload = {
          customer_id: String(userId),
          country: formValues.country as string | undefined,
          city: formValues.city as string | undefined,
          formatted_address: formValues.formatted_address as string | undefined,
        };

        await update(patientPayload);
        await updateLocation(locationPayload);
      }

      await refetch();

      await signIn("credentials", {
        redirect: false,
        email: session?.user?.email || "",
        password: "", 
      });

      setEditingCard(null);
      setServerErrors({});
      toast.success(t("saveSuccess"));
    } catch (err) {
      console.error("handleSave error:", err);
      toast.error(t("saveError"));
    }
  };

  return (
    <div className="container max-w-5xl mx-auto">
      <div className="space-y-6">
        <PatientPersonal1Card
          patient={d}
          onSave={handleSave}
          isUpdating={isUpdating}
          errors={serverErrors}
          userId={userId!}
          editingCard={editingCard}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          formValues={formValues}
          setFormValues={setFormValues}
          getFieldError={getFieldError}
        />

        <PatientPersonal2Card
          patient={d}
          onSave={handleSave}
          isUpdating={isUpdating}
          errors={serverErrors}
          userId={userId!}
          editingCard={editingCard}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          formValues={formValues}
          setFormValues={setFormValues}
          getFieldError={getFieldError}
        />

        {/* <PatienttLocationCard /> */}
      </div>
    </div>
  );
}
