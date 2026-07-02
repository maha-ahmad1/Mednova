"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DeviceProduct } from "../types/device.types";
import { DeviceDetailSheet } from "./DeviceDetailSheet";
import { WhatsAppCTAButton } from "./WhatsAppCTAButton";

interface DeviceCardProps {
  device: DeviceProduct;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const t = useTranslations("smartDevices");
  const name = t(`products.${device.id}.name`);
  const tagline = t(`products.${device.id}.tagline`);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Image
          src={device.image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />
        {device.isBestSeller && (
          <Badge className="absolute top-3 start-3 bg-[#32A88D] text-white">
            {t("bestSeller")}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400">{device.pid}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
            {name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{tagline}</p>
        </div>

        <div className="flex items-center gap-2">
          <DeviceDetailSheet
            device={device}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-[#32A88D]/30 text-[#1F6069] hover:bg-[#32A88D]/10"
              >
                {t("viewDetails")}
              </Button>
            }
          />
          <WhatsAppCTAButton productName={name} iconOnly />
        </div>
      </div>
    </div>
  );
}
