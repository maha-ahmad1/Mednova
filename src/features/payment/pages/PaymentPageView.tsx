"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  ShieldCheck,
  Calendar,
  Lock,
  X,
  User,
  Stethoscope,
  Sparkles,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useConsultationTypeStore } from "@/store/ConsultationTypeStore";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import { useCreatePaymentLink } from "@/features/payment/hooks/useCreatePaymentLink";
import { usePaymentStatus } from "@/features/payment/hooks/usePaymentStatus";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Sub-components (Stepper & Status)
───────────────────────────────────────────── */

function StepIndicator({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shadow-sm">
        {step}
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

type PaymentStatusType = "pending" | "paid" | "failed" | "loading";

const StatusBanner = ({ status }: { status: PaymentStatusType }) => {
  const config = {
    loading: {
      icon: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
      title: "جاري التحقق من حالة الدفع",
      desc: "يرجى الانتظار لحظة...",
      bg: "from-blue-50/80 to-indigo-50/50",
      text: "text-blue-800",
    },
    paid: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-700" />,
      title: "تم الدفع بنجاح",
      desc: "تم تأكيد حجزك — ستصلك رسالة تأكيد قريباً",
      bg: "from-emerald-50/80 to-teal-50/50",
      text: "text-emerald-800",
    },
    failed: {
      icon: <X className="h-4 w-4 text-rose-700" />,
      title: "فشلت عملية الدفع",
      desc: "يمكنك المحاولة مجدداً أو استخدام بطاقة مختلفة",
      bg: "from-rose-50/80 to-red-50/50",
      text: "text-rose-800",
    },
    pending: {
      icon: <Clock className="h-4 w-4 text-amber-700" />,
      title: "العملية قيد المعالجة",
      desc: "سيتم تحديث الحالة تلقائياً خلال لحظات",
      bg: "from-amber-50/80 to-yellow-50/50",
      text: "text-amber-800",
    },
  };

  const c = config[status];
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className={cn("bg-gradient-to-r p-0", c.bg)}>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="rounded-full bg-white/60 p-1.5 shadow-sm">
            {c.icon}
          </div>
          <div>
            <p className={cn("text-sm font-semibold", c.text)}>{c.title}</p>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */

export default function PaymentPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentConsultation } = useConsultationTypeStore();
  const createPaymentLinkMutation = useCreatePaymentLink();

  const isGatewayReturn = useMemo(
    () =>
      ["payment_return", "gateway_payment_id", "biller_ref", "status"].some(
        (key) => searchParams.has(key),
      ),
    [searchParams],
  );

  const { data: paymentStatusData, isLoading: isCheckingStatus } =
    usePaymentStatus({
      consultationId: currentConsultation?.consultationRequestId,
      enabled: isGatewayReturn,
    });

  useEffect(() => {
    if (!currentConsultation) {
      toast.error("لا توجد بيانات حجز لعرض الدفع");
      router.replace("/");
    }
  }, [currentConsultation, router]);

  if (!currentConsultation) return null;

  const financial = currentConsultation.financial;
  const amount = financial?.consultationPrice ?? 0;
  const platformFee = financial?.gatewayCommissionAmount ?? 0;
  const total = financial?.netAmount ?? 0;
  const currency = currentConsultation.currency || "OMR";
  const consultationTypeLabel =
    currentConsultation.consultationType === "chat"
      ? "استشارة نصية"
      : "استشارة فيديو";

  const rawStatus = paymentStatusData?.status ?? "pending";
  const paymentStatus: PaymentStatusType = isCheckingStatus
    ? "loading"
    : (rawStatus as PaymentStatusType);

  const isPaid = paymentStatus === "paid";
  const isPending = createPaymentLinkMutation.isPending;

  const handleStartPayment = async () => {
    if (!currentConsultation.consultationRequestId) {
      toast.error("تعذر إنشاء رابط الدفع. لم يتم العثور على رقم الاستشارة.");
      return;
    }
    try {
      const response = await createPaymentLinkMutation.mutateAsync({
        type: currentConsultation.consultationType,
        consultationId: currentConsultation.consultationRequestId,
        // amount,
        payment_method: "card",
        card_type: "domestic",
      });

      // const checkoutUrl = response?.data?.checkout_url;
      // const url = new URL(checkoutUrl);

      // if (url.hostname !== "secure.amwalpay.com") {
      //   throw new Error("Invalid payment URL");
      // }
      // window.location.href = checkoutUrl;

      
      const checkoutUrl = response?.data?.checkout_url;
      if (!checkoutUrl) {
        throw new Error("Missing checkout URL");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment link error", error);
      toast.error("حدث خطأ أثناء إنشاء رابط الدفع. حاول مرة أخرى.");
    }
  };

  return (
    <>
      <Navbar />
      <BreadcrumbNav currentPage="ملخص الحجز والدفع" />

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4 py-8">
        {/* Background decorative blobs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl space-y-6" dir="rtl">
          {/* Status banner on gateway return */}
          {isGatewayReturn && <StatusBanner status={paymentStatus} />}

          {/* Main Booking Card */}
          <Card className="overflow-hidden border-0 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardContent className="space-y-6 p-6 md:p-8">
              {/* Header with stepper */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-bold">تأكيد الحجز والدفع</h1>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {consultationTypeLabel}
                </Badge>
              </div>

              {/* Step 1: Provider */}
              <div className="space-y-3">
                <StepIndicator step={1} label="المختص المحجوز" />
                <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:shadow-sm">
                  <div className="relative shrink-0">
                    <Image
                      src={
                        currentConsultation.providerImage ||
                        "/images/placeholder.svg"
                      }
                      alt={currentConsultation.providerName}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
                    />
                    <span className="absolute -bottom-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                      <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold">
                        {currentConsultation.providerName}
                      </p>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Stethoscope className="h-3 w-3" />
                      {currentConsultation.providerSpecializations?.length
                        ? currentConsultation.providerSpecializations.join("، ")
                        : "اختصاصي معتمد"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Appointment */}
              <div className="space-y-3">
                <StepIndicator step={2} label="تفاصيل الموعد" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase text-muted-foreground">
                        التاريخ
                      </p>
                      <p className="text-sm font-semibold">
                        {currentConsultation.requestedDay || "غير محدد"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase text-muted-foreground">
                        الوقت
                      </p>
                      <p className="text-sm font-semibold">
                        {currentConsultation.requestedTime || "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Cost Summary */}
              <div className="space-y-3">
                <StepIndicator step={3} label="ملخص التكاليف" />
                <div className="rounded-xl border border-border/40 bg-card/30 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        قيمة الاستشارة
                      </span>
                      <span className="font-medium tabular-nums">
                        {amount} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">رسوم المنصة</span>
                      <span className="font-medium tabular-nums">
                        {platformFee} {currency}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">المبلغ الإجمالي</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary tabular-nums">
                          {total}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow Trust Message */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 backdrop-blur-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="flex items-center gap-1 text-sm font-semibold text-amber-900">
                    حماية مالية مضمونة — نظام Escrow
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800/80">
                    في ميدنوفا، نحتفظ بالمبلغ حتى إتمام الجلسة بنجاح. يُحوَّل
                    للمختص بعد ٤٨ ساعة من انتهاء الجلسة دون نزاعات.
                  </p>
                </div>
              </div>

              {/* Payment Button + Security */}
              <div className="space-y-4 pt-2">
                <Button
                  onClick={handleStartPayment}
                  disabled={isPending || isPaid}
                  className="group relative w-full bg-gradient-to-r from-primary to-primary/90 py-6 text-base font-semibold shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {isPending ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      جاري إنشاء رابط الدفع...
                    </>
                  ) : isPaid ? (
                    <>
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                      تم الدفع بنجاح
                    </>
                  ) : (
                    <>
                      <CreditCard className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                      الدفع الآمن — {total} {currency}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>بيانات مشفرة بـ SSL 256-bit — دفع آمن تماماً</span>
                </div>

                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                  بالدفع، أنت توافق على{" "}
                  <span className="cursor-pointer font-medium text-primary underline-offset-2 hover:underline">
                    شروط الخدمة
                  </span>{" "}
                  و{" "}
                  <span className="cursor-pointer font-medium text-primary underline-offset-2 hover:underline">
                    سياسة الخصوصية
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
