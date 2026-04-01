import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UsersSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function UsersSearchInput({
  value,
  onChange,
  placeholder = "بحث بالاسم أو البريد الإلكتروني",
  className,
}: UsersSearchInputProps) {
  return (
    <div className={className ?? "relative md:col-span-1 lg:col-span-2"}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full pl-10"
        dir="rtl"
      />
    </div>
  );
}
