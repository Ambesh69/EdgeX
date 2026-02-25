export type Chain = 'all' | 'ethereum' | 'arbitrum' | 'bnb'

export interface DuneRow {
  day: string
  chain: Chain
  daily_deposit_volume_24h: number | null
  daily_withdrawal_volume_24h: number | null
  monthly_total_deposits: number | null
  monthly_total_withdrawals: number | null
  avg_deposit_per_day_30d: number | null
  avg_withdrawal_per_day_30d: number | null
  avg_deposit_size_per_wallet: number | null
  avg_withdrawal_size_per_wallet: number | null
}

export interface DailyStats {
  day: string
  chain: Chain
  dailyDepositVol: number
  dailyWithdrawalVol: number
  monthlyTotalDeposits: number
  monthlyTotalWithdrawals: number
  avgDepositPerDay30d: number
  avgWithdrawalPerDay30d: number
  avgDepositSizePerWallet: number
  avgWithdrawalSizePerWallet: number
  netFlow: number
}

export interface DuneApiResponse {
  execution_id: string
  query_id: number
  is_execution_finished: boolean
  state: string
  result: {
    rows: DuneRow[]
    metadata: {
      column_names: string[]
      column_types: string[]
      total_row_count: number
      datapoint_count: number
      execution_time_millis: number
    }
  }
}
