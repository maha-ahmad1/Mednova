// "use client"

// import { useState, useEffect } from "react"
// import { Globe, ChevronDown, Check, Search } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { TimeZoneService, type TimeZoneOption } from "@/lib/timezone-service"

// interface Props {
//   selectedTimeZone: string
//   onSelect: (id: string) => void
//   customerId?: number
//   apiBaseUrl?: string // للسماح بتخصيص URL الـ API
// }

// export default function TimeZoneSelector({
//   selectedTimeZone,
//   onSelect,
//   customerId ,
//   apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
// }: Props) {
//   // الحالات (States)
//   const [open, setOpen] = useState(false)
//   const [search, setSearch] = useState("")
//   const [timeZones, setTimeZones] = useState<TimeZoneOption[]>([])
//   const [loading, setLoading] = useState(true)
//   const [userCurrentZone, setUserCurrentZone] = useState("")

//   useEffect(() => {
//     async function loadTimeZones() {
//       setLoading(true)
//       try {
//         // جلب المناطق الزمنية من الـ API، مع fallback
//         let zones: TimeZoneOption[] = []
//         try {
//           zones = await TimeZoneService.getTimeZonesFromAPI(apiBaseUrl)
//         } catch (e) {
//           zones = TimeZoneService.getFallbackTimeZones()
//         }
//         setTimeZones(zones)

//         // اكتشاف منطقة المستخدم الحالية تلقائياً
//         const detectedZone = TimeZoneService.detectUserTimeZone()
//         setUserCurrentZone(detectedZone)

//         if (!selectedTimeZone && detectedZone) {
//           onSelect(detectedZone)
//           // إرسال المنطقة التلقائية إلى الـ API
//           if (customerId) {
//             await updateTimezoneOnServer(detectedZone)
//           }
//         }
//       } catch (error) {
//         console.error("خطأ في تحميل المناطق الزمنية:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadTimeZones()
//   }, []) // يتم تنفيذها مرة واحدة فقط عند التحميل

//   const updateTimezoneOnServer = async (zoneId: string) => {
//     if (!customerId) {
//       console.log("[v0] لا يوجد معرف عميل، لن يتم إرسال الطلب")
//       return
//     }

//     console.log("[v0] إرسال طلب تحديث المنطقة الزمنية:", {
//       customer_id: customerId,
//       timezone: zoneId,
//       url: `${apiBaseUrl}/api/customer/update-timezone`,
//     })

//     try {
//       const response = await fetch(`https://mednovacare.com/api/customer/update-timezone`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer_id: customerId,
//           timezone: zoneId,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         console.error("[v0] فشل تحديث المنطقة الزمنية:", data)
//         throw new Error(data.message || "فشل تحديث المنطقة الزمنية")
//       }

//       console.log("[v0] تم تحديث المنطقة الزمنية بنجاح:", data)
//       return data
//     } catch (error) {
//       console.error("[v0] خطأ في تحديث المنطقة الزمنية:", error)
//       throw error
//     }
//   }

//   const filteredZones = timeZones.filter(
//     (zone) =>
//       zone.label.toLowerCase().includes(search.toLowerCase()) || zone.id.toLowerCase().includes(search.toLowerCase()),
//   )

//   // الحصول على تسمية المنطقة المختارة
//   const getSelectedLabel = () => {
//     if (!selectedTimeZone) return "اختر المنطقة الزمنية"

//     const zone = timeZones.find((t) => t.id === selectedTimeZone)
//     if (!zone) return selectedTimeZone

//     return zone.label
//   }

// const handleSelectZone = async (zoneId: string) => {
//   // 1. تحديث الخادم أولاً
//   try {
//     await updateTimezoneOnServer(zoneId);
//     console.log("[v1] تم تحديث المنطقة الزمنية على الخادم بنجاح");

//     // 2. ثم تحديث الواجهة
//     onSelect(zoneId);
//     setOpen(false);
//     setSearch(""); // إعادة تعيين البحث

//   } catch (error) {
//     console.error("[v1] فشل تحديث المنطقة الزمنية، لن يتم تحديث الواجهة:", error);
//     // يمكنك إضافة رسالة خطأ للمستخدم هنا
//   }
// };

//   const handleUseMyLocation = () => {
//     if (userCurrentZone) {
//       handleSelectZone(userCurrentZone)
//     }
//   }

//   return (
//     <div className="space-y-3 mb-2">
//       {/* العنوان */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Globe className="w-4 h-4 text-gray-600" />
//           <span className="text-sm font-medium text-gray-700">المنطقة الزمنية</span>
//         </div>

