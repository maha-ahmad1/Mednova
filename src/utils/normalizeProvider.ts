import type { ServiceProvider } from "@/features/service-provider/types/provider";

export type ProviderService = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
};

export type NormalizedProvider = {
  id: number;
  name: string;
  image: string;
  type: string;
  bio: string;
  experienceYears: number;
  specialties: Array<{ id: number; name: string }>;
  services: ProviderService[];
  schedule?: NonNullable<ServiceProvider["schedules"]>[number];
  rating: number;
  reviewsCount: number;
  location: {
    city: string;
    country: string;
    formattedAddress: string;
  };
  details: {
    universityName: string;
    graduationYear: string;
    countriesCertified: string;
  };
};

const DEFAULT_SERVICES: ProviderService[] = [
  {
    id: 1,
    name: "استشارة نصية",
    description: "دردشة عبر المحادثة",
    price: 30,
    duration: "",
  },
  {
    id: 2,
    name: "جلسة فيديو",
    description: "استشارة متكاملة عبر زووم",
    price: 50,
    duration: "60 دقيقة",
  },
];

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export function normalizeProvider(rawProvider: ServiceProvider): NormalizedProvider {
  const type = rawProvider.type_account || "therapist";
  const isCenter = type === "rehabilitation_center";
  const therapistDetails = rawProvider.therapist_details;
  const centerDetails = rawProvider.center_details;

  const mappedCenterServices: ProviderService[] = [
    {
      id: 1,
      name: "استشارة نصية",
      description: "دردشة عبر المحادثة",
      price: toNumber(rawProvider.chat_price),
      duration: "",
    },
    {
      id: 2,
      name: "جلسة فيديو",
      description: "استشارة متكاملة عبر الفيديو",
      price: toNumber(rawProvider.video_price),
      duration: "60 دقيقة",
    },
  ].filter((service) => service.price > 0);

  return {
    id: rawProvider.id,
    name: rawProvider.full_name,
    image: rawProvider.image,
    type,
    bio: (isCenter ? centerDetails?.bio : therapistDetails?.bio) || rawProvider.bio || "",
    experienceYears: isCenter ? 0 : therapistDetails?.experience_years || rawProvider.experience_years || 0,
    specialties:
      rawProvider.specialties && rawProvider.specialties.length > 0
        ? rawProvider.specialties
        : (rawProvider.medicalSpecialties || []).map((specialty) => ({
            id: specialty.id,
            name: specialty.name,
          })),
    services: isCenter
      ? mappedCenterServices.length > 0
        ? mappedCenterServices
        : DEFAULT_SERVICES
      : rawProvider.services && rawProvider.services.length > 0
      ? rawProvider.services
      : DEFAULT_SERVICES,
    schedule: rawProvider.schedules?.[0],
    rating: toNumber(rawProvider.average_rating),
    reviewsCount: toNumber(rawProvider.total_reviews),
    location: {
      city: rawProvider.location_details?.city || "",
      country: rawProvider.location_details?.country || "",
      formattedAddress: rawProvider.location_details?.formatted_address || "",
    },
    details: {
      universityName: therapistDetails?.university_name || "",
      graduationYear: therapistDetails?.graduation_year || "",
      countriesCertified: therapistDetails?.countries_certified || "",
    },
  };
}
