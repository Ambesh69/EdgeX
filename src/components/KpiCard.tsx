import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  accentColor?: 'emerald' | 'red' | 'blue' | 'amber'
}

const accentVars = {
  emerald: { color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-bg)' },
  red:     { color: 'var(--accent-red)',     bg: 'var(--accent-red-bg)'     },
  blue:    { color: 'var(--accent-blue)',    bg: 'var(--accent-blue-bg)'    },
  amber:   { color: 'var(--accent-amber)',   bg: 'var(--accent-amber-bg)'   },
} as const

export function KpiCard({
  label,
  value,
  icon,
  trend,
  subtitle,
  accentColor = 'emerald',
}: KpiCardProps) {
  const accent = accentVars[accentColor]

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Colored left-edge accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ backgroundColor: accent.color, opacity: 0.7 }}
      />

      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-2 pl-2">
        <span
          className="text-xs font-medium leading-tight"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
          style={{ backgroundColor: accent.bg }}
        >
          <span style={{ color: accent.color }}>{icon}</span>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5 pl-2">
        <span
          className="font-data text-2xl font-medium leading-none tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </span>
        {trend && (
          <span className="mb-0.5">
            {trend === 'up'      && <TrendingUp   className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />}
            {trend === 'down'    && <TrendingDown  className="w-4 h-4" style={{ color: 'var(--accent-red)'     }} />}
            {trend === 'neutral' && <Minus         className="w-4 h-4" style={{ color: 'var(--text-muted)'     }} />}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <span className="text-[11px] leading-none pl-2" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </span>
      )}
    </div>
  )
}
