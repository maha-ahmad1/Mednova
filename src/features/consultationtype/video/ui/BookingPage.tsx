"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon,
  Stethoscope,
  Building,
  Loader2,
  Globe,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import LandingNavbar from "@/shared/ui/layout/LandingNavbar";
// بيانات الطبيب الافتراضية
const doctorInfo = {
  name: "د. مايكل براون",
  title: "طبيب القلب",
  address: "1011 W 5th St, Suite 120, Austin, TX 78703",
  service: "أمراض القلب",
  duration: "30 دقيقة",
  appointmentType: "عيادة (مسار العافية)",
  date: "15 أكتوبر 2025",
  time: "10:00 - 11:00 صباحاً",
};

// أوقات متاحة
const availableSlots = {
  morning: ["08:00", "09:00", "10:00", "11:00"],
  afternoon: ["13:00", "14:00", "15:00", "16:00"],
  evening: ["17:00", "18:00", "19:00", "20:00"],
};

// المناطق الزمنية المتاحة
const timeZones = [
  { id: "gmt+3", label: "توقيت الرياض (GMT+3)", offset: "+03:00" },
  { id: "gmt+4", label: "توقيت دبي (GMT+4)", offset: "+04:00" },
  { id: "gmt+2", label: "توقيت القاهرة (GMT+2)", offset: "+02:00" },
  { id: "gmt+5", label: "توقيت باكستان (GMT+5)", offset: "+05:00" },
];

export default function AppointmentBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("gmt+3");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);

  // معالجة حجز الموعد
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("الرجاء اختيار التاريخ والوقت");
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("تم الحجز:", { selectedDate, selectedTime, selectedTimeZone });
      alert("تم حجز الموعد بنجاح!");
    } catch (error) {
      console.error("خطأ في الحجز:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // التنقل بين الأشهر
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleTimeZoneSelect = (timeZoneId: string) => {
    setSelectedTimeZone(timeZoneId);
    setShowTimeZoneDropdown(false);
  };

  const getSelectedTimeZoneLabel = () => {
    const timeZone = timeZones.find(tz => tz.id === selectedTimeZone);
    return timeZone ? timeZone.label : "اختر المنطقة الزمنية";
  };

  return (
    <>
    <LandingNavbar/>
    
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-6 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            <span className="text-sm font-medium text-[#32A88D]">حجز المواعيد</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            حجز موعد مع المختص
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اختر التاريخ والوقت المناسبين لحجز موعدك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأول: معلومات الطبيب والتاريخ الحالي */}
          <div className="lg:col-span-1 space-y-6">
            {/* بطاقة معلومات الطبيب */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{doctorInfo.name}</h2>
                <p className="text-gray-600 mt-1">{doctorInfo.title}</p>
                
                <div className="flex items-center gap-2 mt-4 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{doctorInfo.address}</span>
                </div>
              </div>

              {/* معلومات الحجز الحالي */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات الحجز</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الخدمة</span>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {doctorInfo.service}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">المدة</span>
                    <span className="font-medium">{doctorInfo.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">التاريخ والوقت</span>
                    <div className="text-right">
                      <div className="font-medium">{doctorInfo.date}</div>
                      <div className="text-sm text-gray-500">{doctorInfo.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">نوع الموعد</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <Building className="w-3 h-3 mr-1" />
                      {doctorInfo.appointmentType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* زر الرجوع */}
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-6"
            >
              <ChevronRight className="w-5 h-5 ml-2" />
              الرجوع
            </Button>
          </div>

          {/* العمود الثاني: التقويم والأوقات - الآن في صف واحد */}
          <div className="lg:col-span-2 space-y-8">
            {/* صف التقويم والأوقات */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* كارد التقويم */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#32A88D]" />
                    <h3 className="text-xl font-bold text-gray-800">اختر التاريخ</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPreviousMonth}
                      className="rounded-full hover:bg-gray-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    
                    <span className="font-medium text-gray-700">
                      {format(currentMonth, "MMMM yyyy", { locale: ar })}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNextMonth}
                      className="rounded-full hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* شبكة أيام الأسبوع */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* شبكة الأيام */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index - 3; // بداية من 30 الشهر الماضي
                    const date = new Date(2025, 11, day); // ديسمبر 2025
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                    
                    return (
                      <button
                        key={index}
                        onClick={() => isCurrentMonth && setSelectedDate(date)}
                        className={cn(
                          "h-12 rounded-lg text-center transition-all duration-300",
                          !isCurrentMonth && "text-gray-300 cursor-not-allowed",
                          isCurrentMonth && "hover:bg-gray-100",
                          isToday && "bg-blue-50 text-blue-600 font-medium",
                          isSelected && "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white"
                        )}
                        disabled={!isCurrentMonth}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span>{date.getDate()}</span>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* المنطقة الزمنية */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">المنطقة الزمنية</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTimeZoneDropdown(!showTimeZoneDropdown)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">{getSelectedTimeZoneLabel()}</span>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-gray-500 transition-transform",
                        showTimeZoneDropdown && "transform rotate-180"
                      )} />
                    </button>
                    
                    {showTimeZoneDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        {timeZones.map((timeZone) => (
                          <button
                            key={timeZone.id}
                            type="button"
                            onClick={() => handleTimeZoneSelect(timeZone.id)}
                            className={cn(
                              "w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors",
                              selectedTimeZone === timeZone.id && "bg-[#32A88D]/10 text-[#32A88D]"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{timeZone.offset}</span>
                              <span>{timeZone.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* كارد الأوقات المتاحة */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-[#32A88D]" />
                  <h3 className="text-xl font-bold text-gray-800">اختر الوقت</h3>
                </div>

                <div className="space-y-8">
                  {/* فترة الصباح */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">الصباح</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.morning.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 px-4 rounded-xl border transition-all duration-300",
                            selectedTime === time
                              ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white border-transparent"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* فترة بعد الظهر */}
                  {/* <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">بعد الظهر</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.afternoon.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 px-4 rounded-xl border transition-all duration-300",
                            selectedTime === time
                              ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white border-transparent"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  {/* فترة المساء */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">المساء</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.evening.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 px-4 rounded-xl border transition-all duration-300",
                            selectedTime === time
                              ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white border-transparent"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ملاحظة حول المنطقة الزمنية */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Globe className="w-4 h-4" />
                      <span>جميع الأوقات معروضة حسب المنطقة الزمنية المحددة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* زر الحجز */}
            <Button
              onClick={handleBooking}
              disabled={isLoading || !selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  جاري الحجز...
                </>
              ) : (
                "تأكيد الحجز"
              )}
            </Button>

            {/* معلومات إضافية */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                بالضغط على تأكيد الحجز، فإنك توافق على 
                <a href="#" className="text-[#32A88D] hover:underline mr-1"> شروط الخدمة</a>
                و
                <a href="#" className="text-[#32A88D] hover:underline mr-1"> سياسة الخصوصية</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}