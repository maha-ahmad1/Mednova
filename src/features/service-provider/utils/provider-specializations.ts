import type { ServiceProvider } from "@/features/service-provider/types/provider";

const getUniqueNames = (names: Array<string | undefined | null>): string[] =>
  Array.from(
    new Set(
      names
        .map((name) => name?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  );

export const getProviderSpecializationNames = (
  provider?: ServiceProvider | null,
): string[] => {
  if (!provider) return [];

  if (provider.type_account === "therapist") {
    return getUniqueNames([
      provider.therapist_details?.medical_specialties?.name,
      ...(provider.specialties?.map((specialty) => specialty.name) ?? []),
      ...(provider.medicalSpecialties?.map((specialty) => specialty.name) ?? []),
    ]);
  }

  return getUniqueNames([
    ...(provider.center_details?.services?.map((service) => service.name) ?? []),
    ...(provider.specialties?.map((specialty) => specialty.name) ?? []),
    ...(provider.medicalSpecialties?.map((specialty) => specialty.name) ?? []),
  ]);
};

export const getProviderSpecializationLabel = (
  provider?: ServiceProvider | null,
  fallback = "غير محدد",
): string => {
  const names = getProviderSpecializationNames(provider);
  return names.length > 0 ? names.join("، ") : fallback;
};
