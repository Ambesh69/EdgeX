import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  TrendingUp,
  Wallet,
  BarChart3,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react'
import { useDuneQuery } from '@/hooks/useDuneQuery'
import { formatUSD } from '@/lib/format'
import type { Chain } from '@/lib/types'
import { KpiCard } from '@/components/KpiCard'
import { KpiSkeleton, ChartSkeleton } from '@/components/Skeleton'
import { VolumeChart } from '@/components/VolumeChart'
import { NetFlowChart } from '@/components/NetFlowChart'
import { WalletAvgChart } from '@/components/WalletAvgChart'
import { ErrorState } from '@/components/ErrorState'
import { DailyStatsTable } from '@/components/DailyStatsTable'

const CHAINS: { id: Chain; label: string; color: string }[] = [
  { id: 'all',      label: 'All Chains', color: 'var(--accent-blue)' },
  { id: 'ethereum', label: 'ETH',        color: '#627EEA' },
  { id: 'arbitrum', label: 'ARB',        color: '#28A0F0' },
  { id: 'bnb',      label: 'BNB',        color: '#F3BA2F' },
]

const queryClient = new QueryClient()

const DUNE_QUERY_ID = import.meta.env.VITE_DUNE_QUERY_ID?.trim() || '6742902'

function Dashboard() {
  const { data, isLoading, error, dataUpdatedAt, isRefreshing, forceRefresh } = useDuneQuery()

  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme')
    return stored ? stored === 'dark' : true
  })

  const [activeChain, setActiveChain] = useState<Chain>('all')

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', 'light')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Filter data to the selected chain
  const chainData = data?.filter((d) => d.chain === activeChain) ?? []
  const latest = chainData[0]

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  if (error && !data) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Failed to load data from Dune Analytics'}
        onRetry={() => forceRefresh()}
      />
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--nav-blur-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* Logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-blue-bg)', border: '1px solid var(--border-default)' }}
            >
              <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-sm font-semibold tracking-tight whitespace-nowrap"
                  style={{ color: 'var(--text-primary)' }}
                >
                  EdgeX
                </h1>
                {/* Multi-chain badge */}
                <span
                  className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md tracking-wider uppercase"
                  style={{
                    backgroundColor: 'var(--accent-blue-bg)',
                    color: 'var(--accent-blue)',
                    border: '1px solid var(--accent-blue-bg)',
                  }}
                >
                  <span style={{ color: '#627EEA' }}>ETH</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '8px' }}>·</span>
                  <span style={{ color: '#28A0F0' }}>ARB</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '8px' }}>·</span>
                  <span style={{ color: '#F3BA2F' }}>BNB</span>
                </span>
              </div>
              <p className="text-[11px] leading-none mt-0.5 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                USDC/USDT Flow Analytics
              </p>
            </div>
          </div>

          {/* Chain selector */}
          <div
            className="flex items-center gap-1 p-1 rounded-lg"
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-default)' }}
          >
            {CHAINS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChain(c.id)}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: activeChain === c.id ? 'var(--bg-elevated)' : 'transparent',
                  color: activeChain === c.id ? c.color : 'var(--text-muted)',
                  border: activeChain === c.id ? '1px solid var(--border-default)' : '1px solid transparent',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {lastUpdated && (
              <span className="text-[11px] hidden md:block" style={{ color: 'var(--text-muted)' }}>
                Updated {lastUpdated}
              </span>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-4" style={{ backgroundColor: 'var(--border-default)' }} />

            {/* Refresh */}
            <button
              onClick={() => forceRefresh()}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark
                ? <Sun className="w-3.5 h-3.5" />
                : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Section label */}
        <div className="flex items-center gap-2 pt-1 pb-0.5">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Key Metrics
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* KPI Row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {isLoading ? (
            <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></>
          ) : (
            <>
              <div className="animate-fade-in stagger-1">
                <KpiCard
                  label="Monthly Deposits"
                  value={formatUSD(latest?.monthlyTotalDeposits ?? 0)}
                  icon={<ArrowDownToLine className="w-3.5 h-3.5" />}
                  accentColor="emerald"
                  subtitle="Current month total"
                />
              </div>
              <div className="animate-fade-in stagger-2">
                <KpiCard
                  label="Monthly Withdrawals"
                  value={formatUSD(latest?.monthlyTotalWithdrawals ?? 0)}
                  icon={<ArrowUpFromLine className="w-3.5 h-3.5" />}
                  accentColor="red"
                  subtitle="Current month total"
                />
              </div>
              <div className="animate-fade-in stagger-3">
                <KpiCard
                  label="Avg Daily Deposit"
                  value={formatUSD(latest?.avgDepositPerDay30d ?? 0)}
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                  accentColor="blue"
                  subtitle="30-day rolling average"
                />
              </div>
              <div className="animate-fade-in stagger-4">
                <KpiCard
                  label="Avg Daily Withdrawal"
                  value={formatUSD(latest?.avgWithdrawalPerDay30d ?? 0)}
                  icon={<Activity className="w-3.5 h-3.5" />}
                  accentColor="amber"
                  subtitle="30-day rolling average"
                />
              </div>
            </>
          )}
        </div>

        {/* KPI Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {isLoading ? (
            <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></>
          ) : (
            <>
              <div className="animate-fade-in stagger-5">
                <KpiCard
                  label="24h Deposit Volume"
                  value={formatUSD(latest?.dailyDepositVol ?? 0)}
                  icon={<ArrowDownToLine className="w-3.5 h-3.5" />}
                  accentColor="emerald"
                  trend={(latest?.dailyDepositVol ?? 0) > (latest?.avgDepositPerDay30d ?? 0) ? 'up' : 'down'}
                  subtitle="vs 30d avg"
                />
              </div>
              <div className="animate-fade-in stagger-6">
                <KpiCard
                  label="24h Withdrawal Volume"
                  value={formatUSD(latest?.dailyWithdrawalVol ?? 0)}
                  icon={<ArrowUpFromLine className="w-3.5 h-3.5" />}
                  accentColor="red"
                  trend={(latest?.dailyWithdrawalVol ?? 0) > (latest?.avgWithdrawalPerDay30d ?? 0) ? 'up' : 'down'}
                  subtitle="vs 30d avg"
                />
              </div>
              <div className="animate-fade-in stagger-7">
                <KpiCard
                  label="Avg Deposit / Wallet / Day"
                  value={formatUSD(latest?.avgDepositSizePerWallet ?? 0)}
                  icon={<Wallet className="w-3.5 h-3.5" />}
                  accentColor="amber"
                  subtitle="Per unique depositor today"
                />
              </div>
              <div className="animate-fade-in stagger-8">
                <KpiCard
                  label="Avg Withdrawal / Wallet / Day"
                  value={formatUSD(latest?.avgWithdrawalSizePerWallet ?? 0)}
                  icon={<Wallet className="w-3.5 h-3.5" />}
                  accentColor="red"
                  subtitle="Per unique withdrawer today"
                />
              </div>
            </>
          )}
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2 pt-2 pb-0.5">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Charts
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Charts */}
        {isLoading ? (
          <div className="space-y-4">
            <ChartSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
        ) : chainData.length > 0 ? (
          <div className="space-y-4">
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <VolumeChart data={chainData} isDark={isDark} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <NetFlowChart data={chainData} isDark={isDark} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.45s' }}>
                <WalletAvgChart data={chainData} isDark={isDark} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Section label */}
        {!isLoading && chainData.length > 0 && (
          <div className="flex items-center gap-2 pt-2 pb-0.5">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Historical Data
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
          </div>
        )}

        {/* Daily Stats Table */}
        {!isLoading && chainData.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <DailyStatsTable data={chainData} />
          </div>
        )}

        {/* Footer */}
        <footer className="pt-6 pb-8" style={{ borderTop: '1px solid var(--border-default)' }}>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>Data source: Dune Analytics · Query #{DUNE_QUERY_ID}</span>
            <div className="flex flex-col sm:items-end gap-1 font-mono text-[10px]">
              <span>
                StarkPerpetual (ETH) ·{' '}
                <a
                  href="https://etherscan.io/address/0xfAaE2946e846133af314d1Df13684c89fA7d83DD"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
                >
                  0xfAaE…83DD
                </a>
              </span>
              <span>
                EdgeXDepositor (ETH) ·{' '}
                <a
                  href="https://etherscan.io/address/0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
                >
                  0xC0a1…2Cc5
                </a>
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}
