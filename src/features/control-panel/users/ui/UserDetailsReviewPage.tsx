"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetcher } from "@/hooks/useFetcher";
import type { AdminUserDetails } from "../types/user";
import { WithSkeleton } from "@/shared/ui/components/WithSkeleton";

interface UserDetailsReviewPageProps {
  userId: string;
}

const approvalStatusMap: Record<string, { label: string; className: string }> = {
  approved: { label: "موافق عليه", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-700 border-amber-200" },
  rejected: { label: "مرفوض", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

const accountTypeMap: Record<string, string> = {
  patient: "مريض",
  therapist: "أخصائي",
  rehabilitation_center: "مركز تأهيل",
};

const scheduleTypeMap: Record<string, string> = {
  offline: "حضوري",
  online: "عن بُعد",
};

const dayMap: Record<string, string> = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};

const safeValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
};

const formatCompletion = (isCompleted: boolean) => (isCompleted ? 100 : 60);

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0))
    .join("")
    .toUpperCase();

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground break-words">{value}</p>
    </div>
  );
}

function VerificationStatusItem({
  label,
  isVerified,
  icon,
}: {
  label: string;
  isVerified: boolean;
  icon: ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">
        {isVerified ? (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            {icon}
            موثّق
          </span>
        ) : (
          <span className="text-amber-700">غير موثّق</span>
        )}
      </p>
    </div>
  );
}

