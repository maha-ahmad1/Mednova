// "use client";

// import { useState } from "react";
// import { Search, MessageCircle, ChevronLeft, Clock } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import type { ConsultationRequest } from "@/types/consultation";
// import { getStatusBadge, getTypeIcon } from "@/lib/consultation-helpers";

// interface ConsultationListProps {
//   requests: ConsultationRequest[];
//   selectedRequest: ConsultationRequest | null;
//   onSelectRequest: (request: ConsultationRequest) => void;
//   isMobile: boolean;
//   onBackToList: () => void;
//   userRole: "patient" | "consultable" | undefined;
// }

// export default function ConsultationList({
//   requests,
//   selectedRequest,
//   onSelectRequest,
//   isMobile,
//   onBackToList,
//   userRole,
// }: ConsultationListProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState<"all" | "video" | "chat">("all");

//   const filteredRequests = requests.filter((request) => {
//     if (activeTab === "all") return true;
//     return request.type === activeTab;
//   });

//   const searchedRequests = filteredRequests.filter(
//     (request) =>
//       request.data.patient.full_name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       request.data.consultant.full_name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div
//       className={`lg:col-span-1 ${
//         isMobile && selectedRequest ? "hidden" : "block"
//       }`}
//     >
//       <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg">
//         <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
//               <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#32A88D]" />
//               طلبات الاستشارة
//               <Badge
//                 variant="outline"
//                 className="bg-[#32A88D]/10 text-[#32A88D] border-[#32A88D]/20 text-xs"
//               >
//                 {filteredRequests.length}
//               </Badge>
//             </CardTitle>

//             {isMobile && selectedRequest && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={onBackToList}
//                 className="lg:hidden"
//               >
//                 <ChevronLeft className="w-4 h-4 ml-1" />
//                 العودة
//               </Button>
//             )}
//           </div>

//           <div className="relative mt-3 sm:mt-4">
//             <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               type="text"
//               placeholder="ابحث باسم المريض أو الأعراض..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pr-10 bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#32A88D] focus:ring-[#32A88D] text-sm sm:text-base"
//             />
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           <Tabs
//             value={activeTab}
//             onValueChange={(value) =>
//               setActiveTab(value as "all" | "video" | "chat")
//             }
//             className="w-full"
//           >
//             <TabsList className="grid w-full grid-cols-3 p-1 sm:p-2 bg-gray-50 rounded-t-xl sm:rounded-t-2xl border-b border-gray-100">
//               <TabsTrigger
//                 value="video"
//                 className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
//               >
//                 فيديو
//               </TabsTrigger>
//               <TabsTrigger
//                 value="chat"
//                 className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
//               >
//                 محادثة
//               </TabsTrigger>
//               <TabsTrigger
//                 value="all"
//                 className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
//               >
//                 الكل
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value={activeTab} className="m-0">
//               <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
//                 {searchedRequests.length === 0 ? (
//                   <div className="text-center py-8 sm:py-12">
//                     <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
//                     <p className="text-gray-500 text-sm sm:text-base">
//                       {searchQuery
//                         ? "لا توجد نتائج للبحث"
//                         : "لا توجد طلبات استشارة"}
//                     </p>
//                   </div>
//                 ) : (
//                   searchedRequests.map((request) => {
//                     console.log("request.image", request.data.patient.image);
//                     // 🟢 تحديد المعروض حسب الدور
//                     const isPatient = userRole === "patient";
//                     const displayName = isPatient
//                       ? request.data.consultant.full_name
//                       : request.data.patient.full_name;
//                     const secondaryName = isPatient
//                       ? request.data.patient.full_name
//                       : request.data.consultant.full_name;

//                     const initials = displayName
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("");

//                     return (
//                       <div
//                         key={request.id}
//                         className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-md group ${
//                           selectedRequest?.id === request.id
//                             ? "bg-gradient-to-r from-[#32A88D]/5 to-white border-r-2 sm:border-r-4 border-r-[#32A88D] shadow-md"
//                             : ""
//                         }`}
//                         onClick={() => onSelectRequest(request)}
//                       >
//                         <div className="flex flex-row-reverse items-start gap-2 sm:gap-3">
//                           <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-200 group-hover:border-[#32A88D]/30 transition-colors duration-300">
//                             <img
//                               src={
//                                 isPatient
//                                   ? request.data.consultant.image ||
//                                     "/default-avatar.png"
//                                   : request.data.patient.image ||
//                                     "/default-avatar.png"
//                               }
//                               alt="صورة المستخدم"
//                               className="w-full h-full object-cover rounded-full"
//                               // onError={(e) => {
//                               //   (e.currentTarget as HTMLImageElement).src =
//                               //     "/default-avatar.png";
//                               // }}
//                             />
//                           </Avatar>

//                           <div className="flex-1 min-w-0">
//                             <div className="flex flex-row-reverse items-center justify-between mb-1 sm:mb-2">
//                               <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate group-hover:text-[#32A88D] transition-colors duration-200 text-right">
//                                 {displayName}
//                               </h3>
//                               <div className="flex flex-row-reverse items-center gap-1">
//                                 {getTypeIcon(request.type)}
//                                 <div className="scale-75 sm:scale-100 origin-right">
//                                   {getStatusBadge(request.status)}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* <p className="text-xs text-gray-600 line-clamp-2 mb-2 sm:mb-3 leading-relaxed text-right">
//                               {isPatient
//                                 ? `المريض: ${secondaryName}`
//                                 : `المعالج: ${secondaryName}`}
//                             </p> */}

