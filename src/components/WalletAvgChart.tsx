import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DailyStats } from '@/lib/types'
import { formatDate, formatUSDCompact } from '@/lib/format'
import { ChartTooltip } from './ChartTooltip'

interface WalletAvgChartProps {
  data: DailyStats[]
  isDark: boolean
}

const LABEL_MAP: Record<string, string> = {
  avgDepositSizePerWallet: 'Avg Deposit/Wallet',
}

export function WalletAvgChart({ data, isDark }: WalletAvgChartProps) {
  const chartData = [...data].reverse()

  const c = isDark
    ? { amber: '#ffb84d', dot: '#ffb84d', grid: '#1a2336', axis: '#374357' }
    : { amber: '#c47800', dot: '#c47800', grid: '#e4ebf5', axis: '#8fa3b8' }

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
          Avg Deposit Size Per Wallet
        </h3>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Per unique depositor per day
        </p>
      </div>

      <ResponsiveContainer width="100%" height={258}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
          <Line
            type="monotone"
            dataKey="avgDepositSizePerWallet"
            stroke={c.amber}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: c.dot, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
