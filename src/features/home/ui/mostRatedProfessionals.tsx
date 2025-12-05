"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageSquare, Video, Star, MapPin, GraduationCap, Award, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetcher } from "@/hooks/useFetcher";
import { useConsultationRequestStore } from "../hooks/useConsultationRequestStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type MedicalSpecialties = {
  id: number;
  name: string;
  description: string;
};

type TherapistDetails = {
  id: number;
  medical_specialties: MedicalSpecialties;
  university_name: string;
  countries_certified: string;
};

type TypeItem = {
  id: number;
  full_name: string;
  image: string;
  therapist_details: TherapistDetails;
  total_reviews: number;
  average_rating: number;
};

interface ConsultationRequestPayload {
  patient_id: string | number;
  consultant_id: number;
  consultant_type: string;
  consultant_nature: "chat" | "video";
  requested_day?: string;
  requested_time?: string;
  type_appointment?: string;
}

export default function MostRatedProfessionals() {
  const { data: session, status } = useSession();
  
  const { data, isLoading, error } = useFetcher<TypeItem[]>(
    ["mostRatedProfessionals"],
    "/api/rating?typeServiceProvider=therapist"
  );

  const { storeConsultationRequest, Loading: isSubmitting } =
    useConsultationRequestStore();

  const handleRequest = async (
    consultantId: number,
    type: "chat" | "video"
  ) => {
    if (!session?.user?.id) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      const payload: ConsultationRequestPayload = {
        patient_id: session.user.id, 
        consultant_id: consultantId,
        consultant_type: "therapist",
        consultant_nature: type,
      };

      if (type === "video") {
        payload.requested_day = "Thursday";
        payload.requested_time = "2026-10-30 14:00";
        payload.type_appointment = "online";
      }

      const response = await storeConsultationRequest(payload);
      // toast.success("تم إرسال طلبك بنجاح، الرجاء انتظار موافقة المختص");
    } catch (error) {
      // toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى");
      console.error("❌ Error sending consultation request:", error);
    }
  };

  // Fix: data is now TypeItem[] so slice should work
  const items = data?.slice(0, 4) || [];

  // حالة التحميل
  if (isLoading) {
    return (
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">حدث خطأ</h3>
            <p className="text-red-600">تعذر تحميل بيانات المختصين</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* الهيدر */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-6 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            <span className="text-sm font-medium text-[#32A88D]">المختصون المميزون</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            المختصون الأكثر تقييماً
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اختر من بين أفضل المختصين المعتمدين ذوي الخبرة الواسعة والتقييمات المرتفعة
          </p>
        </div>

        {/* شبكة البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((data: TypeItem) => (
            <div
              key={data.id}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* صورة المختص */}
              <div className="relative overflow-hidden">
                <Image
                  src={ "/images/home/therapist.jpg"}
                  width={400}
                  height={300}
                  alt={data.full_name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    <MapPin className="w-3 h-3 mr-1" />
                    متصل الآن
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{Number(data.average_rating).toFixed(1) || "0.0"}</span>
                  </div>
                </div>
              </div>

              {/* معلومات المختص */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                    {data.full_name}
                  </h3>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 text-[#32A88D]" />
                    <span className="line-clamp-1">{data.therapist_details?.university_name || "غير محدد"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-[#32A88D]" />
                    <span className="line-clamp-1">{data.therapist_details?.medical_specialties?.name || "تخصص عام"}</span>
                  </div>
                </div>

                {/* التقييمات */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(Number(data.average_rating))
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({data.total_reviews || 0} تقييم)
                    </span>
                  </div>
                </div>

                {/* زر طلب الاستشارة */}

                     {/* <ConsultationDialog
                  provider={{
                    id: data.id,
                    full_name: data.full_name,
                    type_account: "therapist",
                    image: data.image,
                    average_rating: String(data.average_rating),
                    total_reviews: data.total_reviews,
                    therapist_details: data.therapist_details,
                  }}
                /> */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      طلب استشارة
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-8 h-8 text-[#32A88D]" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-800">
                          اختر نوع الاستشارة
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">مع {data.full_name}</p>
                      </div>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="grid grid-cols-2 gap-4">
                        {/* استشارة نصية */}
                        <button
                          onClick={() => handleRequest(data.id, "chat")}
                          disabled={isSubmitting}
                          className="group flex flex-col items-center gap-3 p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-2xl transition-all duration-300 hover:scale-105"
                        >
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <MessageSquare className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-medium text-blue-700">استشارة نصية</span>
                          <span className="text-xs text-blue-600 text-center">محادثة فورية عبر النص</span>
                        </button>

                        {/* استشارة فيديو */}
                        <button
                          onClick={() => handleRequest(data.id, "video")}
                          disabled={isSubmitting}
                          className="group flex flex-col items-center gap-3 p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-2xl transition-all duration-300 hover:scale-105"
                        >
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-medium text-green-700">استشارة فيديو</span>
                          <span className="text-xs text-green-600 text-center">مكالمة فيديو مباشرة</span>
                        </button>
                      </div>

                      {isSubmitting && (
                        <div className="flex items-center justify-center gap-2 mt-6 p-4 bg-gray-50 rounded-xl">
                          <Loader2 className="w-5 h-5 text-[#32A88D] animate-spin" />
                          <span className="text-gray-600">جاري إرسال الطلب...</span>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}