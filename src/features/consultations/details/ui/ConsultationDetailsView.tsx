"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { useConsultationDetails } from "@/features/consultations/details/hooks/useConsultationDetails";
import FinancialStatusBanner from "@/features/consultations/details/ui/FinancialStatusBanner";
import ConsultationHeader from "@/features/consultations/details/ui/sections/ConsultationHeader";
import AppointmentInfoCard from "@/features/consultations/details/ui/sections/AppointmentInfoCard";
import CostSummaryCard from "@/features/consultations/details/ui/sections/CostSummaryCard";
import ConsultationActionsBar from "@/features/consultations/details/ui/sections/ConsultationActionsBar";
import DisputeDialog from "@/features/consultations/details/ui/dialogs/DisputeDialog";
import { useBankAccount } from "@/features/financial/withdraw/hooks/useBankAccount";
import { useConsultantWallet } from "@/features/financial/hooks/useConsultantWallet";
import { WithdrawRequestDialog } from "@/features/financial/withdraw/ui/WithdrawRequestDialog";

interface ConsultationDetailsViewProps {
  id: string;
  type: "video" | "chat";
}

export default function ConsultationDetailsView({
  id,
  type,
}: ConsultationDetailsViewProps) {
  const t = useTranslations("consultations.details");
  const { push } = useNavigationLoader();
  const { data: session } = useSession();
  const isPatientRole = session?.role === "patient";
  const { data: details, isLoading, error } = useConsultationDetails(id, type);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const { data: bankAccount } = useBankAccount();
  const { data: wallet } = useConsultantWallet();

  const handleWithdraw = () => {
    if (!bankAccount || !bankAccount.is_verified) {
      push("/profile/financial/bank-account");
      return;
    }
    setWithdrawDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <Card className="w-full max-w-sm border-0 shadow-xl">
          <CardContent className="space-y-4 p-6 text-center">
            <X className="mx-auto h-10 w-10 text-rose-500" />
            <p className="font-semibold">{t("loadError")}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <Card className="w-full max-w-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="font-semibold">{t("notFound")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const financialStatus = details.data.financial_status;

  return (
    <>
      <BreadcrumbNav currentPage={t("header.breadcrumb")} />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Card className="border-0 shadow-xl">
          <CardContent className="space-y-6 p-6">
            <ConsultationHeader details={details} financial={details.financial} />
            <AppointmentInfoCard details={details} />
          </CardContent>
        </Card>

        <FinancialStatusBanner
          status={financialStatus}
          financial={details.financial}
          reviewDeadline={details.data.review_deadline}
          releasedAt={details.data.released_at}
          onOpenDispute={() => setDisputeOpen(true)}
          onWithdraw={handleWithdraw}
          viewerIsPatient={isPatientRole}
        />

        <CostSummaryCard financial={details.financial} />

        <ConsultationActionsBar
          consultationId={details.id}
          consultationType={details.type}
          financialStatus={financialStatus}
          status={details.data.status}
          financial={details.financial}
          videoRoomLink={details.data.video_room_link}
        />
      </div>

      <DisputeDialog
        open={disputeOpen}
        onOpenChange={setDisputeOpen}
        consultationType={details.type}
        queryId={id}
      />

      {wallet && bankAccount && (
        <WithdrawRequestDialog
          open={withdrawDialogOpen}
          onOpenChange={setWithdrawDialogOpen}
          wallet={wallet}
          bankAccount={bankAccount}
        />
      )}
    </>
  );
}
