import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { DailyStats } from '@/lib/types'
import { formatDate, formatUSDCompact } from '@/lib/format'
import { ChartTooltip } from './ChartTooltip'

interface NetFlowChartProps {
  data: DailyStats[]
  isDark: boolean
}

const LABEL_MAP: Record<string, string> = {
  cumulativeNetFlow: 'Cumulative Net Flow',
}

export function NetFlowChart({ data, isDark }: NetFlowChartProps) {
  const reversed = [...data].reverse()

  const chartData = reversed.reduce<Array<DailyStats & { cumulativeNetFlow: number }>>((rows, d) => {
    const previous = rows[rows.length - 1]?.cumulativeNetFlow ?? 0
    rows.push({ ...d, cumulativeNetFlow: previous + d.netFlow })
    return rows
  }, [])

  const c = isDark
    ? { blue: '#4fa3ff', grid: '#1a2336', axis: '#374357', refLine: '#2d3f55' }
    : { blue: '#1665c1', grid: '#e4ebf5', axis: '#8fa3b8', refLine: '#c8d6e8' }

  const tickStyle = {
    fontSize: 11,
    fontFamily: 'DM Mono, monospace',
    fill: c.axis,
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Cumulative Net Flow
        </h3>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Deposits minus withdrawals, running total
        </p>
      </div>

      <ResponsiveContainer width="100%" height={258}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="exNfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={c.blue} stopOpacity={0.25} />
              <stop offset="100%" stopColor={c.blue} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="day"
            tickFormatter={formatDate}
            stroke={c.axis}
            tick={tickStyle}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatUSDCompact}
            stroke={c.axis}
            tick={tickStyle}
            tickLine={false}
            axisLine={false}
            width={62}
          />
          <Tooltip content={<ChartTooltip labelMap={LABEL_MAP} isDark={isDark} />} />
          <ReferenceLine y={0} stroke={c.refLine} strokeDasharray="4 3" />
          <Area
            type="monotone"
            dataKey="cumulativeNetFlow"
            stroke={c.blue}
            strokeWidth={1.5}
            fill="url(#exNfGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
