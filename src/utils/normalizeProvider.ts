import type { ServiceProvider } from "@/features/service-provider/types/provider";

export type ProviderService = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
};

type ProviderSchedule = NonNullable<ServiceProvider["schedules"]>[number];

export type ProviderInfoItem = {
  label: string;
  value: string | number;
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
  schedule: ProviderSchedule | null;
  rating: number;
  reviewsCount: number;
  location: {
    city: string;
    country: string;
    label: string;
  };
  details: ProviderInfoItem[];
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

const toDisplayValue = (value: unknown): string | number => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim().length > 0) return value;
  return "غير محدد";
};

export function normalizeProvider(data: ServiceProvider): NormalizedProvider {
  const isTherapist = data.type_account === "therapist";
  const detailsSource = isTherapist ? data.therapist_details : data.center_details;

  const servicesFromApi: ProviderService[] = [
    {
      id: 1,
      name: "استشارة نصية",
      description: "دردشة عبر المحادثة",
      price: toNumber((detailsSource as Record<string, unknown> | undefined)?.chat_consultation_price),
      duration: "30 دقيقة",
    },
    {
      id: 2,
      name: "جلسة فيديو",
      description: "استشارة متكاملة عبر زووم",
      price: toNumber((detailsSource as Record<string, unknown> | undefined)?.video_consultation_price),
      duration: "60 دقيقة",
    },
  ];

  const hasApiPrices = servicesFromApi.some((service) => service.price > 0);

  const city = data.location_details?.city || "غير محدد";
  const country = data.location_details?.country || "غير محدد";

  const infoItems: ProviderInfoItem[] = isTherapist
    ? [
        {
          label: "الجامعة",
          value: toDisplayValue(data.therapist_details?.university_name),
        },
        {
          label: "سنة التخرج",
          value: toDisplayValue(data.therapist_details?.graduation_year),
        },
        {
          label: "سنوات الخبرة",
          value: `${data.therapist_details?.experience_years ?? 0} سنوات`,
        },
      ]
    : [
        {
          label: "سنة التأسيس",
          value: toDisplayValue(data.center_details?.year_establishment),
        },
        {
          label: "الموقع",
          value: `${city}، ${country}`,
        },
        {
          label: "جهة الترخيص",
          value: toDisplayValue(data.center_details?.license_authority),
        },
      ];

  return {
    id: data.id,
    name: data.full_name,
    image: data.image || "/images/home/therapist.jpg",
    type: data.type_account || "therapist",
    bio: detailsSource?.bio || data.bio || "",
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
    location: {
      city,
      country,
      label: `${city}، ${country}`,
    },
    details: infoItems,
  };
}
