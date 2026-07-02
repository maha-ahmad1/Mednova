"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import type { DeviceProduct } from "../types/device.types";
import { WhatsAppCTAButton } from "./WhatsAppCTAButton";

interface DeviceDetailSheetProps {
  device: DeviceProduct;
  trigger: React.ReactNode;
}

export function DeviceDetailSheet({ device, trigger }: DeviceDetailSheetProps) {
  const t = useTranslations("smartDevices");
  const name = t(`products.${device.id}.name`);
  const tagline = t(`products.${device.id}.tagline`);
  const features = t.raw(`products.${device.id}.features`) as string[];
  const configuration = t.raw(`products.${device.id}.configuration`) as string[];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md gap-0">
        <SheetHeader>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <Image
              src={device.image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-contain p-6"
            />
          </div>
          <SheetTitle className="mt-4 text-xl text-gray-900">{name}</SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            {tagline}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4">
          {device.hostSize && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500">
                {t("hostSizeLabel")}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {device.hostSize}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              {t("featuresLabel")}
            </h3>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#32A88D]" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              {t("configurationLabel")}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {configuration.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[#32A88D]/20 bg-[#32A88D]/5 px-3 py-1 text-xs text-[#1F6069]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <SheetFooter>
          <WhatsAppCTAButton productName={name} size="lg" className="w-full" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
