"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { Loader2, Check, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProgramDetail } from "@/features/programs/types/program";
import { useProgramPurchase } from "@/features/programs/hooks/useProgramPurchase";
import { useProgramPaymentLink } from "@/features/programs/hooks/useProgramPaymentLink";
import { useProgramPurchaseStatus } from "@/features/programs/hooks/useProgramPurchaseStatus";
import { isAllowedCheckoutUrl } from "@/features/programs/utils/checkoutUrl";
import { ProgramPurchaseStatusBanner, type PurchaseBannerStatus } from "./ProgramPurchaseStatusBanner";
import { ProgramPurchaseSuccessDialog } from "./ProgramPurchaseSuccessDialog";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProgramEnrollmentProps {
  program: ProgramDetail;
}

const CHECKOUT_ERROR = "checkout_url_not_allowed";

export function ProgramEnrollment({ program }: ProgramEnrollmentProps) {
  const t = useTranslations("programs");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [agreedNoRefund, setAgreedNoRefund] = useState(false);

  const { mutateAsync: purchaseProgram, isPending: isPurchasing } = useProgramPurchase();
  const { mutateAsync: createPaymentLink, isPending: isCreatingLink } = useProgramPaymentLink();

  // purchase_id is ours — we're the ones who put it in the return URL
  // (/{locale}/programs/{id}?purchase_id={id}), so it's the only trusted signal
  // here. Any other query param the gateway might tack on when it redirects back
  // (payment_return, gateway_payment_id, biller_ref, status...) is never read for
  // its value — only purchase_id decides whether we poll, and only our own
  // status endpoint decides what actually happened.
  const purchaseIdParam = searchParams.get("purchase_id");
  const purchaseId = purchaseIdParam ? Number(purchaseIdParam) : undefined;

  const { data: purchaseStatus } = useProgramPurchaseStatus({ purchaseId });
  const router = useRouter();
  const tp = useTranslations("programs.purchase");
  const [showSuccess, setShowSuccess] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const handledStatusRef = useRef<string | null>(null);

  const status = purchaseStatus?.status;
  const isEnrolledNow = Boolean(purchaseStatus?.is_enrolled) || status === "paid";

  // Polling gives up after 3 minutes so the banner doesn't spin forever.
  useEffect(() => {
    if (status !== "unpaid") return;
    const timer = setTimeout(() => setPollTimedOut(true), 180_000);
    return () => clearTimeout(timer);
  }, [status, purchaseId]);

  // React once per purchase to a settled status (ref + sessionStorage guard against
  // Strict Mode double-effects and page refreshes). Access itself comes from the program
  // data, which we re-fetch here — never from the URL.
  useEffect(() => {
    if (!purchaseId || !status || status === "unpaid") return;
    const handledKey = `${purchaseId}:${status}`;
    if (handledStatusRef.current === handledKey) return;
    handledStatusRef.current = handledKey;

    const storageKey = `purchase-success-shown:${purchaseId}`;
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(storageKey) === "1";
    } catch {}

    if (isEnrolledNow) {
      queryClient.invalidateQueries({ queryKey: ["program", program.id] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["getTopEnrolledProgram"] });
      if (!alreadyShown) {
        try {
          sessionStorage.setItem(storageKey, "1");
        } catch {}
        setShowSuccess(true);
      }
      router.replace(`/programs/${program.id}`);
    } else if (!alreadyShown) {
      toast.error(tp("failedToast"));
    }
  }, [purchaseId, status, isEnrolledNow, queryClient, program.id, router, tp]);

  // is_enrolled from GET /api/programs/{id} is the only source of truth for access.
  const isEnrolled = program.is_enrolled === true;
  const isProcessing = isPurchasing || isCreatingLink;

  const scrollToVideos = () => {
    document
      .getElementById("program-videos")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const startWatching = () => {
    setShowSuccess(false);
    document.getElementById("program-videos")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubscribe = async () => {
    // Guards the handler itself (not just the button's disabled prop) against a
    // second click landing before the button visually disables.
    if (isProcessing || !agreedNoRefund) return;

    try {
      const purchase = await purchaseProgram(program.id);

      if (purchase.status === "paid" || purchase.is_enrolled) {
        // Free program — access is granted immediately, no payment step at all.
        queryClient.invalidateQueries({ queryKey: ["program", program.id] });
        queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        queryClient.invalidateQueries({ queryKey: ["programs"] });
        queryClient.invalidateQueries({ queryKey: ["getTopEnrolledProgram"] });
        toast.success(tp("freeEnrolled"));
        return;
      }

      const link = await createPaymentLink({
        purchaseId: purchase.id,
        payload: { payment_method: "card", card_type: "domestic" },
      });

      if (!isAllowedCheckoutUrl(link.checkout_url)) {
        throw new Error(CHECKOUT_ERROR);
      }

      window.location.href = link.checkout_url;
    } catch (error) {
      Sentry.captureException(error);
      const isCheckoutError =
        error instanceof Error && error.message === CHECKOUT_ERROR;
      toast.error(
        isCheckoutError
          ? tp("checkoutError")
          : tp("linkError"),
      );
    }
  };

  return (
    <div id="program-enrollment" className="sticky top-8 space-y-4">
      {/* Success is announced by the dialog; the banner covers the in-between and failure states. */}
      {purchaseId && status && status !== "paid" && (
        <ProgramPurchaseStatusBanner
          status={(status === "unpaid" && pollTimedOut ? "timeout" : status) as PurchaseBannerStatus}
        />
      )}
      <ProgramPurchaseSuccessDialog
        open={showSuccess}
        programTitle={program.title}
        onStart={startWatching}
        onClose={() => setShowSuccess(false)}
      />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {isEnrolled ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#32A88D]/10 px-4 py-3 text-sm font-semibold text-[#1F6069]">
            <Check className="h-4 w-4" />
            {t("enrolledBadge")}
          </div>
        ) : (
        <div className="mb-6">
          <div className="flex items-center gap-1 text-3xl font-bold text-[#32A88D] mb-2">
            <span>{program.price}</span>
            <Image
              width={16}
              height={16}
              src="/images/Light22.svg"
              className="w-6 h-6 "
              alt="Light icon"
            />
          </div>

          <p className="text-sm text-gray-600">سعر البرنامج الكامل</p>
        </div>
        )}

        {!isEnrolled && (
          <label className="mb-3 flex items-start gap-2 text-sm text-gray-600">
            <Checkbox
              checked={agreedNoRefund}
              onCheckedChange={(checked) => setAgreedNoRefund(Boolean(checked))}
              className="mt-0.5 cursor-pointer"
            />
            <span>الكورس غير قابل للاسترداد، وأوافق على الشراء</span>
          </label>
        )}

        <Button
          onClick={isEnrolled ? scrollToVideos : handleSubscribe}
          disabled={!isEnrolled && (!agreedNoRefund || isProcessing)}
          className="w-full min-w-40 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري التنفيذ...
            </>
          ) : isEnrolled ? (
            t("continueWatching")
          ) : (
            "اشترك الآن"
          )}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl bg-transparent"
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl bg-transparent"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ما ستحصل عليه</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">
              الوصول الكامل لجميع محتويات البرنامج
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">
              {program.videos_count} فيديو تعليمي
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">وصول مدى الحياة</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">شهادة إتمام البرنامج</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
