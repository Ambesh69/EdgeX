import type { DuneApiResponse, DuneRow, DailyStats } from './types'

/** Fetch the latest cached results via our server-side proxy */
export async function getQueryResults(): Promise<DuneApiResponse> {
  const res = await fetch('/api/dune?action=results')
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Dune API error (${res.status}): ${text}`)
  }
  return res.json()
}

/** Trigger a fresh query execution, then poll until complete and return results */
export async function executeAndGetResults(): Promise<DuneApiResponse> {
  // 1. Kick off execution
  const execRes = await fetch('/api/dune?action=execute', { method: 'POST' })
  if (!execRes.ok) {
    const text = await execRes.text()
    throw new Error(`Dune execute error (${execRes.status}): ${text}`)
  }
  const { execution_id } = await execRes.json()

  // 2. Poll until finished (max ~60s)
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000))

    const res = await fetch(`/api/dune?action=execution_results&execution_id=${execution_id}`)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Dune results error (${res.status}): ${text}`)
    }
    const data: DuneApiResponse = await res.json()
    if (data.is_execution_finished) return data
  }

  throw new Error('Query execution timed out after 60s')
}

export function transformRows(rows: DuneRow[]): DailyStats[] {
  return rows.map((row) => ({
    day: row.day,
    chain: row.chain ?? 'all',
    dailyDepositVol: row.daily_deposit_volume_24h ?? 0,
    dailyWithdrawalVol: row.daily_withdrawal_volume_24h ?? 0,
    monthlyTotalDeposits: row.monthly_total_deposits ?? 0,
    monthlyTotalWithdrawals: row.monthly_total_withdrawals ?? 0,
    avgDepositPerDay30d: row.avg_deposit_per_day_30d ?? 0,
    avgWithdrawalPerDay30d: row.avg_withdrawal_per_day_30d ?? 0,
    avgDepositSizePerWallet: row.avg_deposit_size_per_wallet ?? 0,
    avgWithdrawalSizePerWallet: row.avg_withdrawal_size_per_wallet ?? 0,
    netFlow: (row.daily_deposit_volume_24h ?? 0) - (row.daily_withdrawal_volume_24h ?? 0),
  }))
}
