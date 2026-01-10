import type { ReactNode } from "react"

interface DataGridContainerProps {
  children: ReactNode
  viewMode: "grid" | "list"
}

export function DataGridContainer({ children, viewMode }: DataGridContainerProps) {
  if (viewMode === "grid") {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{children}</div>
  }

  return <div className="space-y-6">{children}</div>
}
