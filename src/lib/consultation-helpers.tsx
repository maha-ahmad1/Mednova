// import { Badge } from "@/components/ui/badge"
// import { MessageCircle, Video } from "lucide-react"

// export const getStatusBadge = (status: string) => {
//   const statusConfig = {
//     pending: {
//       label: "في انتظار الموافقة",
//       variant: "secondary" as const,
//       className: "bg-amber-100 text-amber-800 border-amber-200",
//     },
//     accepted: {
//       label: "مقبول",
//       variant: "default" as const,
//       className: "bg-green-100 text-green-800 border-green-200",
//     },
//     cancelled: {
//       label: "مرفوض",
//       variant: "destructive" as const,
//       className: "bg-red-100 text-red-800 border-red-200",
//     },
//     active: {
//       label: "نشطة",
//       variant: "outline" as const,
//       className: "bg-blue-100 text-blue-800 border-blue-200",
//     },
//     completed: {
//       label: "مكتمل",
//       variant: "default" as const,
//       className: "bg-gray-100 text-gray-800 border-gray-200",
//     },
//     //  end: {
//     //   label: "انتهاء",
//     //   variant: "default" as const,
//     //   className: "bg-gray-100 text-gray-800 border-gray-200",
//     // },
//   }

//   const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

//   return (
//     <Badge variant={config.variant} className={`text-xs border ${config.className}`}>
//       {config.label}
//     </Badge>
//   )
// }

// export const getTypeIcon = (type: string) => {
//   return type === "video" ? (
//     <Video className="w-4 h-4 text-blue-600" />
//   ) : (
//     <MessageCircle className="w-4 h-4 text-green-600" />
//   )
// }

// export const getRemainingTime = (createdAt: string) => {
//   const created = new Date(createdAt)
//   const now = new Date()
//   const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
//   const remaining = 24 - diffHours

//   return remaining > 0 ? `${remaining} ساعة ` : "منتهي"
// }
