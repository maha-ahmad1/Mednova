
// import { PatientForm } from "@/features/dashboard/ui/PatientForm";
// import { StepperHeader } from "@/features/dashboard/ui//StepperHeader";
// import { PatientFormStep1 } from "@/features/dashboard/ui/PatientForm";
// import { PatientFormStep2 } from "@/features/dashboard/ui/PatientForm";
import PatientWrapper from "@/features/dashboard/ui/PatientForm/PatientWrapper";
//import { useState } from "react";

export default function PatientPage() {
  //  const [currentStep, setCurrentStep] = useState(1);
  
  //   const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  //   const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  return (
    <div className="max-w-5xl mx-auto">
      {/* <StepperHeader
        currentStep={currentStep}
        steps={[
          { id: 1, title: "البيانات الشخصية" },
          { id: 2, title: "المؤهلات الطبية" },
          { id: 3, title: "التراخيص والمستندات" },
          { id: 4, title: "النبذة والتأكيد" },
        ]}
      />

      <div className="mt-10">
        {currentStep === 1 && <PatientFormStep1 onNext={nextStep} />}
        {currentStep === 2 && (
          <PatientFormStep2 onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 3 && (
          <TherapistFormStep3 onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 4 && <TherapistFormStep4 onBack={prevStep} />}
      </div> */}
      <PatientWrapper />
    </div>
  );
}