//         {userCurrentZone && (
//           <button
//             type="button"
//             onClick={handleUseMyLocation}
//             className="cursor-pointer text-xs text-[#32A88D] hover:text-[#2a8a7a] transition-colors"
//           >
//             استخدام موقعي
//           </button>
//         )}
//       </div>

//       {/* الزر الرئيسي */}
//       <div className="relative">
//         <button
//           type="button"
//           onClick={() => setOpen(!open)}
//           disabled={loading}
//           className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#32A88D] hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <div className="flex items-center gap-2 flex-1 min-w-0">
//             {loading ? (
//               <span className="text-gray-500 text-sm">جاري التحميل...</span>
//             ) : (
//               <span className="text-gray-800 text-sm truncate">{getSelectedLabel()}</span>
//             )}
//           </div>
//           <ChevronDown
//             className={cn("w-4 h-4 text-gray-500 transition-transform flex-shrink-0", open && "rotate-180")}
//           />
//         </button>

//         {/* القائمة المنسدلة */}
//         {open && !loading && (
//           <>
//             {/* خلفية شفافة للإغلاق عند النقر خارج القائمة */}
//             <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

//             <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-w-md">
//               {/* شريط البحث */}
//               <div className="p-3 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
//                 <div className="relative">
//                   <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="ابحث عن مدينة أو منطقة..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="w-full pr-10 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D]"
//                     autoFocus
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                 </div>
//                 <div className="mt-2 text-xs text-gray-500">{filteredZones.length} منطقة زمنية متاحة</div>
//               </div>

//               {/* قائمة المناطق */}
//               <div className="max-h-64 overflow-y-auto">
//                 {filteredZones.length === 0 ? (
//                   <div className="p-6 text-center text-gray-500 text-sm">لم يتم العثور على مناطق تطابق بحثك</div>
//                 ) : (
//                   filteredZones.map((zone) => (
//                     <button
//                       key={zone.id}
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         handleSelectZone(zone.id)
//                       }}
//                       className={cn(
//                         "w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group",
//                         selectedTimeZone === zone.id && "bg-[#32A88D]/10",
//                       )}
//                     >
//                       <span
//                         className={cn(
//                           "text-sm",
//                           selectedTimeZone === zone.id ? "text-[#32A88D] font-medium" : "text-gray-700",
//                         )}
//                       >
//                         {zone.label}
//                       </span>
//                       {selectedTimeZone === zone.id && <Check className="w-4 h-4 text-[#32A88D]" />}
//                     </button>
//                   ))
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { Globe, ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeZoneService, type TimeZoneOption } from "@/lib/timezone-service";

interface Props {
  selectedTimeZone: string;
  onSelect: (id: string) => void;
  customerId?: number;
  apiBaseUrl?: string;
  showHeader?: boolean; // إضافة خاصية اختيارية لعرض/إخفاء العنوان
  showIcon?: boolean; // إضافة خاصية اختيارية لعرض/إخفاء الأيقونة
}

