"use client"

import { useState } from "react"
import { StepperHeader } from "@/features/dashboard/ui/StepperHeader"
import { CenterFormStep2 } from "./CenterFormStep2"
import { CenterFormStep3 } from "./CenterFormStep3"
import { CenterFormStep4 } from "./CenterFormStep4"
import { CenterFormStep5 } from "./CenterFormStep5"
import { CenterFormStep1 } from "./CenterFormStep1"


export default function CenterWrapper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [globalErrors, setGlobalErrors] = useState<Record<string, string>>({})

  type CenterState = {
    gender?: "male" | "female"
    birth_date?: string
    image?: File
    specialty_id?: string[]
    year_establishment?: string
    has_commercial_registration?: 0 | 1
    commercial_registration_number?: string
    commercial_registration_file?: File | null
    commercial_registration_authority?: string
    license_authority?: string
    license_file?: File | null
    license_number?: string
    bio?: string
    day_of_week?: string[]
    is_have_evening_time?: 0 | 1
    start_time_morning?: string
    end_time_morning?: string
    start_time_evening?: string
    end_time_evening?: string
    city?: string
    country?: string
    formatted_address?: string
  }

  const [formData, setFormData] = useState<CenterState>({
    gender: undefined,
    birth_date: "",
    image: undefined,
    specialty_id: [],
    year_establishment: "",
    has_commercial_registration: 0,
    commercial_registration_number: "",
    commercial_registration_file: null,
    commercial_registration_authority: "",
    license_authority: "",
    license_file: null,
    license_number: "",
    bio: "",
    day_of_week: [],
    is_have_evening_time: 0,
    start_time_morning: "",
    end_time_morning: "",
    start_time_evening: "",
    end_time_evening: "",
    city: "",
    country: "",
    formatted_address: "",
  })

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const updateFormData = (newData: Partial<CenterState>) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

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
  )
}
