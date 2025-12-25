// "use client";

// import { useState } from "react";
// import {
//   Bell,
//   Check,
//   Clock,
//   Video,
//   MessageSquare,
//   AlertCircle,
//   User,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { useNotifications } from "@/features/notifications/hooks/useNotifications";

// export function NotificationDropdown() {
//   const [open, setOpen] = useState(false);
  
//   // استخدام الـ hook الجديد
//   const {
//     notifications,
//     unreadCount,
//     isLoading,
//     handleMarkAsRead,
//     handleMarkAllAsRead,
//   } = useNotifications();

//   // دالة لتنسيق الوقت النسبي
//   const formatTimeAgo = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
//     if (diffInSeconds < 60) return 'الآن';
//     if (diffInSeconds < 3600) return `قبل ${Math.floor(diffInSeconds / 60)} دقيقة`;
//     if (diffInSeconds < 86400) return `قبل ${Math.floor(diffInSeconds / 3600)} ساعة`;
//     if (diffInSeconds < 2592000) return `قبل ${Math.floor(diffInSeconds / 86400)} يوم`;
    
//     return date.toLocaleDateString('ar-SA');
//   };

//   // الحصول على الأيقونة المناسبة
//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'consultation_requested':
//         return <MessageSquare className="h-4 w-4" />;
//       case 'consultation_accepted':
//         return <Check className="h-4 w-4" />;
//       case 'consultation_active':
//         return <Video className="h-4 w-4" />;
//       case 'consultation_cancelled':
//         return <AlertCircle className="h-4 w-4" />;
//       case 'consultation_completed':
//         return <Check className="h-4 w-4" />;
//       default:
//         return <Bell className="h-4 w-4" />;
//     }
//   };

//   // الحصول على لون النقطة
//   const getNotificationColor = (type: string) => {
//     switch (type) {
//       case 'consultation_requested':
//         return "bg-yellow-500";
//       case 'consultation_accepted':
//         return "bg-green-500";
//       case 'consultation_active':
//         return "bg-blue-500";
//       case 'consultation_cancelled':
//         return "bg-red-500";
//       case 'consultation_completed':
//         return "bg-purple-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // التعامل مع النقر على الإشعار
//   const handleNotificationClick = (notificationId: number) => {
//     handleMarkAsRead(notificationId);
//   };

//   // عرض زر الانضمام للزوم إذا كان هناك رابط
//   const renderZoomAction = (notification: any) => {
//     if (notification.type === 'consultation_active' && notification.data.video_room_link) {
//       return (
//         <Button
//           size="sm"
//           variant="default"
//           className="mt-2 text-xs"
//           onClick={(e) => {
//             e.stopPropagation();
//             window.open(notification.data.video_room_link, '_blank');
//           }}
//         >
//           <Video className="h-3 w-3 ml-1" />
//           انضم للجلسة
//         </Button>
//       );
//     }
//     return null;
//   };

//   // عرض أحدث 10 إشعارات فقط
//   const recentNotifications = notifications.slice(0, 20);

//   return (
//     <DropdownMenu open={open} onOpenChange={setOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="relative"
//         >
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge
//               className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
//               variant="destructive"
//             >
//               {unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-96" align="end" forceMount>
//         <DropdownMenuLabel className="flex items-center justify-between">
//           <span className="font-semibold">الإشعارات</span>
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-auto p-0 text-xs"
//               onClick={handleMarkAllAsRead}
//             >
//               تعيين الكل كمقروء
//             </Button>
//           )}
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
        