export default function TimeZoneSelector({
  selectedTimeZone,
  onSelect,
  customerId,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
  showHeader = true, // القيمة الافتراضية true لعرض العنوان
  showIcon = true, // القيمة الافتراضية true لعرض الأيقونة
}: Props) {
  // الحالات (States)
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [timeZones, setTimeZones] = useState<TimeZoneOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrentZone, setUserCurrentZone] = useState("");

  useEffect(() => {
    async function loadTimeZones() {
      setLoading(true);
      try {
        // جلب المناطق الزمنية من الـ API، مع fallback
        let zones: TimeZoneOption[] = [];
        try {
          zones = await TimeZoneService.getTimeZonesFromAPI(apiBaseUrl);
        } catch (e) {
          zones = TimeZoneService.getFallbackTimeZones();
        }
        setTimeZones(zones);

        // اكتشاف منطقة المستخدم الحالية تلقائياً
        const detectedZone = TimeZoneService.detectUserTimeZone();
        setUserCurrentZone(detectedZone);

        if (!selectedTimeZone && detectedZone) {
          onSelect(detectedZone);
          // إرسال المنطقة التلقائية إلى الـ API
          if (customerId) {
            await updateTimezoneOnServer(detectedZone);
          }
        }
      } catch (error) {
        console.error("خطأ في تحميل المناطق الزمنية:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTimeZones();
  }, []);

  const updateTimezoneOnServer = async (zoneId: string) => {
    if (!customerId) {
      console.log("[v0] لا يوجد معرف عميل، لن يتم إرسال الطلب");
      return;
    }

    console.log("[v0] إرسال طلب تحديث المنطقة الزمنية:", {
      customer_id: customerId,
      timezone: zoneId,
      url: `${apiBaseUrl}/api/customer/update-timezone`,
    });

    try {
      const response = await fetch(
        `https://mednovacare.com/api/customer/update-timezone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            timezone: zoneId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("[v0] فشل تحديث المنطقة الزمنية:", data);
        throw new Error(data.message || "فشل تحديث المنطقة الزمنية");
      }

      console.log("[v0] تم تحديث المنطقة الزمنية بنجاح:", data);
      return data;
    } catch (error) {
      console.error("[v0] خطأ في تحديث المنطقة الزمنية:", error);
      throw error;
    }
  };

  const filteredZones = timeZones.filter(
    (zone) =>
      zone.label.toLowerCase().includes(search.toLowerCase()) ||
      zone.id.toLowerCase().includes(search.toLowerCase())
  );

  // الحصول على تسمية المنطقة المختارة
  const getSelectedLabel = () => {
    if (!selectedTimeZone) return "اختر المنطقة الزمنية";

    const zone = timeZones.find((t) => t.id === selectedTimeZone);
    if (!zone) return selectedTimeZone;

    return zone.label;
  };

  const handleSelectZone = async (zoneId: string) => {
    try {
      await updateTimezoneOnServer(zoneId);
      console.log("[v1] تم تحديث المنطقة الزمنية على الخادم بنجاح");

      onSelect(zoneId);
      setOpen(false);
      setSearch("");
    } catch (error) {
      console.error(
        "[v1] فشل تحديث المنطقة الزمنية، لن يتم تحديث الواجهة:",
        error
      );
    }
  };

  const handleUseMyLocation = () => {
    if (userCurrentZone) {
      handleSelectZone(userCurrentZone);
    }
  };

  return (
    <div className="space-y-3 mb-2">
      {/* العنوان - يتم عرضه فقط إذا كان showHeader = true */}
      {/* {(showHeader || userCurrentZone) && (
        <div className="flex items-center justify-between">
          {showHeader && (
            <div className="flex items-center gap-2">
              {showIcon && <Globe className="w-4 h-4 text-gray-600" />}
              <span className="text-sm font-medium text-gray-700">المنطقة الزمنية</span>
            </div>
          )}
          
          {userCurrentZone && (
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="cursor-pointer text-xs text-[#32A88D] hover:text-[#2a8a7a] transition-colors"
            >
              استخدام موقعي
            </button>
          )}
        </div>
      )} */}
      {userCurrentZone && (
        <div className="flex items-center">
          {showHeader && (
            <div className="flex items-center gap-2">
              {showIcon && <Globe className="w-4 h-4 text-gray-600" />}
              <span className="text-sm font-medium text-gray-700">
                المنطقة الزمنية
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleUseMyLocation}
            className="mr-auto cursor-pointer text-xs text-[#32A88D] hover:text-[#2a8a7a] transition-colors"
          >
            استخدام موقعي
          </button>
        </div>
      )}

      {/* الزر الرئيسي */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md hover:border-[#32A88D] hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            !showHeader && "mt-0" // إزالة الهامش العلوي إذا لم يكن هناك عنوان
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {loading ? (
              <span className="text-gray-500 text-sm">جاري التحميل...</span>
            ) : (
              <span className="text-gray-800 text-sm truncate">
                {getSelectedLabel()}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-500 transition-transform flex-shrink-0",
              open && "rotate-180"
            )}
          />
        </button>

        {/* القائمة المنسدلة */}
        {open && !loading && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-xl z-50 max-w-md">
              {/* شريط البحث */}
              <div className="p-3 border-b border-gray-100 sticky top-0 bg-white rounded-t-md">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن مدينة أو منطقة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D]"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {filteredZones.length} منطقة زمنية متاحة
                </div>
              </div>

              {/* قائمة المناطق */}
              <div className="max-h-64 overflow-y-auto">
                {filteredZones.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    لم يتم العثور على مناطق تطابق بحثك
                  </div>
                ) : (
                  filteredZones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectZone(zone.id);
                      }}
                      className={cn(
                        "w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group",
                        selectedTimeZone === zone.id && "bg-[#32A88D]/10"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm",
                          selectedTimeZone === zone.id
                            ? "text-[#32A88D] font-medium"
                            : "text-gray-700"
                        )}
                      >
                        {zone.label}
                      </span>
                      {selectedTimeZone === zone.id && (
                        <Check className="w-4 h-4 text-[#32A88D]" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
