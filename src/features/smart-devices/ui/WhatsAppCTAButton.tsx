"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buildDeviceWhatsAppLink } from "../utils/buildWhatsAppLink";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.17 8.17 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}

interface WhatsAppCTAButtonProps {
  productName: string;
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "default" | "lg";
  label?: string;
}

export function WhatsAppCTAButton({
  productName,
  className,
  iconOnly = false,
  size = "default",
  label,
}: WhatsAppCTAButtonProps) {
  const t = useTranslations("smartDevices");
  const message = t("whatsappMessageTemplate", { product: productName });
  const href = buildDeviceWhatsAppLink(message);
  const buttonLabel = label ?? t("contactWhatsapp");

  if (iconOnly) {
    return (
      <Button
        asChild
        variant="outline"
        size="icon"
        className={cn(
          "border-[#32A88D]/30 text-[#32A88D] hover:bg-[#32A88D]/10 hover:text-[#32A88D]",
          className,
        )}
        aria-label={t("contactWhatsapp")}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size={size}
      className={cn("bg-[#32A88D] hover:bg-[#2a8a7a] text-white", className)}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="h-5 w-5" />
        {buttonLabel}
      </a>
    </Button>
  );
}
