import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { DailyStats } from '@/lib/types'
import { formatDate, formatUSDCompact } from '@/lib/format'
import { ChartTooltip } from './ChartTooltip'

interface VolumeChartProps {
  data: DailyStats[]
  isDark: boolean
}

const LABEL_MAP: Record<string, string> = {
  dailyDepositVol:    'Deposits',
  dailyWithdrawalVol: 'Withdrawals',
}

export function VolumeChart({ data, isDark }: VolumeChartProps) {
  const chartData = [...data].reverse()

  const c = isDark
    ? { emerald: '#00cf8a', red: '#ff4b6e', grid: '#1a2336', axis: '#374357' }
    : { emerald: '#00966a', red: '#d42b4d', grid: '#e4ebf5', axis: '#8fa3b8' }

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
          Daily Deposit &amp; Withdrawal Volume
        </h3>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          USDC/USDT inflows vs outflows over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="exDepositGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={c.emerald} stopOpacity={0.25} />
              <stop offset="100%" stopColor={c.emerald} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="exWithdrawGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={c.red} stopOpacity={0.25} />
              <stop offset="100%" stopColor={c.red} stopOpacity={0.02} />
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
          <Legend
            formatter={(v: string) => LABEL_MAP[v] ?? v}
            wrapperStyle={{
              fontSize: 11,
              color: isDark ? '#6b829e' : '#4c6078',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              paddingTop: 8,
            }}
          />
          <Area
            type="monotone"
            dataKey="dailyDepositVol"
            stroke={c.emerald}
            strokeWidth={1.5}
            fill="url(#exDepositGrad)"
          />
          <Area
            type="monotone"
            dataKey="dailyWithdrawalVol"
            stroke={c.red}
            strokeWidth={1.5}
            fill="url(#exWithdrawGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
