"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock3, CreditCard, Loader2, ShieldCheck, Calendar, Clock, User, Banknote, Sparkles, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useConsultationTypeStore } from "@/store/ConsultationTypeStore";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import { useCreatePaymentLink } from "@/features/payment/hooks/useCreatePaymentLink";
import { usePaymentStatus } from "@/features/payment/hooks/usePaymentStatus";

export default function PaymentPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentConsultation } = useConsultationTypeStore();

  const createPaymentLinkMutation = useCreatePaymentLink();

  const isGatewayReturn = useMemo(
    () =>
      ["payment_return", "gateway_payment_id", "biller_ref", "status"].some((key) =>
        searchParams.has(key),
      ),
    [searchParams],
  );

  const { data: paymentStatusData, isLoading: isCheckingStatus } = usePaymentStatus({
    consultationId: currentConsultation?.consultationRequestId,
    enabled: isGatewayReturn,
  });

  useEffect(() => {
    if (!currentConsultation) {
      toast.error("لا توجد بيانات حجز لعرض الدفع");
      router.replace("/");
    }
  }, [currentConsultation, router]);

  if (!currentConsultation) {
    return null;
  }

  const financial = currentConsultation.financial;
  const amount = financial?.consultationPrice ?? 0;
  const platformFee = financial?.gatewayCommissionAmount ?? 0;
  const total = financial?.netAmount ?? 0;

  const consultationTypeLabel =
    currentConsultation.consultationType === "chat" ? "استشارة نصية" : "استشارة فيديو";

  const paymentStatus = paymentStatusData?.status ?? "pending";

  const handleStartPayment = async () => {
    if (!currentConsultation.consultationRequestId) {
      toast.error("تعذر إنشاء رابط الدفع. لم يتم العثور على رقم الاستشارة.");
      return;
    }

    try {
      const response = await createPaymentLinkMutation.mutateAsync({
        type: currentConsultation.consultationType,
        consultationId: currentConsultation.consultationRequestId,
        amount,
        payment_method: "card",
        card_type: "domestic",
      });

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

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 px-4 py-8">
        {/* عناصر زخرفية للخلفية */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl space-y-5" dir="rtl">
          {/* بطاقة حالة العودة من البوابة */}
          {isGatewayReturn && (
            <Card className="overflow-hidden border-0 shadow-md transition-all duration-300">
              <CardContent className="p-0">
                {isCheckingStatus ? (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 px-5 py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-foreground">جاري التحقق من حالة الدفع...</span>
                  </div>
                ) : paymentStatus === "paid" ? (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50/50 px-5 py-4">
                    <div className="rounded-full bg-emerald-100 p-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">تم الدفع بنجاح</p>
                      <p className="text-xs text-emerald-700/80">تم تأكيد الحجز وسيتم إشعارك بالجلسة</p>
                    </div>
                  </div>
                ) : paymentStatus === "failed" ? (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-rose-50 to-red-50/50 px-5 py-4">
                    <div className="rounded-full bg-rose-100 p-1">
                      <AlertCircle className="h-4 w-4 text-rose-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-rose-800">فشلت عملية الدفع</p>
                      <p className="text-xs text-rose-700/80">يمكنك المحاولة مرة أخرى باستخدام بطاقة أخرى</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50/50 px-5 py-4">
                    <div className="rounded-full bg-amber-100 p-1">
                      <Clock3 className="h-4 w-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">العملية قيد المعالجة</p>
                      <p className="text-xs text-amber-700/80">سيتم تحديث الحالة تلقائياً خلال لحظات</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* البطاقة الرئيسية */}
          <Card className="overflow-hidden border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-l from-primary/5 to-transparent px-5 py-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-1">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-lg font-bold">تأكيد الحجز والدفع</span>
                </div>
                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium shadow-sm">
                  {consultationTypeLabel}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 p-5">
              {/* معلومات المختص */}
              <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-card to-muted/5 p-4 transition-all duration-300 hover:shadow-sm">
                <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary/30 to-transparent opacity-0 blur transition-opacity group-hover:opacity-100" />
                    <Image
                      src={currentConsultation.providerImage || "/images/placeholder.svg"}
                      alt={currentConsultation.providerName}
                      width={48}
                      height={48}
                      className="relative h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-base font-semibold">{currentConsultation.providerName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentConsultation.consultantType === "therapist" ? "معالج " : "مركز تأهيلي"}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Stethoscope className="h-3 w-3" />
                      {currentConsultation.providerSpecializations?.length
                        ? currentConsultation.providerSpecializations.join("، ")
                        : "التخصص غير محدد"}
                    </p>
                  </div>
                </div>
              </div>

              {/* تفاصيل الموعد */}
              <div className="grid gap-3 rounded-xl border border-border/30 bg-card/40 p-4 backdrop-blur-sm sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-50 p-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">التاريخ</p>
                    <p className="text-sm font-semibold">{currentConsultation.requestedDay || "غير محدد"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-indigo-50 p-1.5">
                    <Clock className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">الوقت</p>
                    <p className="text-sm font-semibold">{currentConsultation.requestedTime || "غير محدد"}</p>
                  </div>
                </div>
              </div>

              {/* تفاصيل المبلغ */}
              <div className="space-y-3 rounded-xl border border-border/30 bg-gradient-to-br from-muted/20 to-transparent p-4">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                  <Banknote className="h-3.5 w-3.5" />
                  ملخص التكاليف
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">قيمة الاستشارة</span>
                    <span className="font-medium tabular-nums">
                      {amount} {currentConsultation.currency || "OMR"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">رسوم المنصة</span>
                    <span className="font-medium tabular-nums">
                      {platformFee} {currentConsultation.currency || "OMR"}
                    </span>
                  </div>
                  <Separator className="my-1.5" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">الإجمالي</span>
                    <span className="text-base font-bold tabular-nums text-primary">
                      {total} {currentConsultation.currency || "OMR"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* نظام الأمان المالي */}
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-200/40 bg-amber-50/20 p-3 backdrop-blur-sm">
                <div className="rounded-full bg-amber-100 p-1">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <p className="flex items-center gap-1 text-xs font-semibold text-amber-900">
                    نظام الأمان المالي (Escrow)
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  </p>
                  <p className="text-[11px] text-amber-800/80">
                    نحن في MedNova نقوم بحجز المبلغ لدينا، ولا يتم تحويله للمختص إلا بعد التأكد من إتمام الجلسة بنجاح ومرور 48 ساعة دون أي نزاعات.
                  </p>
                </div>
              </div>

              {/* زر الدفع */}
              <Button
                type="button"
                size="default"
                className="group relative w-full overflow-hidden bg-gradient-to-r from-primary to-primary/90 text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
                onClick={handleStartPayment}
                disabled={createPaymentLinkMutation.isPending || paymentStatus === "paid"}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {createPaymentLinkMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    جاري إنشاء رابط الدفع...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-1.5 h-4 w-4 transition-transform group-hover:scale-110" />
                    {paymentStatus === "paid" ? "تم الدفع" : "الانتقال للدفع الآمن"}
                  </>
                )}
              </Button>

              {/* الشروط والأحكام */}
              <p className="text-center text-[10px] text-muted-foreground">
                بالضغط على الزر، أنت توافق على{" "}
                <span className="cursor-pointer font-medium text-primary underline-offset-2 hover:underline">
                  شروط الخدمة
                </span>{" "}
                و{" "}
                <span className="cursor-pointer font-medium text-primary underline-offset-2 hover:underline">
                  سياسة الخصوصية
                </span>{" "}
                الخاصة بالمنصة.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
