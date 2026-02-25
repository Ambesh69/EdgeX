import { formatUSD, formatDateFull } from '@/lib/format'

interface TooltipPayload {
  value: number
  name: string
  color: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
  labelMap?: Record<string, string>
  isDark?: boolean
}

export function ChartTooltip({ active, payload, label, labelMap, isDark = true }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="rounded-lg px-3.5 py-2.5 shadow-xl"
      style={{
        backgroundColor: isDark ? '#1a2234' : '#ffffff',
        border: `1px solid ${isDark ? '#2d3f55' : '#dce3f0'}`,
        boxShadow: isDark
          ? '0 8px 24px rgba(0,0,0,0.4)'
          : '0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      <p
        className="text-[11px] mb-2 font-medium"
        style={{ color: isDark ? '#6b829e' : '#8fa3b8' }}
      >
        {label ? formatDateFull(label) : ''}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span style={{ color: isDark ? '#8a9bb5' : '#4c6078' }}>
            {labelMap?.[entry.name] ?? entry.name}
          </span>
          <span
            className="font-data ml-auto pl-3 font-medium"
            style={{ color: isDark ? '#dde6f5' : '#0c1420' }}
          >
            {formatUSD(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
