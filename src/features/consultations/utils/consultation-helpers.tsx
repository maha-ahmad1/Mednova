import { Badge } from "@/components/ui/badge"
import { MessageCircle, Video } from "lucide-react"

const statusVariants = {
  pending: {
    variant: "secondary" as const,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  accepted: {
    variant: "default" as const,
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 border-red-200",
  },
  active: {
    variant: "outline" as const,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    variant: "default" as const,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
}

export const getStatusBadge = (status: string, getLabel: (status: string) => string) => {
  const config = statusVariants[status as keyof typeof statusVariants] || statusVariants.pending

  return (
    <Badge variant={config.variant} className={`text-xs border ${config.className}`}>
      {getLabel(status)}
    </Badge>
  )
}

export const getTypeIcon = (type: string) => {
  return type === "video" ? (
    <Video className="w-4 h-4 text-blue-600" />
  ) : (
    <MessageCircle className="w-4 h-4 text-green-600" />
  )
}

export const getRemainingTime = (createdAt: string) => {
  const created = new Date(createdAt)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
  const remaining = 24 - diffHours

  return remaining > 0 ? `${remaining} ساعة ` : "منتهي"
}
