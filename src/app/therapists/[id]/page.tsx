import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SpecialistProfile } from "@/features/service-provider/public-profile/ui";

interface SpecialistProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getProviderType(id: string): Promise<string | null> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) return null;

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  try {
    const response = await fetch(`${protocol}://${host}/api/customer/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { type_account?: string };
    return data.type_account ?? null;
  } catch {
    return null;
  }
}

export default async function SpecialistProfilePage({ params }: SpecialistProfilePageProps) {
  const { id } = await params;
  const providerType = await getProviderType(id);

  if (providerType === "rehabilitation_center") {
    redirect(`/centers/${id}`);
  }

  return <SpecialistProfile />;
}