//         <ScrollArea className="h-[400px]">
//           <DropdownMenuGroup>
//             {isLoading ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 جاري تحميل الإشعارات...
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 لا توجد إشعارات جديدة
//               </div>
//             ) : (
//               recentNotifications.map((notification) => (
//                 <DropdownMenuItem
//                   key={notification.id}
//                   className={cn(
//                     "flex flex-col items-start gap-2 p-4 cursor-pointer",
//                     "hover:bg-muted transition-colors",
//                     !notification.read && "bg-muted/50"
//                   )}
//                   onClick={() => handleNotificationClick(notification.id)}
//                 >
//                   <div className="flex items-start w-full gap-3">
//                     <div className="relative">
//                       <div className={cn(
//                         "h-2 w-2 rounded-full mt-1",
//                         getNotificationColor(notification.type),
//                         notification.read && "opacity-50"
//                       )} />
//                       <div className="mt-1">
//                         {getNotificationIcon(notification.type)}
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 space-y-1">
//                       <div className="flex items-center justify-between">
//                         <p className={cn(
//                           "text-sm font-medium leading-none",
//                           !notification.read && "text-primary"
//                         )}>
//                           {notification.title}
//                         </p>
//                         {!notification.read && (
//                           <div className="h-2 w-2 rounded-full bg-primary"></div>
//                         )}
//                       </div>
                      
//                       <p className="text-sm text-muted-foreground">
//                         {notification.message}
//                       </p>
                      
//                       {notification.data.patient_name && (
//                         <div className="text-xs text-muted-foreground">
//                           <User className="h-3 w-3 inline mr-1" />
//                           {notification.data.patient_name}
//                         </div>
//                       )}
                      
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Clock className="h-3 w-3" />
//                           {formatTimeAgo(notification.createdAt)}
//                         </div>
//                         {renderZoomAction(notification)}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between w-full">
//                     <div className="text-xs text-muted-foreground">
//                       #{notification.data.consultation_id}
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       {notification.source === 'api' ? 'API' : 'مباشر'}
//                     </div>
//                   </div>
//                 </DropdownMenuItem>
//               ))
//             )}
//           </DropdownMenuGroup>
//         </ScrollArea>
        
//         <DropdownMenuSeparator />
//         <div className="p-2">
//           <Link href="/notifications" className="w-full">
//             <Button
//               variant="ghost"
//               className="w-full"
//             >
//               عرض جميع الإشعارات ({notifications.length})
//             </Button>
//           </Link>
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }



// "use client";

// import { useState } from "react";
// import {
//   Bell,
//   Check,
//   Clock,
//   Video,
//   MessageSquare,
//   AlertCircle,
//   User,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// // import { useNotificationsDropdown } from "@/features/notifications/hooks/useNotifications";
// import { useNotificationsDropdown } from '@/features/notifications/hooks/useNotificationsDropdown';


// export function NotificationDropdown() {
//   const [open, setOpen] = useState(false);
  
// // ⬅️ استبدال hook


//   const {
//     notifications,
//     unreadCount,
//     isLoading,
//     handleMarkAsRead,
//     handleMarkAllAsRead,
//   } = useNotificationsDropdown();


//   // دالة لتنسيق الوقت النسبي
//   const formatTimeAgo = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
//     if (diffInSeconds < 60) return 'الآن';
//     if (diffInSeconds < 3600) return `قبل ${Math.floor(diffInSeconds / 60)} دقيقة`;
//     if (diffInSeconds < 86400) return `قبل ${Math.floor(diffInSeconds / 3600)} ساعة`;
//     if (diffInSeconds < 2592000) return `قبل ${Math.floor(diffInSeconds / 86400)} يوم`;
    
//     return date.toLocaleDateString('ar-SA');
//   };

//   // الحصول على الأيقونة المناسبة
//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'consultation_requested':
//         return <MessageSquare className="h-4 w-4" />;
//       case 'consultation_accepted':
//         return <Check className="h-4 w-4" />;
//       case 'consultation_active':
//         return <Video className="h-4 w-4" />;
//       case 'consultation_cancelled':
//         return <AlertCircle className="h-4 w-4" />;
//       case 'consultation_completed':
//         return <Check className="h-4 w-4" />;
//       default:
//         return <Bell className="h-4 w-4" />;
//     }
//   };

//   // الحصول على لون النقطة
//   const getNotificationColor = (type: string) => {
//     switch (type) {
//       case 'consultation_requested':
//         return "bg-yellow-500";
//       case 'consultation_accepted':
//         return "bg-green-500";
//       case 'consultation_active':
//         return "bg-blue-500";
//       case 'consultation_cancelled':
//         return "bg-red-500";
//       case 'consultation_completed':
//         return "bg-purple-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // 🔧 التعديل هنا: تغيير number إلى string
//   const handleNotificationClick = (notificationId: string) => {
//     handleMarkAsRead(notificationId);
//   };

