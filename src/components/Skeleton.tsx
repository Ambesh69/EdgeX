interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg skeleton-pulse ${className}`}
      style={{ backgroundColor: 'var(--skeleton-bg)' }}
    />
  )
}

export function KpiSkeleton() {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
      }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-2.5 w-16" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
      }}
    >
      <Skeleton className="h-4 w-44 mb-1" />
      <Skeleton className="h-3 w-32 mb-5" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}
