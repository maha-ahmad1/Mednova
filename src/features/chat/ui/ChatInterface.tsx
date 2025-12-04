// "use client";
// import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
// import { useSession } from "next-auth/react";
// import {
//   Send,
//   Loader2,
//   ArrowRight,
//   Paperclip,
//   Image as ImageIcon,
//   File,
//   X,
//   Download,
//   FileIcon,
// } from "lucide-react";
// import NextImage from "next/image";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   useMessages,
//   useSendMessage,
//   useMarkAsRead,
// } from "../hooks/useChatApi";
// import { useChatPusher } from "../hooks/useChatPusher";
// import type { ChatRequest, Message, SendMessageData } from "@/types/chat";
// import { logger } from "@/lib/logger";
// import { useQueryClient } from "@tanstack/react-query";
// import { Virtuoso } from "react-virtuoso";

// interface ChatInterfaceProps {
//   chatRequest: ChatRequest;
//   onBack?: () => void;
// }

// // مكون فرعي للرسالة لتحسين الأداء
// const MessageBubble = memo(
//   ({
//     message,
//     isMyMessage,
//     formatTime,
//   }: {
//     message: Message;
//     isMyMessage: boolean;
//     formatTime: (date: string) => string;
//   }) => {
//     const isOptimistic = message.status === "sending";
//     return (
//       <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
//         <div
//           className={`flex items-end gap-2 max-w-[75%] ${
//             isMyMessage ? "flex-row-reverse" : "flex-row"
//           }`}
//         >
//           <div
//             className={`px-3 py-2 text-sm rounded-2xl shadow-sm whitespace-pre-wrap ${
//               isMyMessage
//                 ? "bg-[#DCF8C6] rounded-br-none"
//                 : "bg-white rounded-bl-none"
//             }`}
//           >
//             <p>{message.message}</p>
//             {message.attachment && message.attachment_type === "image" && (
//               <div className="mt-2">
//                 <NextImage
//                   src={
//                     typeof message.attachment === "string"
//                       ? message.attachment
//                       : ""
//                   }
//                   alt="attachment"
//                   width={200}
//                   height={120}
//                   className="rounded-md object-cover"
//                 />
//               </div>
//             )}

//             {message.attachment && message.attachment_type !== "image" && (
//               <div className="mt-2">
//                 <a
//                   href={
//                     typeof message.attachment === "string"
//                       ? message.attachment
//                       : "#"
//                   }
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-sm text-blue-600 underline"
//                 >
//                   ملف مرفق
//                 </a>
//               </div>
//             )}
//             <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-600">
//               {isOptimistic ? (
//                 <span className="text-gray-400">-:-</span>
//               ) : (
//                 <>{formatTime(message.created_at)}</>
//               )}

//               {isMyMessage && (
//                 <span
//                   className={`mr-1 flex items-center ${
//                     message.is_read ? "text-blue-600" : "text-gray-400"
//                   }`}
//                 >
//                   {message.is_read ? <span>✓✓</span> : <span>✓</span>}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// MessageBubble.displayName = "MessageBubble";

// function ChatInterface({ chatRequest, onBack }: ChatInterfaceProps) {
//   const { data: session } = useSession();
//   const queryClient = useQueryClient();
//   const [newMessage, setNewMessage] = useState("");
//   const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [showUploadMenu, setShowUploadMenu] = useState<boolean>(false);
//   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const lastProcessedRef = useRef<number>(0);
//   const markAsReadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
//   const virtuosoRef = useRef<any>(null);

//   const { data: messages = [], isLoading, error } = useMessages(chatRequest.id);
//   const sendMessageMutation = useSendMessage();
//   const markAsReadMutation = useMarkAsRead();
//   console.log("messages", messages);

//   const whatsappBg = {
//   backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2332a88d' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
// };
//   // استخدام useChatPusher
//   useChatPusher(
//     chatRequest.id,
//     chatRequest.patient_id,
//     chatRequest.consultant_id
//   );

//   const currentUserId = session?.user?.id;
//   const isPatient = session?.role === "patient";

//   // 🔥 دمج الرسائل من الـ cache والرسائل المتفائلة
//   const allMessages = useMemo(() => {
//     const merged = [...messages, ...optimisticMessages];

//     // إزالة التكرارات بناءً على id
//     const uniqueMessages = merged.reduce<Message[]>((acc, current) => {
//       const exists = acc.find((msg) => msg.id === current.id);
//       if (!exists) {
//         acc.push(current);
//       }
//       return acc;
//     }, []);

//     // ترتيب حسب التاريخ
//     return uniqueMessages.sort(
//       (a, b) =>
//         new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//     );
//   }, [messages, optimisticMessages]);

//   // 🔥 مراقبة تغييرات الرسائل
//   useEffect(() => {
//     logger.info("📊 تحديث قائمة الرسائل في الواجهة", {
//       fromCache: messages.length,
//       optimistic: optimisticMessages.length,
//       total: allMessages.length,
//     });
//   }, [messages.length, optimisticMessages.length, allMessages.length]);

//   // 🔥 فحص حالة الـ cache
//   useEffect(() => {
//     const queryCache = queryClient.getQueryData<Message[]>([
//       "messages",
//       chatRequest.id,
//     ]);
//     logger.info("🔍 فحص حالة الـ cache الحالية:", {
//       chatRequestId: chatRequest.id,
//       messagesInCache: queryCache?.length || 0,
//       messagesInUI: allMessages.length,
//     });
//   }, [allMessages.length, chatRequest.id, queryClient]);

//   const otherUser = useMemo(
//     () =>
//       isPatient
//         ? {
//             id: chatRequest.consultant_id,
//             name: chatRequest.consultant_full_name,
//             type: chatRequest.consultant_type,
//             image: chatRequest.consultant_image || "/default-avatar.png",
//           }
//         : {
//             id: chatRequest.patient_id,
//             name: chatRequest.patient_full_name,
//             type: "patient",
//             image: chatRequest.patient_image || "/default-avatar.png",
//           },
//     [
//       isPatient,
//       chatRequest.consultant_id,
//       chatRequest.consultant_full_name,
//       chatRequest.consultant_type,
//       chatRequest.consultant_image,
//       chatRequest.patient_id,
//       chatRequest.patient_full_name,
//       chatRequest.patient_image,
//     ]
//   );