//                             <div className="flex flex-row-reverse items-center justify-between">
//                               <div className="flex flex-row-reverse items-center gap-2 sm:gap-4 text-xs text-gray-500">
//                                 <span className="flex flex-row-reverse items-center gap-1 text-xs">
//                                   <Clock className="w-3 h-3" />
//                                   {new Date(
//                                     request.created_at
//                                   ).toLocaleDateString("ar-SA")}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// }
// components/ConsultationList.tsx

"use client";

import { useState } from "react";
import { Search, MessageCircle, ChevronLeft, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ConsultationRequest } from "@/types/consultation";
import {
  getStatusBadge,
  getTypeIcon,
  getRemainingTime,
} from "@/lib/consultation-helpers";

interface ConsultationListProps {
  requests: ConsultationRequest[];
  selectedRequest: ConsultationRequest | null;
  onSelectRequest: (request: ConsultationRequest) => void;
  isMobile: boolean;
  onBackToList: () => void;
  userRole: "patient" | "consultable" | undefined;
}

export default function ConsultationList({
  requests,
  selectedRequest,
  onSelectRequest,
  isMobile,
  onBackToList,
  userRole,
}: ConsultationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "video" | "chat">("all");

  const filteredRequests = requests.filter((request) => {
    if (request.status === "cancelled") {
      return false;
    }

    if (activeTab === "all") return true;
    return request.type === activeTab;
  });

  const searchedRequests = filteredRequests.filter(
    (request) =>
      request.data.patient.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.data.consultant.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`lg:col-span-1 ${
        isMobile && selectedRequest ? "hidden" : "block"
      }`}
    >
      <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#32A88D]" />
              طلبات الاستشارة
              <Badge
                variant="outline"
                className="bg-[#32A88D]/10 text-[#32A88D] border-[#32A88D]/20 text-xs"
              >
                {filteredRequests.length}
              </Badge>
            </CardTitle>

            {isMobile && selectedRequest && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToList}
                className="lg:hidden"
              >
                <ChevronLeft className="w-4 h-4 ml-1" />
                العودة
              </Button>
            )}
          </div>

          <div className="relative mt-3 sm:mt-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="ابحث باسم المريض أو الأعراض..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#32A88D] focus:ring-[#32A88D] text-sm sm:text-base"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "all" | "video" | "chat")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 p-1 sm:p-2 bg-gray-50 rounded-t-xl sm:rounded-t-2xl border-b border-gray-100">
              <TabsTrigger
                value="video"
                className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
              >
                فيديو
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
              >
                محادثة
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
              >
                الكل
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="m-0">
              <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                {searchedRequests.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">
                      {searchQuery
                        ? "لا توجد نتائج للبحث"
                        : "لا توجد طلبات استشارة"}
                    </p>
                  </div>
                ) : (
                  searchedRequests.map((request) => {
                    const isPatient = userRole === "patient";
                    const displayName = isPatient
                      ? request.data.consultant.full_name
                      : request.data.patient.full_name;

                    return (
                      <div
                        key={request.id}
                        className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-md group ${
                          selectedRequest?.id === request.id
                            ? "bg-gradient-to-r from-[#32A88D]/5 to-white border-r-2 sm:border-r-4 border-r-[#32A88D] shadow-md"
                            : ""
                        }`}
                        onClick={() => onSelectRequest(request)}
                      >
                        <div className="flex flex-row-reverse items-start gap-2 sm:gap-3">
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-200 group-hover:border-[#32A88D]/30 transition-colors duration-300">
                            <img
                              src={
                                isPatient
                                  ? request.data.consultant.image ||
                                    "/default-avatar.png"
                                  : request.data.patient.image ||
                                    "/default-avatar.png"
                              }
                              alt="صورة المستخدم"
                              className="w-full h-full object-cover rounded-full"
                            />
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-row-reverse items-center justify-between mb-1 sm:mb-2">
                              <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate group-hover:text-[#32A88D] transition-colors duration-200 text-right">
                                {displayName}
                              </h3>
                              <div className="flex flex-row-reverse items-center gap-1">
                                {getTypeIcon(request.type)}
                                <div className="scale-75 sm:scale-100 origin-right">
                                  {getStatusBadge(request.status)}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row-reverse items-center justify-between">
                              <div className="flex flex-row-reverse items-center gap-2 sm:gap-4 text-xs text-gray-500">
                                <span className="flex flex-row-reverse items-center gap-1 text-xs">
                                  <Clock className="w-3 h-3" />
                                  {/* {new Date(
                                    request.created_at
                                  ).toLocaleDateString("ar-SA")} */}
                                  {new Date(
                                    request.created_at
                                  ).toLocaleDateString("en-US")}
                                </span>

                                {/* <span className="text-gray-400">•</span> */}
                                {/* <span className="text-[#32A88D] font-medium">
                                  {getRemainingTime(request.created_at)}
                                </span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
