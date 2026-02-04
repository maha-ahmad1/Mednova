"use client";

import { useState } from "react";
import { StepperHeader } from "@/features/profile/_create/ui/StepperHeader";
import { TherapistFormStep1 } from "./TherapistFormStep1";
import { TherapistFormStep2 } from "./TherapistFormStep2";
import { TherapistFormStep3 } from "./TherapistFormStep3";
import { TherapistFormStep4 } from "./TherapistFormStep4";
import { TherapistFormStep5 } from "./TherapistFormStep5";

export default function TherapistWrapper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [globalErrors, setGlobalErrors] = useState<Record<string, string>>({});

  type TherapistState = {
    full_name: string;
    email: string;
    phone: string;
    birth_date?: string;
    gender?: "male" | "female";
    formatted_address?: string;
    medical_specialties_id?: string;
    university_name?: string;
    graduation_year?: string;
    countries_certified?: string;
    experience_years?: string;
    license_number?: string;
    license_authority?: string;
    certificate_file?: File;
    license_file?: File;
    bio?: string;
    image?: File;
    country?: string;
    city?: string;
    day_of_week?: string[];
    start_time_morning?: string;
    end_time_morning?: string;
    is_have_evening_time?: 0 | 1;
    start_time_evening?: string;
    end_time_evening?: string;
    video_consultation_price?: string;
    chat_consultation_price?: string;
    currency?: string;
  };

  const [formData, setFormData] = useState<TherapistState>({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: undefined,
    formatted_address: "",
    medical_specialties_id: "",
    university_name: "",
    graduation_year: "",
    countries_certified: "",
    experience_years: "",
    license_number: "",
    license_authority: "",
    certificate_file: undefined,
    license_file: undefined,
    bio: "",
    image: undefined,
    country: "",
    city: "",
    day_of_week: [],
    start_time_morning: "",
    end_time_morning: "",
    is_have_evening_time: 0,
    start_time_evening: "",
    end_time_evening: "",
    video_consultation_price: "",
    chat_consultation_price: "",
    currency: "",
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData: Partial<TherapistState>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <StepperHeader
        currentStep={currentStep}
        steps={[
          { id: 1, title: "البيانات الشخصية" },
          { id: 2, title: "المؤهلات الطبية" },
          { id: 3, title: "التراخيص والمستندات" },
          { id: 4, title: "  الموقع الجغرافي والمواعيد" },
          { id: 5, title: "النبذة والتأكيد" },
        ]}
      />

      <div className="mt-10">
        {currentStep === 1 && (
          <TherapistFormStep1
            onNext={nextStep}
            formData={formData}
            updateFormData={updateFormData}
            globalErrors={globalErrors}
          />
        )}

        {currentStep === 2 && (
          <TherapistFormStep2
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            globalErrors={globalErrors}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 3 && (
          <TherapistFormStep3
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            globalErrors={globalErrors}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 4 && (
          <TherapistFormStep4
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            globalErrors={globalErrors}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 5 && (
          <TherapistFormStep5
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            globalErrors={globalErrors}
            setGlobalErrors={setGlobalErrors}
          />
        )}
      </div>
    </div>
  );
}