//   const formatTime = useCallback((dateString: string) => {
//     try {
//       // إذا كان التنسيق يحتوي على "PM" أو "AM" (تنسيق الوقت فقط)
//       if (dateString.includes("PM") || dateString.includes("AM")) {
//         return dateString; // إرجاع الوقت كما هو
//       }

//       // إذا كان تنسيق ISO صالح
//       const date = new Date(dateString);
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleTimeString("ar-SA", {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//       }

//       // إذا فشل كل شيء، إرجاع قيمة افتراضية
//       return "--:--";
//     } catch (error) {
//       console.error("Error formatting time:", error);
//       return "--:--";
//     }
//   }, []);
//   // التمرير إلى آخر رسالة
//   const scrollToBottom = useCallback(() => {
//     if (virtuosoRef.current && allMessages.length > 0) {
//       setTimeout(() => {
//         virtuosoRef.current.scrollToIndex({
//           index: allMessages.length - 1,
//           behavior: "smooth",
//         });
//       }, 50);
//     }
//   }, [allMessages.length]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [allMessages, scrollToBottom]);

//   // دالة لعرض كل رسالة في Virtuoso
//   const messageRenderer = useCallback(
//     (index: number, message: Message) => {
//       const senderId =
//         typeof message.sender_id === "object"
//           ? message.sender_id.id
//           : message.sender_id;

//       const isMyMessage = Number(senderId) === Number(currentUserId);

//       return (
//         <MessageBubble
//           key={message.id}
//           message={message}
//           isMyMessage={isMyMessage}
//           formatTime={formatTime}
//         />
//       );
//     },
//     [currentUserId, formatTime]
//   );

//   // معالجة الرسائل غير المقروءة
//   useEffect(() => {
//     if (!allMessages || !currentUserId) return;

//     // إلغاء أي timeout سابق
//     if (markAsReadTimeoutRef.current) {
//       clearTimeout(markAsReadTimeoutRef.current);
//     }

//     markAsReadTimeoutRef.current = setTimeout(() => {
//       const now = Date.now();
//       if (now - lastProcessedRef.current < 500) {
//         return;
//       }

//       const unreadSenders = new Set<number>();

//       allMessages.forEach((msg) => {
//         const senderId =
//           typeof msg.sender_id === "object" ? msg.sender_id.id : msg.sender_id;
//         const receiverId =
//           typeof msg.receiver_id === "object"
//             ? msg.receiver_id.id
//             : msg.receiver_id;

//         if (
//           Number(senderId) !== Number(currentUserId) &&
//           Number(receiverId) === Number(currentUserId) &&
//           !msg.is_read
//         ) {
//           unreadSenders.add(Number(senderId));
//         }
//       });

//       if (unreadSenders.size > 0) {
//         logger.info(
//           "🔄 تعليم رسائل المرسلين كمقروءة:",
//           Array.from(unreadSenders)
//         );

//         lastProcessedRef.current = now;

//         unreadSenders.forEach((senderId) => {
//           markAsReadMutation.mutate(senderId, {
//             onError: (error) => {
//               logger.error(`فشل في تعليم رسائل المرسل ${senderId}:`, error);
//             },
//           });
//         });
//       }
//     }, 300);

//     return () => {
//       if (markAsReadTimeoutRef.current) {
//         clearTimeout(markAsReadTimeoutRef.current);
//       }
//     };
//   }, [allMessages, currentUserId, markAsReadMutation]);

//   // 🔥 إضافة رسالة متفائلة عند الإرسال
//   const handleSendMessage = async () => {
//     if ((!newMessage.trim() && !selectedFile) || !currentUserId) return;

//     const tempId = Date.now();
//     const tempMessage: Message = {
//       // id: Date.now(), // ID مؤقت
//       id: tempId,
//       message: newMessage.trim(),
//       sender_id: Number(currentUserId),
//       receiver_id: otherUser.id,
//       chat_request_id: chatRequest.id,
//       is_read: false,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       attachment: selectedPreview || null,
//       attachment_type: selectedFile
//         ? selectedFile.type.startsWith("image/")
//           ? "image"
//           : "file"
//         : null,
//       read_at: null,
//       status: "sending",
//       deleted_at: null,
//     };

//     // 🔥 إضافة الرسالة المتفائلة
//     setOptimisticMessages((prev) => [...prev, tempMessage]);
//     setNewMessage("");
//     // scrollToBottom();

//     try {
//       // إذا كان لدينا ملف محدد، استخدم FormData
//       let realMessage: Message;
//       if (selectedFile) {
//         const form = new FormData();
//         form.append("receiver_id", String(otherUser.id));
//         form.append("message", newMessage.trim());
//         form.append("chat_request_id", String(chatRequest.id));
//         form.append("attachment", selectedFile);
//         const attType = selectedFile.type.startsWith("image/")
//           ? "image"
//           : "file";
//         form.append("attachment_type", attType);

//         type SendPayload =
//           | SendMessageData
//           | FormData
//           | {
//               formData: FormData;
//               onUploadProgress?: (ev?: unknown) => void;
//               chat_request_id?: number;
//             };

//         const payload: SendPayload = {
//           formData: form,
//           onUploadProgress: (ev?: unknown) => {
//             if (!ev || typeof ev !== "object") return;
//             // try to read loaded/total in a safe way
//             const maybe = ev as { loaded?: number; total?: number };
//             const loaded = typeof maybe.loaded === "number" ? maybe.loaded : 0;
//             const total = typeof maybe.total === "number" ? maybe.total : 0;
//             if (total) {
//               const percent = Math.round((loaded / total) * 100);
//               setUploadProgress(percent);
//             }
//           },
//         };

//         realMessage = (await sendMessageMutation.mutateAsync(
//           payload
//         )) as Message;
//       } else {
//         realMessage = (await sendMessageMutation.mutateAsync({
//           receiver_id: otherUser.id,
//           message: newMessage.trim(),
//           chat_request_id: chatRequest.id,
//         })) as Message;
//       }

//       // 🔥 إزالة الرسالة المتفائلة بعد النجاح
//       // setOptimisticMessages((prev) =>
//       //   prev.filter((msg) => msg.id !== tempMessage.id)
//       // );

//       setOptimisticMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === tempId
//             ? { ...realMessage, status: "sent" } // 🔥 استبدال بالرسالة الحقيقية
//             : msg
//         )
//       );
//       // تنظيف الملف المحدد والمعاينة
//       setSelectedFile(null);
//       if (selectedPreview) {
//         URL.revokeObjectURL(selectedPreview);
//       }
//       setSelectedPreview(null);
//     } catch (error) {
//       logger.error("فشل في إرسال الرسالة:", error);
//       // 🔥 إزالة الرسالة المتفائلة في حالة الخطأ
//       //  setOptimisticMessages((prev) =>
//       //   prev.filter((msg) => msg.id !== tempMessage.id)
//       // );
//       setOptimisticMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === tempId ? { ...msg, status: "failed" } : msg
//         )
//       );
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // إدارة تغيير الملف واختصارات المعاينة
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     if (!file) return;

//     // validate size
//     if (file.size > MAX_FILE_SIZE) {
//       toast.error("حجم الملف أكبر من الحد المسموح (10MB)");
//       e.currentTarget.value = ""; // 🔥 مسح قيمة الـ input
//       return;
//     }

//     // 🔥 تنظيف الملف السابق إذا كان موجوداً
//     if (selectedPreview) {
//       URL.revokeObjectURL(selectedPreview);
//     }

//     setSelectedFile(file);
//     // create preview URL for both images and files
//     const url = URL.createObjectURL(file);
//     setSelectedPreview(url);
//     setShowUploadMenu(false);

//     // 🔥 إعادة تعيين تقدم الرفع
//     setUploadProgress(0);
//   };
//   useEffect(() => {
//     return () => {
//       if (selectedPreview) {
//         URL.revokeObjectURL(selectedPreview);
//       }
//     };
//   }, [selectedPreview]);

//   const handleRemoveFile = () => {
//     // 🔥 تنظيف المعاينة
//     if (selectedPreview) {
//       URL.revokeObjectURL(selectedPreview);
//       setSelectedPreview(null);
//     }

//     setSelectedFile(null);
//     setUploadProgress(0);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const openFilePicker = (type: "image" | "file") => {
//     if (!fileInputRef.current) return;

//     // 🔥 مسح الملفات المحددة مسبقاً
//     fileInputRef.current.value = "";

//     if (type === "image") {
//       fileInputRef.current.accept = "image/*";
//     } else {
//       fileInputRef.current.accept = "*/*"; // 🔥 تغيير ليقبل جميع الملفات
//     }

//     setShowUploadMenu(false);
//     fileInputRef.current.click();
//   };

//   if (error) {
//     return (
//       <Card className="h-full">
//         <CardContent className="flex flex-col items-center justify-center h-64">
//           <div className="text-red-500 text-center">
//             <div className="text-lg font-semibold mb-2">
//               خطأ في تحميل المحادثة
//             </div>
//             <Button variant="outline" onClick={() => window.location.reload()}>
//               إعادة المحاولة
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (isLoading) {
//     return (
//       <Card className="h-full">
//         <CardContent className="flex items-center justify-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin text-[#32A88D]" />
//           <span className="mr-2">جاري تحميل المحادثة...</span>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="h-full flex flex-col">
//       <CardHeader className="border-b bg-gray-50 py-4">
//         <div className="flex items-center gap-3">
//           {onBack && (
//             <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           )}

//           <Avatar className="w-10 h-10 border-2 border-[#32A88D]">
//             <AvatarImage src={otherUser.image} />
//             <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
//           </Avatar>

//           <div>
//             <div className="font-semibold">{otherUser.name}</div>
//             <div className="text-sm text-gray-500">
//               {otherUser.type === "therapist"
//                 ? "معالج"
//                 : otherUser.type === "rehabilitation_center"
//                 ? "مركز تأهيل"
//                 : "مريض"}
//             </div>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="flex-1 p-0 flex flex-col">
//           <div className="flex-1 overflow-y-auto p-4 space-y-3"  style={whatsappBg}>
//           {allMessages.length > 0 ? (
//             <Virtuoso
//               ref={virtuosoRef}
//               data={allMessages}
//               itemContent={messageRenderer}
//               initialTopMostItemIndex={allMessages.length - 1}
//               followOutput={"auto"}
//               alignToBottom={true}
//               overscan={20}
//               className="h-full"
//               components={{
//                 // تحسينات للأداء
//                 EmptyPlaceholder: () => (
//                   <div className="flex items-center justify-center h-32 text-gray-500">
//                     لا توجد رسائل بعد
//                   </div>
//                 )
//               }}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               لا توجد رسائل بعد
//             </div>
//           )}
//         </div>

//         <div className="border-t bg-white p-3">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowUploadMenu((s) => !s)}
//                 className="p-2"
//               >
//                 <Paperclip className="w-4 h-4" />
//               </Button>

//               {showUploadMenu && (
//                 <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 min-w-[180px] backdrop-blur-sm">
//                   {/* العنوان */}
//                   <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-700">
//                       إرفاق ملف
//                     </span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setShowUploadMenu(false)}
//                       className="h-6 w-6 p-0 hover:bg-gray-100"
//                     >
//                       <X className="w-3 h-3" />
//                     </Button>
//                   </div>

//                   {/* خيارات الرفع */}
//                   <div className="space-y-2">
//                     {/* خيار الصور */}
//                     <button
//                       onClick={() => openFilePicker("image")}
//                       className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#32A88D]/10 transition-colors duration-200 border border-transparent hover:border-[#32A88D]/20"
//                       type="button"
//                     >
//                       <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
//                         <ImageIcon className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <div className="flex-1 text-right">
//                         <div className="text-sm font-medium text-gray-800">
//                           صورة
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           JPG, PNG, GIF
//                         </div>
//                       </div>
//                     </button>

//                     {/* خيار الملفات */}
//                     <button
//                       onClick={() => openFilePicker("file")}
//                       className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#32A88D]/10 transition-colors duration-200 border border-transparent hover:border-[#32A88D]/20"
//                       type="button"
//                     >
//                       <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
//                         <File className="w-5 h-5 text-green-600" />
//                       </div>
//                       <div className="flex-1 text-right">
//                         <div className="text-sm font-medium text-gray-800">
//                           ملف
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           PDF, DOC, ZIP
//                         </div>
//                       </div>
//                     </button>
//                   </div>

//                   {/* تذييل */}
//                   <div className="mt-3 pt-2 border-t border-gray-100">
//                     <p className="text-xs text-gray-500 text-center">
//                       الحجم الأقصى: 10MB
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* معاينة الصور */}
//             {selectedPreview &&
//               selectedFile &&
//               selectedFile.type.startsWith("image/") && (
//                 <div className="mr-2 relative group">
//                   <div className="relative">
//                     <NextImage
//                       src={selectedPreview}
//                       alt="preview"
//                       width={60}
//                       height={60}
//                       className="w-15 h-15 object-cover rounded-lg border-2 border-[#32A88D]"
//                     />
//                     <button
//                       onClick={handleRemoveFile}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg transition-transform hover:scale-110"
//                       type="button"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>
//                 </div>
//               )}

//             {/* معاينة الملفات */}
//             {selectedPreview &&
//               selectedFile &&
//               !selectedFile.type.startsWith("image/") && (
//                 <div className="mr-2 flex items-center gap-3 border border-[#32A88D]/20 rounded-xl p-3 bg-[#32A88D]/5">
//                   <div className="flex items-center justify-center w-12 h-12 bg-[#32A88D] rounded-lg">
//                     <FileIcon className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="flex-1 text-right">
//                     <div className="font-medium text-sm text-gray-800 truncate max-w-[120px]">
//                       {selectedFile.name}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {(selectedFile.size / 1024).toFixed(1)} KB
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-center gap-2">
//                     <a
//                       href={selectedPreview}
//                       download={selectedFile.name}
//                       className="text-[#32A88D] hover:text-[#2a8f7a] transition-colors"
//                       title="تحميل"
//                     >
//                       <Download className="w-4 h-4" />
//                     </a>
//                     <button
//                       onClick={handleRemoveFile}
//                       className="text-red-500 hover:text-red-600 transition-colors"
//                       title="حذف"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               )}

//             {/* upload progress */}
//             {uploadProgress > 0 && uploadProgress < 100 && (
//               <div className="w-full mr-2">
//                 <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className="h-1 bg-[#32A88D]"
//                     style={{ width: `${uploadProgress}%` }}
//                   />
//                 </div>
//                 <div className="text-xs text-gray-500 text-right">
//                   تحميل {uploadProgress}%
//                 </div>
//               </div>
//             )}

//             <Textarea
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="اكتب رسالة..."
//               className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-2xl bg-gray-100 border-none focus-visible:ring-0 px-4 py-3"
//               rows={1}
//             />

//             <Button
//               onClick={handleSendMessage}
//               disabled={
//                 (!newMessage.trim() && !selectedFile) ||
//                 sendMessageMutation.isPending
//               }
//               className="rounded-full h-10 w-10 p-0 bg-[#32A88D] hover:bg-[#2a8f7a]"
//             >
//               {sendMessageMutation.isPending ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Send className="w-4 h-4" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default memo(ChatInterface);

// "use client";
// import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
// import { useSession } from "next-auth/react";
// import { Send, Loader2, ArrowRight, Paperclip, Image as ImageIcon, File, X, Download, FileIcon } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useMessages, useSendMessage, useMarkAsRead } from "../hooks/useChatApi";
// import { useChatPusher } from "../hooks/useChatPusher";
// import type { ChatRequest, Message, SendMessageData } from "@/types/chat";
// import { logger } from "@/lib/logger";
// import { useQueryClient } from "@tanstack/react-query";
// import { Virtuoso } from "react-virtuoso";
// import { MessageBubble } from "./MessageBubble";
// import { ChatHeader } from "./ChatHeader";
// import { MessageInput } from "./MessageInput";
// import { FileUploadMenu } from "./FileUploadMenu";
// import { FilePreview } from "./FilePreview";

// interface ChatInterfaceProps {
//   chatRequest: ChatRequest;
//   onBack?: () => void;
// }

// function ChatInterface({ chatRequest, onBack }: ChatInterfaceProps) {
//   const { data: session } = useSession();
//   const queryClient = useQueryClient();
//   const [newMessage, setNewMessage] = useState("");
//   const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [showUploadMenu, setShowUploadMenu] = useState<boolean>(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const lastProcessedRef = useRef<number>(0);
//   const markAsReadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
//   const virtuosoRef = useRef<any>(null);

//   const { data: messages = [], isLoading, error } = useMessages(chatRequest.id);
//   const sendMessageMutation = useSendMessage();
//   const markAsReadMutation = useMarkAsRead();

//   useChatPusher(chatRequest.id, chatRequest.patient_id, chatRequest.consultant_id);

//   const currentUserId = session?.user?.id;
//   const isPatient = session?.role === "patient";

//   const allMessages = useMemo(() => {
//     const merged = [...messages, ...optimisticMessages];
//     const uniqueMessages = merged.reduce<Message[]>((acc, current) => {
//       const exists = acc.find((msg) => msg.id === current.id);
//       if (!exists) acc.push(current);
//       return acc;
//     }, []);

//     return uniqueMessages.sort(
//       (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//     );
//   }, [messages, optimisticMessages]);

//   const otherUser = useMemo(() =>
//     isPatient
//       ? {
//           id: chatRequest.consultant_id,
//           name: chatRequest.consultant_full_name,
//           type: chatRequest.consultant_type,
//           image: chatRequest.consultant_image || "/default-avatar.png",
//         }
//       : {
//           id: chatRequest.patient_id,
//           name: chatRequest.patient_full_name,
//           type: "patient",
//           image: chatRequest.patient_image || "/default-avatar.png",
//         },
//     [isPatient, chatRequest]
//   );

//   const scrollToBottom = useCallback(() => {
//     if (virtuosoRef.current && allMessages.length > 0) {
//       setTimeout(() => {
//         virtuosoRef.current.scrollToIndex({
//           index: allMessages.length - 1,
//           behavior: "smooth",
//         });
//       }, 50);
//     }
//   }, [allMessages.length]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [allMessages, scrollToBottom]);

//   const messageRenderer = useCallback(
//     (index: number, message: Message) => {
//       const senderId = typeof message.sender_id === "object" ? message.sender_id.id : message.sender_id;
//       const isMyMessage = Number(senderId) === Number(currentUserId);

//       return (
//         <MessageBubble
//           key={message.id}
//           message={message}
//           isMyMessage={isMyMessage}
//         />
//       );
//     },
//     [currentUserId]
//   );

//   // معالجة الرسائل غير المقروءة
//   useEffect(() => {
//     if (!allMessages || !currentUserId) return;

//     if (markAsReadTimeoutRef.current) {
//       clearTimeout(markAsReadTimeoutRef.current);
//     }

//     markAsReadTimeoutRef.current = setTimeout(() => {
//       const now = Date.now();
//       if (now - lastProcessedRef.current < 500) return;

//       const unreadSenders = new Set<number>();
//       allMessages.forEach((msg) => {
//         const senderId = typeof msg.sender_id === "object" ? msg.sender_id.id : msg.sender_id;
//         const receiverId = typeof msg.receiver_id === "object" ? msg.receiver_id.id : msg.receiver_id;

//         if (
//           Number(senderId) !== Number(currentUserId) &&
//           Number(receiverId) === Number(currentUserId) &&
//           !msg.is_read
//         ) {
//           unreadSenders.add(Number(senderId));
//         }
//       });

//       if (unreadSenders.size > 0) {
//         lastProcessedRef.current = now;
//         unreadSenders.forEach((senderId) => {
//           markAsReadMutation.mutate(senderId);
//         });
//       }
//     }, 300);

//     return () => {
//       if (markAsReadTimeoutRef.current) {
//         clearTimeout(markAsReadTimeoutRef.current);
//       }
//     };
//   }, [allMessages, currentUserId, markAsReadMutation]);

//   const handleSendMessage = async () => {
//     if ((!newMessage.trim() && !selectedFile) || !currentUserId) return;

//     const tempId = Date.now();
//     const tempMessage: Message = {
//       id: tempId,
//       message: newMessage.trim(),
//       sender_id: Number(currentUserId),
//       receiver_id: otherUser.id,
//       chat_request_id: chatRequest.id,
//       is_read: false,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       attachment: selectedPreview || null,
//       attachment_type: selectedFile
//         ? selectedFile.type.startsWith("image/") ? "image" : "file"
//         : null,
//       read_at: null,
//       status: "sending",
//       deleted_at: null,
//     };

//     setOptimisticMessages((prev) => [...prev, tempMessage]);
//     setNewMessage("");

//     try {
//       let realMessage: Message;

//       if (selectedFile) {
//         const form = new FormData();
//         form.append("receiver_id", String(otherUser.id));
//         form.append("message", newMessage.trim());
//         form.append("chat_request_id", String(chatRequest.id));
//         form.append("attachment", selectedFile);
//         const attType = selectedFile.type.startsWith("image/") ? "image" : "file";
//         form.append("attachment_type", attType);

//         const payload = {
//           formData: form,
//           onUploadProgress: (ev?: unknown) => {
//             if (!ev || typeof ev !== "object") return;
//             const maybe = ev as { loaded?: number; total?: number };
//             const loaded = typeof maybe.loaded === "number" ? maybe.loaded : 0;
//             const total = typeof maybe.total === "number" ? maybe.total : 0;
//             if (total) {
//               const percent = Math.round((loaded / total) * 100);
//               setUploadProgress(percent);
//             }
//           },
//         };

//         realMessage = await sendMessageMutation.mutateAsync(payload) as Message;
//       } else {
//         realMessage = await sendMessageMutation.mutateAsync({
//           receiver_id: otherUser.id,
//           message: newMessage.trim(),
//           chat_request_id: chatRequest.id,
//         }) as Message;
//       }

//       setOptimisticMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === tempId ? { ...realMessage, status: "sent" } : msg
//         )
//       );

//       handleRemoveFile();
//     } catch (error) {
//       logger.error("فشل في إرسال الرسالة:", error);
//       setOptimisticMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === tempId ? { ...msg, status: "failed" } : msg
//         )
//       );
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     if (!file) return;

//     if (file.size > MAX_FILE_SIZE) {
//       toast.error("حجم الملف أكبر من الحد المسموح (10MB)");
//       e.currentTarget.value = "";
//       return;
//     }

//     if (selectedPreview) URL.revokeObjectURL(selectedPreview);

//     setSelectedFile(file);
//     const url = URL.createObjectURL(file);
//     setSelectedPreview(url);
//     setShowUploadMenu(false);
//     setUploadProgress(0);
//   };

//   const handleRemoveFile = () => {
//     if (selectedPreview) {
//       URL.revokeObjectURL(selectedPreview);
//       setSelectedPreview(null);
//     }
//     setSelectedFile(null);
//     setUploadProgress(0);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const openFilePicker = (type: "image" | "file") => {
//     if (!fileInputRef.current) return;
//     fileInputRef.current.value = "";
//     fileInputRef.current.accept = type === "image" ? "image/*" : "*/*";
//     setShowUploadMenu(false);
//     fileInputRef.current.click();
//   };

//   if (error) {
//     return (
//       <Card className="h-full">
//         <CardContent className="flex flex-col items-center justify-center h-64">
//           <div className="text-red-500 text-center">
//             <div className="text-lg font-semibold mb-2">خطأ في تحميل المحادثة</div>
//             <Button variant="outline" onClick={() => window.location.reload()}>
//               إعادة المحاولة
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (isLoading) {
//     return (
//       <Card className="h-full">
//         <CardContent className="flex items-center justify-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin text-[#32A88D]" />
//           <span className="mr-2">جاري تحميل المحادثة...</span>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="h-full flex flex-col">
//       <ChatHeader
//         otherUser={otherUser}
//         onBack={onBack}
//       />

//       <CardContent className="flex-1 p-0 flex flex-col">
//         <div className="flex-1 overflow-y-auto p-4 space-y-3" style={whatsappBg}>
//           {allMessages.length > 0 ? (
//             <Virtuoso
//               ref={virtuosoRef}
//               data={allMessages}
//               itemContent={messageRenderer}
//               initialTopMostItemIndex={allMessages.length - 1}
//               followOutput={"auto"}
//               alignToBottom={true}
//               overscan={20}
//               className="h-full"
//               components={{
//                 EmptyPlaceholder: () => (
//                   <div className="flex items-center justify-center h-32 text-gray-500">
//                     لا توجد رسائل بعد
//                   </div>
//                 )
//               }}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               لا توجد رسائل بعد
//             </div>
//           )}
//         </div>

//         <MessageInput
//           newMessage={newMessage}
//           setNewMessage={setNewMessage}
//           selectedFile={selectedFile}
//           selectedPreview={selectedPreview}
//           uploadProgress={uploadProgress}
//           showUploadMenu={showUploadMenu}
//           fileInputRef={fileInputRef}
//           onSendMessage={handleSendMessage}
//           onFileChange={handleFileChange}
//           onRemoveFile={handleRemoveFile}
//           onOpenFilePicker={openFilePicker}
//           onSetShowUploadMenu={setShowUploadMenu}
//           isSending={sendMessageMutation.isPending}
//         />
//       </CardContent>
//     </Card>
//   );
// }

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
// const whatsappBg = {
//   backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2332a88d' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
// };

// export default memo(ChatInterface);

"use client";
import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from "../hooks/useChatApi";
import { useChatPusher } from "../hooks/useChatPusher";
import type { ChatRequest, Message, SendMessageData } from "@/types/chat";
import { logger } from "@/lib/logger";
import { useQueryClient } from "@tanstack/react-query";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";

interface ChatInterfaceProps {
  chatRequest: ChatRequest;
  onBack?: () => void;
}

function ChatInterface({ chatRequest, onBack }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showUploadMenu, setShowUploadMenu] = useState<boolean>(false);
  const [shouldFollowOutput, setShouldFollowOutput] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastProcessedRef = useRef<number>(0);
  const markAsReadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [cursorsHistory, setCursorsHistory] = useState<string[]>([]);
  //const { data: messages = [], isLoading, error } = useMessages(chatRequest.id);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(chatRequest.id);

  const messages = useMemo(() => {
    if (!data || !data.pages) return [];

    console.log("📊 تحليل صفحات البيانات:", {
      totalPages: data.pages.length,
      pages: data.pages.map((page, idx) => ({
        pageIndex: idx,
        messageCount: page?.data?.length || 0,
        hasNextCursor: !!page?.next_cursor,
      })),
    });

    // دمج كل الرسائل من جميع الصفحات مع الاحتفاظ بالترتيب
    const allMessages = data.pages.flatMap((page) => {
      if (!page || !page.data) return [];
      return page.data;
    });

    console.log(`✅ إجمالي الرسائل المحملة: ${allMessages.length}`);

    // إزالة التكرارات بناءً على ID
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg.id, msg])).values()
    );
    
  return uniqueMessages.reverse();

    // ترتيب من الأقدم للأحدث
    // return uniqueMessages.sort(
    //   (a, b) =>
    //     new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    // );
    
  }, [data]);

  console.log("Loaded messages:", messages);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  useChatPusher(
    chatRequest.id,
    chatRequest.patient_id,
    chatRequest.consultant_id
  );

  const currentUserId = session?.user?.id;
  const isPatient = session?.role === "patient";
  const otherUser = useMemo(
    () =>
      isPatient
        ? {
            id: chatRequest.consultant_id,
            name: chatRequest.consultant_full_name,
            type: chatRequest.consultant_type,
            image: chatRequest.consultant_image || "/default-avatar.png",
          }
        : {
            id: chatRequest.patient_id,
            name: chatRequest.patient_full_name,
            type: "patient",
            image: chatRequest.patient_image || "/default-avatar.png",
          },
    [isPatient, chatRequest]
  );

  const allMessages = useMemo(() => {
    console.log("🔄 إعادة حساب allMessages", {
      dataPages: data?.pages?.length,
      messagesLength: messages.length,
      optimisticCount: optimisticMessages.length,
    });

    // استخدام messages بدلاً من data.pages مباشرة
    const merged = [...messages, ...optimisticMessages];

    // إزالة التكرارات
    const uniqueMessages = merged.reduce<Message[]>((acc, current) => {
      if (!current || !current.id) return acc;

      const exists = acc.find((msg) => msg.id === current.id);
      if (!exists) acc.push(current);
      return acc;
    }, []);

    // الترتيب من الأقدم للأحدث
    // const sorted = uniqueMessages.sort(
    //   (a, b) =>
    //     new Date(b.created_at).getTime() -  new Date(a.created_at).getTime()
    // );

    // console.log(`📈 allMessages النتيجة: ${sorted.length} رسالة`);

    return uniqueMessages;
  }, [messages, optimisticMessages, data]);
  const handleFetchOlder = async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    await fetchNextPage();
    // بعد إضافة الرسائل القديمة، نحافظ على scroll عند آخر رسالة قديمة
    // virtuosoRef.current?.scrollToIndex({
    //   index: newlyLoadedMessages.length, // أو index مناسب
    //   align: 'start',
    //   behavior: 'auto',
    // });
  };

  useEffect(() => {
    // عندما ينتهي تحميل الصفحات التالية، أعد ضبط isLoadingMore
    if (!isFetchingNextPage && isLoadingMore) {
      console.log("🔄 إعادة ضبط isLoadingMore إلى false");
      setIsLoadingMore(false);
    }
  }, [isFetchingNextPage, isLoadingMore]);
  // أضف هذه الـ useEffect للتحقق من حالة البيانات
  useEffect(() => {
    console.log("🔍 فحص حالة الـ query:", {
      hasNextPage,
      isFetchingNextPage,
      pagesCount: data?.pages?.length || 0,
      totalMessages: messages.length,
      optimisticMessagesCount: optimisticMessages.length,
    });

    // if (data?.pages) {
    //   data.pages.forEach((page, index) => {
    //     console.log(`📄 الصفحة ${index + 1}:`, {
    //       messageCount: page.data?.length || 0,
    //       cursor: page.next_cursor,
    //       firstMessage: page.data?.[0]?.id,
    //       lastMessage: page.data?.[page.data?.length - 1]?.id,
    //     });
    //   });
    // }
  }, [
    data,
    hasNextPage,
    isFetchingNextPage,
    messages.length,
    optimisticMessages.length,
  ]);

  // const scrollToBottom = useCallback(() => {
  //   if (virtuosoRef.current && allMessages.length > 0 && shouldScrollToBottom) {
  //     setTimeout(() => {
  //       virtuosoRef.current.scrollToIndex({
  //         index: allMessages.length - 1,
  //         behavior: "smooth",
  //       });
  //     }, 50);
  //   }
  // }, [allMessages.length, shouldScrollToBottom]);

  // 🔥 الحل الذكي: تحميل البيانات تلقائياً عند الوصول للأعلى دون الحاجة للسكرول للأسفل
  useEffect(() => {
    if (isAtTop && hasNextPage && !isFetchingNextPage) {
      console.log("⬆️ المستخدم في الأعلى وهناك بيانات أقدم - تحميل تلقائي");
      fetchNextPage();
      // لا نعيد setIsAtTop إلى false - نتركها كما هي حتى ينتهي التحميل
    }
  }, [isAtTop, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isAtBottom) {
      setShouldFollowOutput(true);
    }
  }, [isAtBottom]);

  useEffect(() => {
    // عند بدء تحميل رسائل جديدة، عطل المتابعة
    if (isFetchingNextPage) {
      setShouldFollowOutput(false);
    }

    // عند انتهاء التحميل، أعد تقييم المتابعة
    return () => {
      if (!isFetchingNextPage && isAtBottom) {
        setShouldFollowOutput(true);
      }
    };
  }, [isFetchingNextPage, isAtBottom]);

  // const loadMoreMessages = useCallback(() => {
  //   if (hasNextPage && !isFetchingNextPage && !shouldScrollToBottom) {
  //     fetchNextPage();
  //   }
  // }, [hasNextPage, isFetchingNextPage, fetchNextPage, shouldScrollToBottom]);

  const messageRenderer = useCallback(
    (index: number, message: Message) => {
      if (!message) return null;
      const senderId =
        typeof message.sender_id === "object"
          ? message.sender_id.id
          : message.sender_id;
      const isMyMessage = Number(senderId) === Number(currentUserId);

      return (
        <MessageBubble
          key={message.id}
          message={message}
          isMyMessage={isMyMessage}
        />
      );
    },
    [currentUserId]
  );
