import type { VercelRequest, VercelResponse } from '@vercel/node'

const DUNE_API_BASE = 'https://api.dune.com/api/v1'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.DUNE_API_KEY
  const queryId = process.env.DUNE_QUERY_ID

  if (!apiKey || !queryId) {
    return res.status(500).json({ error: 'Dune env vars not configured' })
  }

  // Allow CORS from same origin
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { action, execution_id } = req.query

  try {
    // GET /api/dune?action=results  → fetch latest cached results
    if (req.method === 'GET' && action === 'results') {
      const duneRes = await fetch(
        `${DUNE_API_BASE}/query/${queryId}/results?limit=2000`,
        { headers: { 'X-DUNE-API-KEY': apiKey } },
      )
      const data = await duneRes.json()
      return res.status(duneRes.status).json(data)
    }

    // POST /api/dune?action=execute  → trigger a fresh execution
    if (req.method === 'POST' && action === 'execute') {
      const duneRes = await fetch(
        `${DUNE_API_BASE}/query/${queryId}/execute`,
        {
          method: 'POST',
          headers: { 'X-DUNE-API-KEY': apiKey, 'Content-Type': 'application/json' },
        },
      )
      const data = await duneRes.json()
      return res.status(duneRes.status).json(data)
    }

    // GET /api/dune?action=execution_results&execution_id=xxx  → poll execution
    if (req.method === 'GET' && action === 'execution_results' && execution_id) {
      const duneRes = await fetch(
        `${DUNE_API_BASE}/execution/${execution_id}/results?limit=2000`,
        { headers: { 'X-DUNE-API-KEY': apiKey } },
      )
      const data = await duneRes.json()
      return res.status(duneRes.status).json(data)
    }

    return res.status(400).json({ error: 'Invalid action' })
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
