"use client";

import { StepperHeader } from "@/features/profile/_create/ui/StepperHeader";
import { TherapistFormStep1 } from "./TherapistFormStep1";
import { TherapistFormStep2 } from "./TherapistFormStep2";
import { TherapistFormStep3 } from "./TherapistFormStep3";
import { TherapistFormStep4 } from "./TherapistFormStep4";
import { TherapistFormStep5 } from "./TherapistFormStep5";
import { useTherapistDraftStore } from "@/features/profile/_create/hooks/useTherapistDraftStore";

export default function TherapistWrapper() {
  const currentStep = useTherapistDraftStore((state) => state.currentStep);
  const globalErrors = useTherapistDraftStore((state) => state.globalErrors);
  const formData = useTherapistDraftStore((state) => state.formData);
  const setCurrentStep = useTherapistDraftStore((state) => state.setCurrentStep);
  const setGlobalErrors = useTherapistDraftStore((state) => state.setGlobalErrors);
  const updateFormData = useTherapistDraftStore((state) => state.updateFormData);

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 5));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

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
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 3 && (
          <TherapistFormStep3
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 4 && (
          <TherapistFormStep4
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 5 && (
          <TherapistFormStep5
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            setGlobalErrors={setGlobalErrors}
          />
        )}
      </div>
    </div>
  );
}
