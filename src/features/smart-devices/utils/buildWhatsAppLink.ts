import { WHATSAPP_NUMBER } from "@/shared/ui/components/FloatingContactWidget";

export function buildDeviceWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
