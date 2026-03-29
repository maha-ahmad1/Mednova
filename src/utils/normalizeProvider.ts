import type { ServiceProvider } from "@/features/service-provider/types/provider";

export type ProviderService = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: string;
};

export interface NormalizedProvider {
  id: number;
  name: string;
  image: string;
  type: string;
  bio: string;
  experienceYears: number | null;
  specialties: Array<{ id: number; name: string }>;
  services: ProviderService[];
  schedule: ServiceProvider["schedules"] extends Array<infer T> ? T | null : null;
  rating: number;
  reviewsCount: number;
  location: string;
}

const DEFAULT_SERVICES: ProviderService[] = [
  {
    id: 1,
    name: "استشارة نصية",
    description: "دردشة عبر المحادثة",
    price: 30,
    duration: "30 دقيقة",
  },
  {
    id: 2,
    name: "جلسة فيديو",
    description: "استشارة متكاملة عبر زووم",
    price: 50,
    duration: "60 دقيقة",
  },
];

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

export function normalizeProvider(data: ServiceProvider): NormalizedProvider {
  const isTherapist = data.type_account === "therapist";
  const details = isTherapist ? data.therapist_details : data.center_details;

  const servicesFromApi: ProviderService[] = [
    {
      id: 1,
      name: "استشارة نصية",
      description: "دردشة عبر المحادثة",
      price: toNumber((details as Record<string, unknown> | undefined)?.chat_consultation_price),
      duration: "30 دقيقة",
    },
    {
      id: 2,
      name: "جلسة فيديو",
      description: "استشارة متكاملة عبر زووم",
      price: toNumber((details as Record<string, unknown> | undefined)?.video_consultation_price),
      duration: "60 دقيقة",
    },
  ];

  const hasApiPrices = servicesFromApi.some((service) => service.price > 0);

  return {
    id: data.id,
    name: data.full_name,
    image: data.image || "/images/home/therapist.jpg",
    type: data.type_account || "therapist",
    bio: details?.bio || data.bio || "",
    experienceYears: isTherapist ? data.therapist_details?.experience_years ?? null : null,
    specialties:
      data.specialties ||
      data.medicalSpecialties?.map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
      })) ||
      [],
    services: hasApiPrices ? servicesFromApi : data.services || DEFAULT_SERVICES,
    schedule: data.schedules?.[0] || null,
    rating: toNumber(data.average_rating),
    reviewsCount: data.total_reviews || 0,
    location: data.location_details?.city || "غير محدد",
  };
}
