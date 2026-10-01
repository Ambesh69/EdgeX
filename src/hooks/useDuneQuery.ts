import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getQueryResults, executeAndGetResults, transformRows } from '@/lib/dune'
import type { DailyStats } from '@/lib/types'

const QUERY_KEY = ['edgex-flows']

export function useDuneQuery() {
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<Error | null>(null)

  const query = useQuery<DailyStats[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await getQueryResults()
      const rows = response.result?.rows ?? []
      return transformRows(rows)
    },
    staleTime: Infinity,          // never consider data stale
    refetchInterval: false,       // no auto-refresh
    refetchOnWindowFocus: false,  // don't refetch when tab regains focus
    refetchOnReconnect: false,    // don't refetch on reconnect
    retry: 1,
  })

  /** Trigger a fresh Dune execution then update the cache with new results */
  async function forceRefresh() {
    if (isRefreshing) return
    setIsRefreshing(true)
    setRefreshError(null)
    try {
      const response = await executeAndGetResults()
      const rows = response.result?.rows ?? []
      queryClient.setQueryData(QUERY_KEY, transformRows(rows))
    } catch (err) {
      setRefreshError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsRefreshing(false)
    }
  }

  return {
    ...query,
    error: refreshError ?? query.error,
    isRefreshing,
    forceRefresh,
  }
}
