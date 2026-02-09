"use client";

import { StepperHeader } from "@/features/profile/_create/ui/StepperHeader";
import { CenterFormStep2 } from "./CenterFormStep2";
import { CenterFormStep3 } from "./CenterFormStep3";
import { CenterFormStep4 } from "./CenterFormStep4";
import { CenterFormStep5 } from "./CenterFormStep5";
import { CenterFormStep1 } from "./CenterFormStep1";
import { useCenterDraftStore } from "@/features/profile/_create/hooks/useCenterDraftStore";

export default function CenterWrapper() {
  const currentStep = useCenterDraftStore((state) => state.currentStep);
  const globalErrors = useCenterDraftStore((state) => state.globalErrors);
  const formData = useCenterDraftStore((state) => state.formData);
  const setCurrentStep = useCenterDraftStore((state) => state.setCurrentStep);
  const setGlobalErrors = useCenterDraftStore((state) => state.setGlobalErrors);
  const updateFormData = useCenterDraftStore((state) => state.updateFormData);

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 5));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  return (
    <div className="max-w-5xl mx-auto">
      <StepperHeader
        currentStep={currentStep}
        steps={[
          { id: 1, title: "البيانات الأساسية" },
          { id: 2, title: "التخصصات والتأسيس" },
          { id: 3, title: "التراخيص والمستندات" },
          { id: 4, title: "الموقع والمواعيد" },
          { id: 5, title: "النبذة والتأكيد" },
        ]}
      />

      <div className="mt-10">
        {currentStep === 1 && (
          <CenterFormStep1
            onNext={nextStep}
            formData={formData}
            updateFormData={updateFormData}
            globalErrors={globalErrors}
          />
        )}

        {currentStep === 2 && (
          <CenterFormStep2
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 3 && (
          <CenterFormStep3
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 4 && (
          <CenterFormStep4
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            setGlobalErrors={setGlobalErrors}
          />
        )}

        {currentStep === 5 && (
          <CenterFormStep5
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
