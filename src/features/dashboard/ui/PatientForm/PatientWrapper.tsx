"use client";

import { StepperHeader } from "@/features/dashboard/ui/StepperHeader";
import { PatientFormStep1 } from "./PatientFormStep1";
import { PatientFormStep2 } from "./PatientFormStep2";
import { useState } from "react";
// import { PatientSuccess } from "./PatientSuccess";

export default function PatientWrapper() {
  const [currentStep, setCurrentStep] = useState(1);

  type PatientFormState = {
    full_name: string
    email: string
    phone: string
    birth_date: string
    gender?: "male" | "female" | undefined
    address: string
    emergency_phone?: string
    relationship?: string
    image?: File | null
    countryCode?: string
  }

  const [formData, setFormData] = useState<PatientFormState>({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: undefined,
    address: "",
    emergency_phone: "",
    relationship: "",
    image: null,
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData: Partial<PatientFormState>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };
  // if (currentStep === 3) {
  //   return <PatientSuccess patientData={formData} />
  // }
  return (
    <div className="max-w-5xl mx-auto">
      <StepperHeader
        currentStep={currentStep}
        steps={[
          { id: 1, title: "البيانات الشخصية" },
          { id: 2, title: "المؤهلات الطبية" },
        ]}
      />

      <div className="mt-10">
        {currentStep === 1 && (
          <PatientFormStep1
            onNext={nextStep}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 2 && (
          <PatientFormStep2
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
      </div>
    </div>
  );
}
