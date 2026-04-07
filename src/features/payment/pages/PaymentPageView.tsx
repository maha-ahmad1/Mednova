"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock3, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConsultationTypeStore } from "@/store/ConsultationTypeStore";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import { useCreatePaymentLink } from "@/features/payment/hooks/useCreatePaymentLink";
import { usePaymentStatus } from "@/features/payment/hooks/usePaymentStatus";

const DEFAULT_PLATFORM_FEE = 0;

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

  const platformFee = currentConsultation.platformFee ?? DEFAULT_PLATFORM_FEE;
  const amount = currentConsultation.amount ?? 0;
  const total = amount + platformFee;

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

      <div className="min-h-screen bg-muted/20 py-8 px-4">
        <div className="mx-auto max-w-4xl space-y-6" dir="rtl">
          {isGatewayReturn && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                {isCheckingStatus ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري التحقق من حالة الدفع...</span>
                  </div>
                ) : paymentStatus === "paid" ? (
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>تم الدفع بنجاح. تم تأكيد الحجز.</span>
                  </div>
                ) : paymentStatus === "failed" ? (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span>فشلت عملية الدفع. يمكنك المحاولة مرة أخرى.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-700">
                    <Clock3 className="h-5 w-5" />
                    <span>
                      تم استلام عودتك من بوابة الدفع. العملية ما زالت قيد المعالجة، وسيتم تحديث الحالة تلقائياً.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center justify-between gap-4">
                <span>ملخص الحجز</span>
                <Badge variant="secondary">{consultationTypeLabel}</Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <Image
                  src={currentConsultation.providerImage || "/images/placeholder.svg"}
                  alt={currentConsultation.providerName}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{currentConsultation.providerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentConsultation.consultantType === "therapist" ? "معالج نفسي" : "مركز تأهيلي"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 rounded-xl border p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">التاريخ</p>
                  <p className="font-medium">{currentConsultation.requestedDay || "غير محدد"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الوقت</p>
                  <p className="font-medium">{currentConsultation.requestedTime || "غير محدد"}</p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">قيمة الاستشارة</span>
                  <span>{amount.toFixed(2)} {currentConsultation.currency || "SAR"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رسوم المنصة</span>
                  <span>{platformFee.toFixed(2)} {currentConsultation.currency || "SAR"}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 font-semibold">
                  <span>الإجمالي</span>
                  <span>{total.toFixed(2)} {currentConsultation.currency || "SAR"}</span>
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleStartPayment}
                disabled={createPaymentLinkMutation.isPending || paymentStatus === "paid"}
              >
                {createPaymentLinkMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري إنشاء رابط الدفع...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {paymentStatus === "paid" ? "تم الدفع" : "الانتقال للدفع الآمن"}
                  </>
                )}
              </Button>

              <div className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground/80 mb-1">نظام الأمان المالي (Escrow)</p>
                <p>
                  نحن في MedNova نقوم بحجز المبلغ لدينا، ولا يتم تحويله للمختص إلا بعد التأكد من إتمام الجلسة بنجاح ومرور 48 ساعة دون أي نزاعات.
                </p>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                بالضغط على الزر، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بالمنصة.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
