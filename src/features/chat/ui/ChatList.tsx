// // features/chat/ui/ChatList.tsx - الإصدار المحسن
// "use client";

// import { useState, useMemo } from "react";
// import { Search, MessageCircle, Clock, Filter } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { useCurrentChats } from "../hooks/useChatApi";
// import type { ChatRequest } from "@/types/chat";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";

// interface ChatListProps {
//   selectedChat: ChatRequest | null;
//   onSelectChat: (chat: ChatRequest) => void;
//   isMobile: boolean;
// }

// type FilterType = "all" | "unread" | "therapist" | "center";

// export default function ChatList({ selectedChat, onSelectChat, isMobile }: ChatListProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState<FilterType>("all");
//   const { data: chats = [], isLoading, error } = useCurrentChats();

//   const filteredChats = useMemo(() => {
//     let result = chats.filter(chat => 
//       chat.patient_full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       chat.consultant_full_name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     switch (filter) {
//       case "unread":
//         result = result.filter(chat => chat.unread_count > 0);
//         break;
//       case "therapist":
//         result = result.filter(chat => chat.consultant_type === "therapist");
//         break;
//       case "center":
//         result = result.filter(chat => chat.consultant_type === "rehabilitation_center");
//         break;
//       default:
//         break;
//     }

//     return result;
//   }, [chats, searchQuery, filter]);

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString("ar-SA", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="h-full flex flex-col">
//         <div className="p-4 border-b space-y-4">
//           <Skeleton className="h-6 w-32" />
//           <Skeleton className="h-10 w-full rounded-full" />
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {[...Array(8)].map((_, i) => (
//             <div key={i} className="flex items-center gap-3">
//               <Skeleton className="w-12 h-12 rounded-full" />
//               <div className="flex-1 space-y-2">
//                 <Skeleton className="h-4 w-3/4" />
//                 <Skeleton className="h-3 w-1/2" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center p-8 text-center">
//         <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
//         <h3 className="font-semibold text-gray-700 mb-2">خطأ في التحميل</h3>
//         <p className="text-gray-500 text-sm mb-4">
//           تعذر تحميل المحادثات. يرجى المحاولة مرة أخرى.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-white">
//       {/* رأس القائمة */}
//       <div className="p-4 border-b space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             <MessageCircle className="w-5 h-5 text-[#32A88D]" />
//             المحادثات
//           </h2>
//           <Badge className="bg-[#32A88D] text-white">
//             {filteredChats.length}
//           </Badge>
//         </div>

//         {/* شريط البحث */}
//         <div className="relative">
//           <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             placeholder="ابحث في المحادثات..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pr-10 bg-gray-50 border-gray-200 rounded-full focus:bg-white transition-colors"
//           />
//         </div>

//         {/* الفلتر */}
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-gray-400" />
//           <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
//             <SelectTrigger className="h-8 text-xs">
//               <SelectValue placeholder="جميع المحادثات" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">جميع المحادثات</SelectItem>
//               <SelectItem value="unread">غير المقروء</SelectItem>
//               <SelectItem value="therapist">معالجون</SelectItem>
//               <SelectItem value="center">مراكز تأهيل</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* قائمة المحادثات */}
//       <div className="flex-1 overflow-y-auto">
//         {filteredChats.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full p-8 text-center">
//             <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
//             <h3 className="font-semibold text-gray-700 mb-2">
//               {searchQuery || filter !== "all" ? "لا توجد نتائج" : "لا توجد محادثات"}
//             </h3>
//             <p className="text-gray-500 text-sm">
//               {searchQuery 
//                 ? "جرب البحث بمصطلحات مختلفة" 
//                 : "سيظهر هنا المحادثات عند بدئها"
//               }
//             </p>
//           </div>
//         ) : (
//           filteredChats.map((chat) => {
//             const isSelected = selectedChat?.id === chat.id;
//             const lastMessageTime = new Date(chat.updated_at);
//             const now = new Date();
//             const isToday = lastMessageTime.toDateString() === now.toDateString();
            
//             return (
//               <div
//                 key={chat.id}
//                 className={`p-4 border-b cursor-pointer transition-all duration-200 group hover:bg-gray-50 ${
//                   isSelected 
//                     ? "bg-[#32A88D]/10 border-r-4 border-[#32A88D] shadow-sm" 
//                     : "border-r-4 border-transparent"
//                 }`}
//                 onClick={() => onSelectChat(chat)}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <Avatar className="w-12 h-12 border-2 border-[#32A88D]/20 group-hover:border-[#32A88D] transition-colors">
//                       <AvatarImage 
//                         src={chat.patient_image || chat.consultant_image || "/default-avatar.png"} 
//                       />
//                       <AvatarFallback className="bg-[#32A88D]/10 text-[#32A88D]">
//                         {chat.patient_full_name?.charAt(0) || chat.consultant_full_name?.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     {chat.unread_count > 0 && (
//                       <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-white">
//                         {chat.unread_count}
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start mb-1">
//                       <h3 className="font-semibold text-gray-800 truncate text-sm">
//                         {chat.patient_full_name || chat.consultant_full_name}
//                       </h3>
//                       <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
//                         <Clock className="w-3 h-3" />
//                         {isToday ? formatTime(chat.updated_at) : lastMessageTime.toLocaleDateString("ar-SA")}
//                       </span>
//                     </div>
                    
//                     <p className="text-sm text-gray-600 truncate mb-1">
//                       {chat.last_message || "لا توجد رسائل بعد"}
//                     </p>
                    
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                         {chat.consultant_type === "therapist" ? "معالج" : "مركز تأهيل"}
//                       </span>
//                       {chat.is_online && (
//                         <div className="flex items-center gap-1">
//                           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                           <span className="text-xs text-green-600">متصل</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }