import type { ServiceProvider } from "@/features/service-provider/types/provider";

export type ProviderService = {
  id: number;
  name: string;
  description: string;
  price: number;
  // duration: string;
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

export type NormalizeProviderMessages = {
  notSpecified: string;
  citySeparator: string;
  chatServiceName: string;
  chatServiceDesc: string;
  videoServiceName: string;
  videoServiceDesc: string;
  university: string;
  graduationYear: string;
  experienceYearsLabel: string;
  yearsUnit: (years: number | string) => string;
  yearEstablishment: string;
  location: string;
  licenseAuthority: string;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toDisplayValue = (value: unknown, notSpecified: string): string | number => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim().length > 0) return value;
  return notSpecified;
};

export function normalizeProvider(
  data: ServiceProvider,
  messages: NormalizeProviderMessages,
): NormalizedProvider {
  const isTherapist = data.type_account === "therapist";
  const detailsSource = isTherapist ? data.therapist_details : data.center_details;

  const defaultServices: ProviderService[] = [
    {
      id: 1,
      name: messages.chatServiceName,
      description: messages.chatServiceDesc,
      price: 30,
    },
    {
      id: 2,
      name: messages.videoServiceName,
      description: messages.videoServiceDesc,
      price: 50,
    },
  ];

  const servicesFromApi: ProviderService[] = [
    {
      id: 1,
      name: messages.chatServiceName,
      description: messages.chatServiceDesc,
      price: toNumber((detailsSource as Record<string, unknown> | undefined)?.chat_consultation_price),
    },
    {
      id: 2,
      name: messages.videoServiceName,
      description: messages.videoServiceDesc,
      price: toNumber((detailsSource as Record<string, unknown> | undefined)?.video_consultation_price),
    },
  ];

  const hasApiPrices = servicesFromApi.some((service) => service.price > 0);

  const city = data.location_details?.city || messages.notSpecified;
  const country = data.location_details?.country || messages.notSpecified;

  const infoItems: ProviderInfoItem[] = isTherapist
    ? [
        {
          label: messages.university,
          value: toDisplayValue(data.therapist_details?.university_name, messages.notSpecified),
        },
        {
          label: messages.graduationYear,
          value: toDisplayValue(data.therapist_details?.graduation_year, messages.notSpecified),
        },
        {
          label: messages.experienceYearsLabel,
          value: messages.yearsUnit(data.therapist_details?.experience_years ?? 0),
        },
      ]
    : [
        {
          label: messages.yearEstablishment,
          value: toDisplayValue(data.center_details?.year_establishment, messages.notSpecified),
        },
        {
          label: messages.location,
          value: `${city}${messages.citySeparator}${country}`,
        },
        {
          label: messages.licenseAuthority,
          value: toDisplayValue(data.center_details?.license_authority, messages.notSpecified),
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
      data.specialties?.length
        ? data.specialties
        : data.therapist_details?.medical_specialties
        ? [{
            id: data.therapist_details.medical_specialties.id,
            name: data.therapist_details.medical_specialties.name,
          }]
        : data.medicalSpecialties?.map((specialty) => ({
            id: specialty.id,
            name: specialty.name,
          })) || [],
    services: hasApiPrices ? servicesFromApi : data.services || defaultServices,
    schedule: data.schedules?.[0] || null,
    rating: toNumber(data.average_rating),
    reviewsCount: data.total_reviews || 0,
    location: {
      city,
      country,
      label: `${city}${messages.citySeparator}${country}`,
    },
    details: infoItems,
  };
}
