import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import MeasurementHistoryTable from "@/features/measurements/ui/MeasurementHistoryTable";

interface PageProps {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ patientName?: string }>;
}

export default async function PatientMeasurementHistoryPage({
  params,
  searchParams,
}: PageProps) {
  const { patientId: patientIdParam } = await params;
  const { patientName } = await searchParams;
  const patientId = Number(patientIdParam);

  if (!Number.isInteger(patientId) || patientId <= 0) {
    notFound();
  }

  const t = await getTranslations("measurements.history");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          {t("pageTitle")}
        </h1>
        {patientName && (
          <p className="text-sm text-muted-foreground mt-1">
            {t("pageSubtitle", { name: patientName })}
          </p>
        )}
      </div>

      <MeasurementHistoryTable patientId={patientId} />
    </div>
  );
}