//   // عرض زر الانضمام للزوم إذا كان هناك رابط
//   const renderZoomAction = (notification: any) => {
//     if (notification.type === 'consultation_active' && notification.data.video_room_link) {
//       return (
//         <Button
//           size="sm"
//           variant="default"
//           className="mt-2 text-xs"
//           onClick={(e) => {
//             e.stopPropagation();
//             window.open(notification.data.video_room_link, '_blank');
//           }}
//         >
//           <Video className="h-3 w-3 ml-1" />
//           انضم للجلسة
//         </Button>
//       );
//     }
//     return null;
//   };

//   // عرض أحدث 10 إشعارات فقط
//   const recentNotifications = notifications.slice(0, 20);

//   return (
//     <DropdownMenu open={open} onOpenChange={setOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="relative"
//         >
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge
//               className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
//               variant="destructive"
//             >
//               {unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-96" align="end" forceMount>
//         <DropdownMenuLabel className="flex items-center justify-between">
//           <span className="font-semibold">الإشعارات</span>
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-auto p-0 text-xs"
//               onClick={handleMarkAllAsRead}
//             >
//               تعيين الكل كمقروء
//             </Button>
//           )}
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
        
//         <ScrollArea className="h-[400px]">
//           <DropdownMenuGroup>
//             {isLoading ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 جاري تحميل الإشعارات...
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 لا توجد إشعارات جديدة
//               </div>
//             ) : (
//               recentNotifications.map((notification) => (
//                 <DropdownMenuItem
//                   key={notification.id} // ✅ هنا يستخدم id (string) كمفتاح
//                   className={cn(
//                     "flex flex-col items-start gap-2 p-4 cursor-pointer",
//                     "hover:bg-muted transition-colors",
//                     !notification.read && "bg-muted/50"
//                   )}
//                   onClick={() => handleNotificationClick(notification.id)} // ✅ هنا يمرر string
//                 >
//                   <div className="flex items-start w-full gap-3">
//                     <div className="relative">
//                       <div className={cn(
//                         "h-2 w-2 rounded-full mt-1",
//                         getNotificationColor(notification.type),
//                         notification.read && "opacity-50"
//                       )} />
//                       <div className="mt-1">
//                         {getNotificationIcon(notification.type)}
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 space-y-1">
//                       <div className="flex items-center justify-between">
//                         <p className={cn(
//                           "text-sm font-medium leading-none",
//                           !notification.read && "text-primary"
//                         )}>
//                           {notification.title}
//                         </p>
//                         {!notification.read && (
//                           <div className="h-2 w-2 rounded-full bg-primary"></div>
//                         )}
//                       </div>
                      
//                       <p className="text-sm text-muted-foreground">
//                         {notification.message}
//                       </p>
                      
//                       {notification.data.patient_name && (
//                         <div className="text-xs text-muted-foreground">
//                           <User className="h-3 w-3 inline mr-1" />
//                           {notification.data.patient_name}
//                         </div>
//                       )}
                      
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Clock className="h-3 w-3" />
//                           {formatTimeAgo(notification.createdAt)}
//                         </div>
//                         {renderZoomAction(notification)}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between w-full">
//                     <div className="text-xs text-muted-foreground">
//                       #{notification.data.consultation_id}
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       {notification.source === 'api' ? 'API' : 'مباشر'}
//                     </div>
//                   </div>
//                 </DropdownMenuItem>
//               ))
//             )}
//           </DropdownMenuGroup>
//         </ScrollArea>
        
//         <DropdownMenuSeparator />
//         <div className="p-2">
//           <Link href="/notifications" className="w-full">
//             <Button
//               variant="ghost"
//               className="w-full"
//             >
//               عرض جميع الإشعارات ({notifications.length})
//             </Button>
//           </Link>
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }