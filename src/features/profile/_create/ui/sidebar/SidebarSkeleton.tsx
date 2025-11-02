export function SidebarSkeleton() {
  return (
    <aside className="w-64 min-h-screen bg-background border-r p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        <div className="h-4 w-32 bg-muted rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      </div>

      <ul className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <li key={i} className="h-8 bg-muted rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </li>
        ))}
      </ul>
    </aside>
  )
}
