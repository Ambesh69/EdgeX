import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getQueryResults, executeAndGetResults, transformRows } from '@/lib/dune'
import type { DailyStats } from '@/lib/types'

const QUERY_KEY = ['edgex-flows']

export function useDuneQuery() {
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

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
    try {
      const response = await executeAndGetResults()
      const rows = response.result?.rows ?? []
      queryClient.setQueryData(QUERY_KEY, transformRows(rows))
    } catch (err) {
      // Fall back to a regular refetch so the error surface is consistent
      await query.refetch()
      throw err
    } finally {
      setIsRefreshing(false)
    }
  }

  return {
    ...query,
    isRefreshing,
    forceRefresh,
  }
}
