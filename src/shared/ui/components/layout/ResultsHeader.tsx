interface ResultsHeaderProps {
  count: number
  sortBy: string
  itemLabel?: string // "برنامج" أو "نتيجة"
}

export function ResultsHeader({ count, sortBy, itemLabel = "نتيجة" }: ResultsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-gray-600">
        عرض <span className="font-bold text-[#32A88D]">{count}</span> {itemLabel}
      </div>
      <div className="text-sm text-gray-500">
        مرتبة حسب: <span className="font-medium text-gray-700">{sortBy}</span>
      </div>
    </div>
  )
}
