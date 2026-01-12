// components/CustomCheckbox.tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function CustomCheckbox({ id, checked, onChange, label }: CustomCheckboxProps) {
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-0 h-0"
      />
      <label
        htmlFor={id}
        className="flex items-center gap-3 cursor-pointer transition-all duration-200"
      >
        <div
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all duration-200",
            checked ? "border-[#32A88D] bg-[#32A88D]" : "border-gray-300 bg-white"
          )}
        >
          {checked && <Check className="w-4 h-4 text-white stroke-[3]" />}
        </div>

        <span className="text-base font-medium text-gray-700">{label}</span>
      </label>
      
    </div>
  );
}