// const loadMoreAtStart = () => {
//   if (hasNextPage && !isFetchingNextPage) {
//     console.log("⬆ تحميل رسائل أقدم...");
//     fetchNextPage();
//   }
// };
  // معالجة الرسائل غير المقروءة
  useEffect(() => {
    if (!allMessages || !currentUserId) return;

    if (markAsReadTimeoutRef.current) {
      clearTimeout(markAsReadTimeoutRef.current);
    }

    markAsReadTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      if (now - lastProcessedRef.current < 500) return;

      const unreadSenders = new Set<number>();
      allMessages.forEach((msg) => {
        const senderId =
          typeof msg.sender_id === "object" ? msg.sender_id.id : msg.sender_id;
        const receiverId =
          typeof msg.receiver_id === "object"
            ? msg.receiver_id.id
            : msg.receiver_id;

        if (
          Number(senderId) !== Number(currentUserId) &&
          Number(receiverId) === Number(currentUserId) &&
          !msg.is_read
        ) {
          unreadSenders.add(Number(senderId));
        }
      });

      if (unreadSenders.size > 0) {
        lastProcessedRef.current = now;
        unreadSenders.forEach((senderId) => {
          markAsReadMutation.mutate(senderId);
        });
      }
    }, 300);

    return () => {
      if (markAsReadTimeoutRef.current) {
        clearTimeout(markAsReadTimeoutRef.current);
      }
    };
  }, [allMessages, currentUserId, markAsReadMutation]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !currentUserId) return;

    setShouldFollowOutput(true);
    setIsAtBottom(true);
    const tempId = Date.now();
    const tempMessage: Message = {
      id: tempId,
      message: newMessage.trim(),
      sender_id: Number(currentUserId),
      receiver_id: otherUser.id,
      chat_request_id: chatRequest.id,
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      attachment: selectedPreview || null,
      attachment_type: selectedFile
        ? selectedFile.type.startsWith("image/")
          ? "image"
          : "file"
        : null,
      read_at: null,
      status: "sending",
      deleted_at: null,
    };

    setOptimisticMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      let realMessage: Message;

      if (selectedFile) {
        const form = new FormData();
        form.append("receiver_id", String(otherUser.id));
        form.append("message", newMessage.trim());
        form.append("chat_request_id", String(chatRequest.id));
        form.append("attachment", selectedFile);
        const attType = selectedFile.type.startsWith("image/")
          ? "image"
          : "file";
        form.append("attachment_type", attType);

        const payload = {
          formData: form,
          onUploadProgress: (ev?: unknown) => {
            if (!ev || typeof ev !== "object") return;
            const maybe = ev as { loaded?: number; total?: number };
            const loaded = typeof maybe.loaded === "number" ? maybe.loaded : 0;
            const total = typeof maybe.total === "number" ? maybe.total : 0;
            if (total) {
              const percent = Math.round((loaded / total) * 100);
              setUploadProgress(percent);
            }
          },
        };

        realMessage = (await sendMessageMutation.mutateAsync(
          payload
        )) as Message;
      } else {
        realMessage = (await sendMessageMutation.mutateAsync({
          receiver_id: otherUser.id,
          message: newMessage.trim(),
          chat_request_id: chatRequest.id,
        })) as Message;
      }

      setOptimisticMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...realMessage, status: "sent" } : msg
        )
      );

      handleRemoveFile();
    } catch (error) {
      logger.error("فشل في إرسال الرسالة:", error);
      setOptimisticMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  // // أضف هذه الدالة للتعامل مع التمرير
  // const handleScroll = useCallback(
  //   (scrollTop: number) => {
  //     // إذا كان المستخدم يمرر للأعلى ولم نكن في الأسفل، عطل المتابعة التلقائية
  //     if (scrollTop < 100) {
  //       // قريب من الأعلى - جارٍ تحميل رسائل قديمة
  //       if (hasNextPage && !isFetchingNextPage && !isLoadingMore) {
  //         console.log("⬆️ قريب من الأعلى، سيتم تحميل المزيد قريباً");
  //       }
  //     }
  //   },
  //   [hasNextPage, isFetchingNextPage, isLoadingMore]
  // );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("حجم الملف أكبر من الحد المسموح (10MB)");
      e.currentTarget.value = "";
      return;
    }

    if (selectedPreview) URL.revokeObjectURL(selectedPreview);

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSelectedPreview(url);
    setShowUploadMenu(false);
    setUploadProgress(0);
  };

  const handleRemoveFile = () => {
    if (selectedPreview) {
      URL.revokeObjectURL(selectedPreview);
      setSelectedPreview(null);
    }
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFilePicker = (type: "image" | "file") => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.accept = type === "image" ? "image/*" : "*/*";
    setShowUploadMenu(false);
    fileInputRef.current.click();
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <div className="text-lg font-semibold mb-2">
              خطأ في تحميل المحادثة
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#32A88D]" />
          <span className="mr-2">جاري تحميل المحادثة...</span>
        </CardContent>
      </Card>
    );
  }

  return (

  <Card className="h-[900px] flex flex-col">
    <ChatHeader otherUser={otherUser} onBack={onBack} />

    <CardContent className="flex-1 p-0 flex flex-col">
      <div className="flex-1 overflow-hidden bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            حدث خطأ في تحميل الرسائل
          </div>
        ) : allMessages.length > 0 ? (
<Virtuoso
  ref={virtuosoRef}
  data={allMessages}
  itemContent={messageRenderer}
  overscan={500}
  className="h-full"
  
  // ✅ ابدأ من الأسفل (الأحدث)
  initialTopMostItemIndex={allMessages.length - 1}
  alignToBottom={true}
  
  // ✅ عند الوصول للأعلى (تحميل رسائل أقدم)
  atTopThreshold={200}
  atTopStateChange={(atTop) => {
    if (atTop) {
      console.log("⬆️ المستخدم وصل للأعلى - سيتم التحميل التلقائي");
      setIsAtTop(true);
    } else {
      setIsAtTop(false);
    }
  }}
  
  // ✅ تتبع حالة الوصول للأسفل
  atBottomStateChange={(atBottom) => {
    console.log("📍 atBottomStateChange:", atBottom);
    setIsAtBottom(atBottom);
  }}
  
    increaseViewportBy={{ top: 400, bottom: 400 }} 
  // ✅ تجاهل endReached
  endReached={() => {
    console.log("⬇️ وصلنا للأسفل (أحدث الرسائل)");
  }}
  
  // ✅ المتابعة التلقائية للأسفل
  followOutput={shouldFollowOutput ? "auto" : false}
  
  components={{
    Header: () =>
      isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-[#32A88D]" />
          <span className="mr-2 text-sm text-gray-500">جاري تحميل رسائل أقدم...</span>
        </div>
      ),
  }}
/>
          
            
            // ✅ المتابعة التلقائية للأسفل
            // followOutput={(isAtBottomValue) => {
            //   console.log("🎯 followOutput called:", {
            //     isAtBottomValue,
            //     currentMessages: allMessages.length
            //   });
              
            //   // تابع للأسفل فقط إذا كنا في الأسفل
            //   return isAtBottomValue ? "smooth" : false;
            // }}
          //     followOutput={(isAtBottomValue) => {
          //       return isAtBottomValue ? "smooth" : false;
          //     }}
                        
          //   // ✅ تتبع حالة الوصول للأسفل
          //   atBottomStateChange={(atBottom) => {
          //     console.log("📍 atBottomStateChange:", atBottom);
          //     setIsAtBottom(atBottom);
          //   }}
            
          //   // ✅ تتبع حالة الوصول للأعلى
          //   atTopStateChange={(atTop) => {
          //     console.log("🔝 atTopStateChange:", atTop);
          //     if (atTop) {
          //       console.log("وصلنا للأعلى (أقدم الرسائل)");
          //     }
          //   }}
            
          //   components={{
          //     Header: () =>
          //       isFetchingNextPage ? (
          //         <div className="flex justify-center p-4">
          //           <div className="flex flex-col items-center">
          //             <Loader2 className="w-6 h-6 animate-spin text-[#32A88D] mb-2" />
          //             <span className="text-sm text-gray-500">
          //               جاري تحميل الرسائل السابقة...
          //             </span>
          //           </div>
          //         </div>
          //       ) : null,
          //     Footer: () =>
          //       !hasNextPage && allMessages.length > 0 ? (
          //         <div className="text-center p-4 text-gray-400 text-sm">
          //           ✅ لقد وصلت إلى بداية المحادثة
          //         </div>
          //       ) : null,
          //   }}
            
          //   useWindowScroll={false}
          //   totalCount={allMessages.length}
          // />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            لا توجد رسائل بعد
          </div>
        )}
      </div>

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        selectedFile={selectedFile}
        selectedPreview={selectedPreview}
        uploadProgress={uploadProgress}
        showUploadMenu={showUploadMenu}
        fileInputRef={fileInputRef}
        onSendMessage={handleSendMessage}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        onOpenFilePicker={openFilePicker}
        onSetShowUploadMenu={setShowUploadMenu}
        isSending={sendMessageMutation.isPending}
      />
    </CardContent>
  </Card>
);
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
// const whatsappBg = {
//   backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2332a88d' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
// };

export default memo(ChatInterface);