function DetailsSection({ title, children, contentClassName }: { title: string; children: ReactNode; contentClassName: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">{title}</CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function UserDetailsReviewPage({ userId }: UserDetailsReviewPageProps) {
  const { data: user, isLoading, isError } = useFetcher<AdminUserDetails>(
    ["admin-user-details", userId],
    `/api/control-panel/users/${userId}`,
  );

  const mapUrl = useMemo(() => {
    if (!user?.location_details?.latitude || !user?.location_details?.longitude) {
      return "";
    }

    return `https://www.google.com/maps?q=${user.location_details.latitude},${user.location_details.longitude}`;
  }, [user]);

  const loadingSkeleton = (
      <div className="mx-auto w-full max-w-7xl space-y-4 p-6" dir="rtl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );

  if (isError || !user) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6" dir="rtl">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-destructive font-medium">تعذر تحميل بيانات المستخدم.</p>
            <p className="text-sm text-muted-foreground">يرجى المحاولة لاحقًا.</p>
            <Button asChild variant="outline" className="mt-3">
              <Link href="/control-panel/users">العودة إلى قائمة المستخدمين</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const approval = approvalStatusMap[user.approval_status] ?? approvalStatusMap.pending;
  const isCenter = user.type_account === "rehabilitation_center";

  return (
    <WithSkeleton isLoading={isLoading} skeleton={loadingSkeleton}>
      <div className="mx-auto w-full max-w-7xl space-y-5 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-1 text-right">
          <h1 className="text-2xl font-semibold">مراجعة بيانات المستخدم</h1>
          <p className="text-sm text-muted-foreground">تفاصيل الحساب والاعتماد والموقع ضمن لوحة التحكم.</p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/control-panel/users">
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-20 border">
                <AvatarImage src={user.image ?? undefined} alt={user.full_name} />
                <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
              </Avatar>

              <div className="space-y-2 text-right">
                <h2 className="text-xl font-semibold">{safeValue(user.full_name)}</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="gap-1">
                    <User className="h-3.5 w-3.5" />
                    {accountTypeMap[user.type_account] ?? user.type_account}
                  </Badge>
                  <Badge variant="outline" className={approval.className}>
                    {approval.label}
                  </Badge>
                  <Badge variant="outline" className={user.is_completed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                    {user.is_completed ? "الملف مكتمل" : "الملف غير مكتمل"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" /> {safeValue(user.email)}</span>
                  <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" /> {safeValue(user.phone)}</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">اكتمال الحساب</span>
                <span className="font-medium">{formatCompletion(user.is_completed)}%</span>
              </div>
              <Progress value={formatCompletion(user.is_completed)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" dir="rtl" className="space-y-4">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-xl border bg-muted/40 p-1">
          <TabsTrigger value="overview" className="px-5 py-2">نظرة عامة</TabsTrigger>
          <TabsTrigger value="location" className="px-5 py-2">بيانات الموقع</TabsTrigger>
          {isCenter && <TabsTrigger value="center" className="px-5 py-2">بيانات المركز</TabsTrigger>}
          <TabsTrigger value="schedule" className="px-5 py-2">جدول العمل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DetailsSection title="البيانات الأساسية" contentClassName="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="الاسم الكامل" value={safeValue(user.full_name)} />
            <InfoItem label="البريد الإلكتروني" value={safeValue(user.email)} />
            <InfoItem label="رقم الجوال" value={safeValue(user.phone)} />
            <InfoItem label="تاريخ الميلاد" value={safeValue(user.birth_date)} />
            <InfoItem label="الجنس" value={safeValue(user.gender)} />
            <InfoItem label="المنطقة الزمنية" value={safeValue(user.timezone)} />
            <InfoItem label="نوع الحساب" value={accountTypeMap[user.type_account] ?? user.type_account} />
            <InfoItem label="حالة الموافقة" value={approval.label} />
            <InfoItem label="اكتمال الحساب" value={user.is_completed ? "مكتمل" : "غير مكتمل"} />

            <VerificationStatusItem
              label="توثيق البريد الإلكتروني"
              isVerified={Boolean(user.email_verified_at)}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <VerificationStatusItem
              label="توثيق الهاتف"
              isVerified={Boolean(user.phone_verified_at)}
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </DetailsSection>
        </TabsContent>

        <TabsContent value="location">
          <DetailsSection title="بيانات الموقع" contentClassName="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="الدولة" value={safeValue(user.location_details?.country)} />
            <InfoItem label="المنطقة" value={safeValue(user.location_details?.region)} />
            <InfoItem label="المدينة" value={safeValue(user.location_details?.city)} />
            <InfoItem label="العنوان" value={safeValue(user.location_details?.formatted_address)} />
            <InfoItem label="الرمز البريدي" value={safeValue(user.location_details?.postal_code)} />
            <InfoItem
              label="الإحداثيات"
              value={`${safeValue(user.location_details?.latitude)} , ${safeValue(user.location_details?.longitude)}`}
            />
            <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3 md:col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">رابط خرائط Google</p>
              {mapUrl ? (
                <Link
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  فتح الموقع على الخريطة
                </Link>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">لا توجد إحداثيات متاحة.</p>
              )}
            </div>
          </DetailsSection>
        </TabsContent>

        {isCenter && (
          <TabsContent value="center">
            <DetailsSection title="بيانات المركز" contentClassName="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="اسم المركز" value={safeValue(user.center_details?.name_center)} />
              <InfoItem label="سنة التأسيس" value={safeValue(user.center_details?.year_establishment)} />
              <InfoItem label="رقم الترخيص" value={safeValue(user.center_details?.license_number)} />
              <InfoItem label="جهة الترخيص" value={safeValue(user.center_details?.license_authority)} />
              <InfoItem
                label="السجل التجاري"
                value={
                  user.center_details?.has_commercial_registration
                    ? safeValue(user.center_details?.commercial_registration_number)
                    : "لا يوجد"
                }
              />
              <InfoItem label="جهة السجل التجاري" value={safeValue(user.center_details?.commercial_registration_authority)} />
              <InfoItem label="سعر الاستشارة المرئية" value={safeValue(user.center_details?.video_consultation_price)} />
              <InfoItem label="سعر الاستشارة الكتابية" value={safeValue(user.center_details?.chat_consultation_price)} />
              <InfoItem label="العملة" value={safeValue(user.center_details?.currency)} />

              {!user.center_details?.license_file && (
                <div className="md:col-span-2 lg:col-span-3">
                  <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    تنبيه: ملف الترخيص غير مرفوع
                  </Badge>
                </div>
              )}
            </DetailsSection>
          </TabsContent>
        )}

        <TabsContent value="schedule">
          <DetailsSection title="جدول العمل" contentClassName="space-y-3">
            {user.schedules.length === 0 && (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground text-center">
                لا يوجد جدول عمل مضاف.
              </p>
            )}

            {user.schedules.map((schedule) => (
              <div key={schedule.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoItem
                  label="الأيام"
                  value={schedule.day_of_week.map((day) => dayMap[day] ?? day).join("، ") || "—"}
                />
                <InfoItem
                  label="الفترة الصباحية"
                  value={
                    schedule.start_time_morning && schedule.end_time_morning
                      ? `${schedule.start_time_morning} - ${schedule.end_time_morning}`
                      : "—"
                  }
                />
                <InfoItem
                  label="الفترة المسائية"
                  value={
                    schedule.is_have_evening_time && schedule.start_time_evening && schedule.end_time_evening
                      ? `${schedule.start_time_evening} - ${schedule.end_time_evening}`
                      : "لا توجد"
                  }
                />
                <InfoItem label="نوع الدوام" value={scheduleTypeMap[schedule.type_time] ?? schedule.type_time} />
              </div>
            ))}
          </DetailsSection>
        </TabsContent>
      </Tabs>
      </div>
    </WithSkeleton>
  );
}
