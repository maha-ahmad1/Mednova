"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, User, Mail, Phone, Calendar, MapPin, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PatientSuccessProps {
  patientData: {
    full_name: string
    email: string
    phone: string
    birth_date: string
    gender: string
    address: string
    emergency_phone?: string
    relationship?: string
    image?: File
  }
}

export function PatientSuccess({ patientData }: PatientSuccessProps) {
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto py-10" dir="rtl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-[#32A88D]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">تم حفظ البيانات بنجاح!</h1>
        <p className="text-muted-foreground text-lg">
          تم إضافة بياناتك إلى منصة <span className="text-[#32A88D] font-semibold">ميدنوفا</span> بنجاح
        </p>
      </div>

      {/* Patient Data Card */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-l from-[#32A88D]/5 to-transparent">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <User className="w-6 h-6 text-[#32A88D]" />
            بيانات المريض
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-[#32A88D]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">الاسم الكامل</p>
                <p className="text-lg font-semibold text-foreground">{patientData.full_name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#32A88D]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</p>
                <p className="text-lg font-semibold text-foreground break-all">{patientData.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#32A88D]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">رقم الهاتف</p>
                <p className="text-lg font-semibold text-foreground">{patientData.phone}</p>
              </div>
            </div>

            {/* Birth Date */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#32A88D]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">تاريخ الميلاد</p>
                <p className="text-lg font-semibold text-foreground">{patientData.birth_date}</p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#32A88D]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">الجنس</p>
                <p className="text-lg font-semibold text-foreground">
                  {patientData.gender === "male" ? "ذكر" : "أنثى"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#32A88D]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">عنوان السكن</p>
                <p className="text-lg font-semibold text-foreground">{patientData.address}</p>
              </div>
            </div>

            {/* Emergency Phone */}
            {patientData.emergency_phone && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#32A88D]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">جهة اتصال للطوارئ</p>
                  <p className="text-lg font-semibold text-foreground">{patientData.emergency_phone}</p>
                </div>
              </div>
            )}

            {/* Relationship */}
            {patientData.relationship && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-[#32A88D]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">صلة القرابة</p>
                  <p className="text-lg font-semibold text-foreground">{patientData.relationship}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
            <Button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-6 bg-[#32A88D] hover:bg-[#2a9179] text-white font-semibold"
            >
              العودة إلى لوحة التحكم
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
