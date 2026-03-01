"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProgramManagementCardProps {
  title: string;
  description: string;
  coverImage?: string | null;
  price?: number | null;
  currency?: string | null;
  status: "draft" | "published" | "archived";
  isApproved: 0 | 1;
}

const statusLabel: Record<ProgramManagementCardProps["status"], string> = {
  draft: "مسودة",
  published: "منشور",
  archived: "مؤرشف",
};

export function ProgramManagementCard({
  title,
  description,
  coverImage,
  price,
  currency,
  status,
  isApproved,
}: ProgramManagementCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44 w-full bg-slate-100">
        <Image
          src={coverImage || "/images/home/Sports-rehabilitation.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{title}</h3>
          <Badge variant="secondary">{statusLabel[status]}</Badge>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{description}</p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="text-sm font-medium text-emerald-700">
            {price ?? 0} {currency ?? "OMR"}
          </p>
          <Badge variant={isApproved === 1 ? "default" : "outline"}>
            {isApproved === 1 ? "معتمد" : "بانتظار الاعتماد"}
          </Badge>
        </div>
      </div>
    </article>
  );
}
