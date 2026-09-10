"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ConsultationRequest } from "@/types/consultation";
import RejectDialog from "./RejectDialog";
import { useConsultationRequestActions } from "../../hooks/useConsultationRequestActions";
import { useConsultationStore } from "@/store/consultationStore";
import MeasurementRequestDialog from "@/features/measurements/ui/MeasurementRequestDialog";

// Zoom becomes joinable this many minutes before the scheduled appointment time.
const ZOOM_JOINABLE_LEAD_MS = 5 * 60 * 1000;

interface ConsultationActionsProps {
  request: ConsultationRequest;
  onRequestUpdate: (request: ConsultationRequest) => void;
  userRole?: "consultable" | "patient" | undefined;
}

export default function ConsultationActions({
  request,
  onRequestUpdate,
  userRole,
}: ConsultationActionsProps) {
  const t = useTranslations("consultations.actions");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  // console.log("request rejected", request);

  const { requests } = useConsultationStore();
  const latestRequest = requests.find((r) => r.id === request.id) || request;

  const getVideoRoomLink = (r: ConsultationRequest) => {
    // prefer top-level video_room_link (matches types), fallback to legacy location in data
    return (
      r.video_room_link ??
      ((r.data as unknown as Record<string, unknown>)?.video_room_link as
        | string
        | undefined)
    );
  };

  // Reuses the same "requested_time" appointment field parsed the same way as
  // AppointmentInfoCard/ConsultationDetails (space-separated datetime -> ISO).
  const requestedTime = latestRequest.data.appointment?.requested_time;
  const appointmentTimestamp = useMemo(() => {
    if (!requestedTime) return null;
    const parsed = new Date(requestedTime.replace(" ", "T")).getTime();
    return Number.isNaN(parsed) ? null : parsed;
  }, [requestedTime]);

  // Fails open (joinable) when there's no appointment time to check against,
  // matching the previous behavior of not time-gating the button at all.
  const computeIsZoomTimeReached = (timestamp: number | null) =>
    timestamp === null ? true : Date.now() >= timestamp - ZOOM_JOINABLE_LEAD_MS;

  const [isZoomTimeReached, setIsZoomTimeReached] = useState(() =>
    computeIsZoomTimeReached(appointmentTimestamp)
  );

  // `ConsultationActions` isn't remounted when the user switches between
  // consultations in the list — only `request` (and so `appointmentTimestamp`)
  // changes. Without this, `isZoomTimeReached` from the previously-viewed
  // consultation would carry over. Comparing against the last-seen timestamp
  // during render (React's documented pattern for resetting state on a prop
  // change without a full remount) resets it synchronously, before paint, so
  // there's no stale-state flash when switching back to an earlier consultation.
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState(appointmentTimestamp);
  if (lastSeenTimestamp !== appointmentTimestamp) {
    setLastSeenTimestamp(appointmentTimestamp);
    setIsZoomTimeReached(computeIsZoomTimeReached(appointmentTimestamp));
  }

  useEffect(() => {
    if (appointmentTimestamp === null || isZoomTimeReached) return;

    const msUntilJoinable =
      appointmentTimestamp - ZOOM_JOINABLE_LEAD_MS - Date.now();
    if (msUntilJoinable <= 0) {
      setIsZoomTimeReached(true);
      return;
    }

    // Single scheduled timeout for the exact moment the window opens —
    // no per-second ticking/re-rendering. Re-running this effect (because
    // appointmentTimestamp changed) clears this timer via the cleanup below
    // before scheduling a new one for the newly-selected consultation.
    const timerId = setTimeout(() => setIsZoomTimeReached(true), msUntilJoinable);
    return () => clearTimeout(timerId);
  }, [appointmentTimestamp, isZoomTimeReached]);

  const isZoomVisible =
    request.type === "video" &&
    (latestRequest.status === "active" || latestRequest.status === "accepted");
  const isZoomJoinable = latestRequest.status === "active" || isZoomTimeReached;

  const { acceptRequest, startConsultation, rejectRequest, isProcessing } =
    useConsultationRequestActions(userRole);

  const handleAccept = async () => {
    try {
      await acceptRequest(request);
      onRequestUpdate({ ...request, status: "accepted" });
    } catch {
      toast.error(t("acceptFailedToast"));
    }
  };

  const handleStartConsultation = async () => {
    try {
      await startConsultation(request);
      onRequestUpdate({ ...request, status: "completed" });
    } catch {
      toast.error(t("completeFailedToast"));
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      await rejectRequest(request, reason);
      onRequestUpdate({ ...request, status: "cancelled" });
      setRejectDialogOpen(false);
    } catch {
      toast.error(t("rejectFailedToast"));
    }
  };

  if (userRole === "patient") {
    return (
      <>
        {request.status == "pending" && (!request.data.financial_status || request.data.financial_status === "unpaid") && (
          <Button
            onClick={() => setRejectDialogOpen(true)}
            disabled={isProcessing}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                {t("cancelling")}
              </>
            ) : (
              t("cancelConsultation")
            )}
          </Button>
        )}

        <RejectDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          onConfirm={handleRejectConfirm}
          isLoading={isProcessing}
        />

        {request.status === "cancelled" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg sm:rounded-xl">
            {/* <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" /> */}
            <p className="font-semibold text-red-800 text-sm sm:text-lg">
              {t("cancelledTitle")}
            </p>
            <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
              {t("cancelledDesc")}
            </p>
          </div>
        )}

        {request.status === "completed" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl">
            <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
            <p className="font-semibold text-green-800 text-sm sm:text-lg">
              {t("completedTitle")}
            </p>
            {/* <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
              شكراً لك على تقديم خدمة مميزة للمريض
            </p> */}
          </div>
        )}

        {isZoomVisible && (
          <div className="w-full mb-3">
            {/* <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-blue-800 text-sm sm:text-base">
                  في انتظار موعد الاستشارة
                </p>
                <p className="text-xs sm:text-sm text-blue-600">
                  سيتم بدء الاستشارة في الموعد المحدد
                </p>
              </div>
            </div> */}

            {/* <Button
              onClick={handleStartConsultation}
              disabled={isProcessing}
              className=" cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  جاري البدء...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                  بدء الاستشارة مبكراً
                </>
              )}
            </Button> */}

             <Button
              onClick={() =>
                window.open(String(getVideoRoomLink(latestRequest)), "_blank")
              }
              disabled={!isZoomJoinable}
              className=" cursor-pointer  w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">{t("joinZoomSession")}</span>
            </Button>
            {!isZoomJoinable && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t("zoomAvailableSoonNote")}
              </p>
            )}
          </div>
        )}

      </>
    );
  }
  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
        {request.status === "pending" && (
          <>
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  {t("accepting")}
                </>
              ) : (
                <>
                  {/* <Check className="w-4 h-4 sm:w-5 sm:h-5" /> */}
                  {t("acceptButton")}
                </>
              )}
            </Button>

            <Button
              onClick={() => setRejectDialogOpen(true)}
              disabled={isProcessing}
              variant="outline"
              className="cursor-pointer border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              {t("cancelConsultation")}
            </Button>
          </>
        )}

        {/* {request.status === "accepted" && (
          <Button
            onClick={handleStartConsultation}
            disabled={isProcessing}
            className=" cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                جاري البدء...
              </>
            ) : (
              <>
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                بدء المحادثة الآن
              </>
            )}
          </Button>
        )} */}

        {isZoomVisible && (
          <div className="w-full mb-3">
             <Button
              onClick={() =>
                window.open(String(getVideoRoomLink(latestRequest)), "_blank")
              }
              disabled={!isZoomJoinable}
              className="cursor-pointer w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">{t("joinZoomSession")}</span>
            </Button>
            {!isZoomJoinable && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t("zoomAvailableSoonNote")}
              </p>
            )}
          </div>
        )}

        {request.status === "active" && (
          <MeasurementRequestDialog request={request} />
        )}

        {request.status === "completed" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl">
            <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
            <p className="font-semibold text-green-800 text-sm sm:text-lg">
              {t("completedTitle")}
            </p>
            <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
              {t("thanksNote")}
            </p>
          </div>
        )}

        {request.status === "cancelled" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg sm:rounded-xl">
            {/* <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" /> */}
            <p className="font-semibold text-red-800 text-sm sm:text-lg">
              {t("rejectedTitle")}
            </p>
            <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
              {t("rejectedDesc")}
            </p>
          </div>
        )}
      </div>

      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        isLoading={isProcessing}
      />
    </>
  );
}
