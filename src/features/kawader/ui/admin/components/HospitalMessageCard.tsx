"use client";

import { Copy, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { KawaderHospitalMessage } from "../../../types/kawader";

interface HospitalMessageCardProps {
  message: KawaderHospitalMessage;
}

export function HospitalMessageCard({ message }: HospitalMessageCardProps) {
  const t = useTranslations("kawader.admin.hospitalMessage");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast.success(t("copied"));
    } catch {
      // No clipboard permission or an insecure context.
      toast.error(t("copyFailed"));
    }
  };

  const handleOpenWhatsApp = () => {
    if (message.whatsapp_url) window.open(message.whatsapp_url, "_blank", "noopener");
  };

  return (
    <section className="space-y-3 rounded-xl border bg-white p-4">
      <h2 className="text-base font-semibold text-foreground">{t("title")}</h2>

      {/* The message is built in English, so it stays left-to-right even on the Arabic page. */}
      <pre
        tabIndex={0}
        aria-label={t("title")}
        className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/40 p-3 text-start font-sans text-xs leading-5 text-foreground [direction:ltr]"
      >
        {message.text}
      </pre>

      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
        <Button type="button" variant="outline" className="flex-1" onClick={() => void handleCopy()}>
          <Copy className="h-4 w-4" aria-hidden />
          {t("copy")}
        </Button>
        {message.whatsapp_url ? (
          <Button type="button" className="flex-1" onClick={handleOpenWhatsApp}>
            <MessageCircle className="h-4 w-4" aria-hidden />
            {t("whatsapp")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
