"use client";

import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
}

interface StepperHeaderProps {
  currentStep: number;
  steps: Step[];
}

export function StepperHeader({ currentStep, steps }: StepperHeaderProps) {
  return (
    <div
      dir="rtl"
      className="relative flex justify-between items-center max-w-5xl mx-auto mt-10"
    >
      {steps.slice(0, -1).map((step) => {
        const isActive = currentStep > step.id;
        return (
          <div
            key={`line-${step.id}`}
            className={cn(
              "absolute h-[2px] z-0 transition-all duration-500 ease-in-out",
              isActive ? "bg-[#32A88D]" : "bg-gray-300"
            )}
            style={{
              right: `calc(${((step.id - 0.5) / steps.length) * 100}% + 1.5rem)`,
              width: `calc(${100 / steps.length}% - 3rem)`,
              top: "1.5rem",
            }}
          />
        );
      })}

      {steps.map((step) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center flex-1 z-10">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                isCompleted
                  ? "bg-[#32A88D] border-[#32A88D] text-white"
                  : isCurrent
                  ? "bg-[#32A88D]/10 border-[#32A88D] text-[#32A88D]"
                  : "border-gray-400 text-gray-500"
              )}
            >
              {step.id}
            </div>
            <p
              className={cn(
                "text-sm mt-2 text-center transition-colors duration-300",
                step.id <= currentStep
                  ? "text-[#32A88D] font-semibold"
                  : "text-gray-500"
              )}
            >
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
