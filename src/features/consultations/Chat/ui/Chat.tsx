// "use client";

// import { useState } from "react";
// import { 
//   Send, 
//   Paperclip, 
//   Image, 
//   MessageCircle, 
//   Search,
//   MoreVertical,
//   Phone,
//   Video,
//   Smile
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export default function ChatView() {
//   const [selectedRoom, setSelectedRoom] = useState<string>("1");
//   const [newMessage, setNewMessage] = useState("");

//   // بيانات وهمية للمحادثات
//   const chatRooms = [
//     {
//       id: "1",
//       patientName: "أحمد محمد",
//       professionalName: "د. سارة العلي",
//       lastMessage: "شكراً دكتور على النصيحة، سأطبقها اليوم",
//       lastMessageTime: "10:30 ص",
//       unreadCount: 2,
//       status: "active",
//       isOnline: true
//     },
//     {
//       id: "2",
//       patientName: "فاطمة عبدالله",
//       professionalName: "د. خالد الحربي",
//       lastMessage: "هل يمكنني تغيير موعد الجلسة؟",
//       lastMessageTime: "أمس",
//       unreadCount: 0,
//       status: "active",
//       isOnline: false
//     },
//     {
//       id: "3",
//       patientName: "محمد العتيبي",
//       professionalName: "مركز التأهيل الشامل",
//       lastMessage: "تم تحضير برنامجك التأهيلي",
//       lastMessageTime: "الجمعة",
//       unreadCount: 1,
//       status: "active",
//       isOnline: true
//     }
//   ];

//   // بيانات وهمية للرسائل
//   const messages = [
//     {
//       id: "1",
//       senderId: "patient",
//       senderName: "أحمد محمد",
//       content: "السلام عليكم دكتور، عندي استفسار بخصوص الجرعة",
//       timestamp: "10:15 ص",
//       isRead: true
//     },
//     {
//       id: "2",
//       senderId: "professional",
//       senderName: "د. سارة العلي",
//       content: "وعليكم السلام، تفضل أحمد",
//       timestamp: "10:16 ص",
//       isRead: true
//     },
//     {
//       id: "3",
//       senderId: "patient",
//       senderName: "أحمد محمد",
//       content: "هل يمكنني زيادة الجرعة المسائية؟",
//       timestamp: "10:20 ص",
//       isRead: true
//     },
//     {
//       id: "4",
//       senderId: "professional",
//       senderName: "د. سارة العلي",
//       content: "لا أنصح بذلك الآن، دعنا ننتظر حتى موعدك القادم",
//       timestamp: "10:25 ص",
//       isRead: true
//     },
//     {
//       id: "5",
//       senderId: "patient",
//       senderName: "أحمد محمد",
//       content: "حسناً سأتابع على نفس الجرعة، شكراً دكتور",
//       timestamp: "10:28 ص",
//       isRead: true
//     },
//     {
//       id: "6",
//       senderId: "professional",
//       senderName: "د. سارة العلي",
//       content: "العفو، لا تتردد في السؤال عن أي شيء",
//       timestamp: "10:30 ص",
//       isRead: false
//     }
//   ];

//   const currentRoom = chatRooms.find(room => room.id === selectedRoom);

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       setNewMessage("");
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-gray-50 rounded-lg" dir="rtl">
//       <div className="grid grid-cols-1 lg:grid-cols-4 h-full gap-4">
        
//         {/* قائمة المحادثات - السايدبار اليسرى */}
//         <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
//           {/* رأس قائمة المحادثات */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-800">المحادثات</h2>
//               <Badge variant="outline" className="bg-blue-50 text-blue-600">
//                 ٣ محادثات
//               </Badge>
//             </div>
            
//             {/* شريط البحث */}
//             <div className="relative">
//               <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="ابحث في المحادثات..."
//                 className="pr-10 bg-gray-50 border-gray-200"
//               />
//             </div>
//           </div>

//           {/* قائمة المحادثات */}
//           <div className="overflow-y-auto max-h-[600px]">
//             {chatRooms.map((room) => (
//               <div
//                 key={room.id}
//                 className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
//                   selectedRoom === room.id 
//                     ? "bg-[#32A88D]/10 border-r-4 border-r-[#32A88D] shadow-sm" 
//                     : "hover:bg-gray-50"
//                 }`}
//                 onClick={() => setSelectedRoom(room.id)}
//               >
//                 <div className="flex items-start space-x-3 space-x-reverse">
//                   {/* صورة المستخدم */}
//                   <div className="relative">
//                     <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
//                       <AvatarImage src="" />
//                       <AvatarFallback className="bg-[#32A88D] text-white">
//                         {room.patientName.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     {room.isOnline && (
//                       <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                     )}
//                   </div>

//                   {/* محتوى المحادثة */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start mb-1">
//                       <h3 className="font-semibold text-gray-800 text-sm truncate">
//                         {room.patientName}
//                       </h3>
//                       <span className="text-xs text-gray-400 whitespace-nowrap">
//                         {room.lastMessageTime}
//                       </span>
//                     </div>
                    
//                     <p className="text-sm text-gray-600 truncate mb-2">
//                       {room.lastMessage}
//                     </p>
                    
//                     <div className="flex justify-between items-center">
//                       <Badge 
//                         variant="outline" 
//                         className={`text-xs ${
//                           room.status === 'active' 
//                             ? 'bg-green-50 text-green-600 border-green-200'
//                             : 'bg-gray-50 text-gray-600 border-gray-200'
//                         }`}
//                       >
//                         {room.status === 'active' ? 'نشط' : 'مغلق'}
//                       </Badge>
                      
//                       {room.unreadCount > 0 && (
//                         <Badge 
//                           variant="destructive" 
//                           className="bg-red-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center"
//                         >
//                           {room.unreadCount}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* منطقة المحادثة الرئيسية */}
//         <div className="lg:col-span-3 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
//           {currentRoom ? (
//             <>
//               {/* رأس المحادثة */}
//               <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3 space-x-reverse">
//                     <div className="relative">
//                       <Avatar className="w-12 h-12 border-2 border-white shadow-md">
//                         <AvatarImage src="" />
//                         <AvatarFallback className="bg-[#32A88D] text-white">
//                           {currentRoom.patientName.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       {currentRoom.isOnline && (
//                         <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                       )}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-800 text-lg">
//                         {currentRoom.patientName}
//                       </h3>
//                       <div className="flex items-center space-x-2 space-x-reverse">
//                         <div className={`w-2 h-2 rounded-full ${
//                           currentRoom.isOnline ? 'bg-green-500' : 'bg-gray-300'
//                         }`}></div>
//                         <span className="text-sm text-gray-500">
//                           {currentRoom.isOnline ? 'متصل الآن' : 'غير متصل'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* أزرار التحكم */}
//                   <div className="flex items-center space-x-2 space-x-reverse">
//                     <Button variant="outline" size="icon" className="text-gray-600">
//                       <Phone className="w-4 h-4" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="text-gray-600">
//                       <Video className="w-4 h-4" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="text-gray-600">
//                       <MoreVertical className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* منطقة الرسائل */}
//               <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/50 to-white">
//                 <div className="space-y-4 max-w-4xl mx-auto">
//                   {messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex ${
//                         message.senderId === "patient" ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div className="flex space-x-2 space-x-reverse max-w-xs lg:max-w-md">
//                         {message.senderId === "professional" && (
//                           <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
//                             <AvatarFallback className="bg-blue-500 text-white text-xs">
//                               د
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
                        
//                         <div className="flex flex-col space-y-1">
//                           <div
//                             className={`rounded-2xl px-4 py-3 ${
//                               message.senderId === "patient"
//                                 ? "bg-[#32A88D] text-white rounded-tr-none"
//                                 : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
//                             }`}
//                           >
//                             <p className="text-sm whitespace-pre-wrap leading-relaxed">
//                               {message.content}
//                             </p>
//                           </div>
                          
//                           <div className={`flex items-center space-x-2 space-x-reverse text-xs ${
//                             message.senderId === "patient" ? "justify-end" : "justify-start"
//                           }`}>
//                             <span className="text-gray-400">{message.timestamp}</span>
//                             {message.senderId === "patient" && (
//                               <span className={`w-2 h-2 rounded-full ${
//                                 message.isRead ? 'bg-blue-500' : 'bg-gray-300'
//                               }`}></span>
//                             )}
//                           </div>
//                         </div>

//                         {message.senderId === "patient" && (
//                           <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
//                             <AvatarFallback className="bg-[#32A88D] text-white text-xs">
//                               أ
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* منطقة إرسال الرسالة */}
//               <div className="p-4 border-t border-gray-200 bg-white">
//                 <div className="flex items-end space-x-3 space-x-reverse">
                  
//                   {/* أزرار الإرفاق */}
//                   <div className="flex space-x-1 space-x-reverse">
//                     <Button variant="outline" size="icon" className="text-gray-500">
//                       <Paperclip className="w-4 h-4" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="text-gray-500">
//                       <Image className="w-4 h-4" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="text-gray-500">
//                       <Smile className="w-4 h-4" />
//                     </Button>
//                   </div>

//                   {/* حقل الإدخال */}
//                   <div className="flex-1">
//                     <Input
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="اكتب رسالتك هنا..."
//                       className="min-h-[44px] py-3 resize-none border-gray-300 focus:border-[#32A88D]"
//                       multiline
//                     />
//                   </div>

//                   {/* زر الإرسال */}
//                   <Button
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim()}
//                     className="bg-[#32A88D] hover:bg-[#2D977F] text-white min-h-[44px] px-6"
//                   >
//                     <Send className="w-4 h-4 ml-1" />
//                     إرسال
//                   </Button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500">
//               <div className="text-center">
//                 <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-600 mb-2">اختر محادثة</h3>
//                 <p className="text-gray-400">اختر محادثة من القائمة لبدء المحادثة</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }