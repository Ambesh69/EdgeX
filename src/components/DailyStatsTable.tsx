import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DailyStats } from '@/lib/types'
import { formatUSD, formatDateFull } from '@/lib/format'

const PAGE_SIZE = 20

interface Props {
  data: DailyStats[]
}

export function DailyStatsTable({ data }: Props) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const pageData = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const start = page * PAGE_SIZE + 1
  const end = Math.min((page + 1) * PAGE_SIZE, data.length)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Table header */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-default)' }}
      >
        <div>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Daily Stats
          </h2>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            All recorded days, most recent first
          </p>
        </div>
        {totalPages > 1 && (
          <span className="text-[11px] font-data" style={{ color: 'var(--text-muted)' }}>
            {start}–{end} <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>of {data.length}</span>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {[
                { label: 'Date',               align: 'left'  },
                { label: 'Daily Deposits',      align: 'right' },
                { label: 'Daily Withdrawals',   align: 'right' },
                { label: 'Net Flow',            align: 'right' },
                { label: 'Mo. Deposits',        align: 'right' },
                { label: 'Mo. Withdrawals',     align: 'right' },
                { label: 'Avg Dep/Day (30d)',   align: 'right' },
                { label: 'Avg Wdw/Day (30d)',   align: 'right' },
                { label: 'Avg Dep/Wallet',      align: 'right' },
                { label: 'Avg Wdw/Wallet',      align: 'right' },
              ].map(({ label, align }) => (
                <th
                  key={label}
                  className={`px-4 py-2.5 whitespace-nowrap font-medium text-[11px] tracking-wide ${align === 'right' ? 'text-right' : 'text-left'}`}
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-elevated)',
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, idx) => (
              <tr
                key={row.day}
                style={{
                  borderBottom: '1px solid var(--border-default)',
                  backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-elevated)',
                  opacity: 1,
                }}
                className="transition-colors hover:bg-[var(--bg-surface-hover)]"
              >
                <td
                  className="px-4 py-2.5 whitespace-nowrap font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {formatDateFull(row.day)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--accent-emerald)' }}
                >
                  {formatUSD(row.dailyDepositVol)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--accent-red)' }}
                >
                  {formatUSD(row.dailyWithdrawalVol)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data font-medium"
                  style={{ color: row.netFlow >= 0 ? 'var(--accent-emerald)' : 'var(--accent-red)' }}
                >
                  {row.netFlow >= 0 ? '+' : ''}{formatUSD(row.netFlow)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {formatUSD(row.monthlyTotalDeposits)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {formatUSD(row.monthlyTotalWithdrawals)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  {formatUSD(row.avgDepositPerDay30d)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--accent-amber)' }}
                >
                  {formatUSD(row.avgWithdrawalPerDay30d)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {formatUSD(row.avgDepositSizePerWallet)}
                </td>
                <td
                  className="px-4 py-2.5 text-right whitespace-nowrap font-data"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {formatUSD(row.avgWithdrawalSizePerWallet)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="px-5 py-3 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-7 h-7 rounded text-xs font-medium cursor-pointer"
                style={
                  i === page
                    ? { backgroundColor: 'var(--accent-blue-bg)', color: 'var(--accent-blue)' }
                    : { color: 'var(--text-muted)', backgroundColor: 'transparent' }
                }
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
            }}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
