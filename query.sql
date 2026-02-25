-- ═══════════════════════════════════════════════════════════════════
-- EdgeX USDC/USDT Flow Analytics — Ethereum + Arbitrum + BNB Chain
-- Outputs one row per (day, chain) where chain ∈ all|ethereum|arbitrum|bnb
-- ═══════════════════════════════════════════════════════════════════
--
-- CONTRACTS
--   Ethereum
--     StarkPerpetual  0xfAaE2946e846133af314d1Df13684c89fA7d83DD
--     EdgeXDepositor  0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5
--   Arbitrum One
--     MultisigPoolV5  0xceeed84620e5eb9ab1d6dfc316867d2cda332e41
--     Depositor       0x965dc72531bc322cab5537d432bb14451cabb30d
--     Depositor2      0x81144d6E7084928830f9694a201E8c1ce6eD0cb2
--   BNB Chain
--     MultisigPoolV5  0x3EedB0d9C95263778a62081F2A62FC77a392116d
--
-- TOKENS
--   Ethereum  USDC 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 (6 dec)
--             USDT 0xdac17f958d2ee523a2206206994597c13d831ec7 (6 dec)
--   Arbitrum  USDC 0xaf88d065e77c8cC2239327C5EDb3A432268e5831 (6 dec, native)
--             USDC.e 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8 (6 dec)
--             USDT 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9 (6 dec)
--   BNB Chain USDC 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d (18 dec)
--             USDT 0x55d398326f99059fF775485246999027B3197955 (18 dec)
-- ═══════════════════════════════════════════════════════════════════

WITH

-- ── RAW TRANSFERS ─────────────────────────────────────────────────

eth_deposits AS (
  SELECT
    date_trunc('day', evt_block_time)    AS day,
    CAST(value AS DOUBLE) / 1e6          AS amount_usd,
    "from"                               AS wallet
  FROM erc20_ethereum.evt_Transfer
  WHERE contract_address IN (
    0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,
    0xdac17f958d2ee523a2206206994597c13d831ec7
  )
  AND "to" IN (
    0xfAaE2946e846133af314d1Df13684c89fA7d83DD,
    0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5
  )
  AND "from" NOT IN (
    0xfAaE2946e846133af314d1Df13684c89fA7d83DD,
    0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5
  )
),

eth_withdrawals AS (
  SELECT
    date_trunc('day', evt_block_time)    AS day,
    CAST(value AS DOUBLE) / 1e6          AS amount_usd,
    "to"                                 AS wallet
  FROM erc20_ethereum.evt_Transfer
  WHERE contract_address IN (
    0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,
    0xdac17f958d2ee523a2206206994597c13d831ec7
  )
  AND "from" IN (
    0xfAaE2946e846133af314d1Df13684c89fA7d83DD,
    0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5
  )
  AND "to" NOT IN (
    0xfAaE2946e846133af314d1Df13684c89fA7d83DD,
    0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5
  )
),

arb_deposits AS (
  SELECT
    date_trunc('day', evt_block_time)    AS day,
    CAST(value AS DOUBLE) / 1e6          AS amount_usd,
    "from"                               AS wallet
  FROM erc20_arbitrum.evt_Transfer
  WHERE contract_address IN (
    0xaf88d065e77c8cC2239327C5EDb3A432268e5831,
    0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8,
    0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9
  )
  AND "to" IN (
    0xceeed84620e5eb9ab1d6dfc316867d2cda332e41,
    0x965dc72531bc322cab5537d432bb14451cabb30d,
    0x81144d6E7084928830f9694a201E8c1ce6eD0cb2
  )
  AND "from" NOT IN (
    0xceeed84620e5eb9ab1d6dfc316867d2cda332e41,
    0x965dc72531bc322cab5537d432bb14451cabb30d,
    0x81144d6E7084928830f9694a201E8c1ce6eD0cb2
  )
),

arb_withdrawals AS (
  SELECT
    date_trunc('day', evt_block_time)    AS day,
    CAST(value AS DOUBLE) / 1e6          AS amount_usd,
    "to"                                 AS wallet
  FROM erc20_arbitrum.evt_Transfer
  WHERE contract_address IN (
    0xaf88d065e77c8cC2239327C5EDb3A432268e5831,
    0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8,
    0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9
  )
  AND "from" IN (
    0xceeed84620e5eb9ab1d6dfc316867d2cda332e41,
    0x965dc72531bc322cab5537d432bb14451cabb30d,
    0x81144d6E7084928830f9694a201E8c1ce6eD0cb2
  )
  AND "to" NOT IN (
    0xceeed84620e5eb9ab1d6dfc316867d2cda332e41,
    0x965dc72531bc322cab5537d432bb14451cabb30d,
    0x81144d6E7084928830f9694a201E8c1ce6eD0cb2
  )
),

-- Note: USDC & USDT on BSC use 18 decimals
bnb_deposits AS (
  SELECT
    date_trunc('day', evt_block_time)    AS day,
    CAST(value AS DOUBLE) / 1e18         AS amount_usd,
    "from"                               AS wallet
  FROM erc20_bnb.evt_Transfer
  WHERE contract_address IN (
    0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d,
    0x55d398326f99059fF775485246999027B3197955
  )
  AND "to" IN (
    0x3EedB0d9C95263778a62081F2A62FC77a392116d
  )
  AND "from" NOT IN (
    0x3EedB0d9C95263778a62081F2A62FC77a392116d
  )
),

bnb_withdrawals AS (
  SELECT
    date_trunc('day', evt_block_time)    AS day,
    CAST(value AS DOUBLE) / 1e18         AS amount_usd,
    "to"                                 AS wallet
  FROM erc20_bnb.evt_Transfer
  WHERE contract_address IN (
    0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d,
    0x55d398326f99059fF775485246999027B3197955
  )
  AND "from" IN (
    0x3EedB0d9C95263778a62081F2A62FC77a392116d
  )
  AND "to" NOT IN (
    0x3EedB0d9C95263778a62081F2A62FC77a392116d
  )
),

-- ── PER-CHAIN + COMBINED DAILY AGGREGATES ─────────────────────────

chain_deposits AS (
  -- Ethereum
  SELECT 'ethereum' AS chain, day,
    SUM(amount_usd)                                        AS daily_deposit_volume_24h,
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)   AS avg_deposit_size_per_wallet
  FROM eth_deposits GROUP BY day

  UNION ALL

  -- Arbitrum
  SELECT 'arbitrum' AS chain, day,
    SUM(amount_usd),
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)
  FROM arb_deposits GROUP BY day

  UNION ALL

  -- BNB Chain
  SELECT 'bnb' AS chain, day,
    SUM(amount_usd),
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)
  FROM bnb_deposits GROUP BY day

  UNION ALL

  -- All chains combined
  SELECT 'all' AS chain, day,
    SUM(amount_usd),
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)
  FROM (
    SELECT day, amount_usd, wallet FROM eth_deposits
    UNION ALL
    SELECT day, amount_usd, wallet FROM arb_deposits
    UNION ALL
    SELECT day, amount_usd, wallet FROM bnb_deposits
  )
  GROUP BY day
),

chain_withdrawals AS (
  -- Ethereum
  SELECT 'ethereum' AS chain, day,
    SUM(amount_usd)                                        AS daily_withdrawal_volume_24h,
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)   AS avg_withdrawal_size_per_wallet
  FROM eth_withdrawals GROUP BY day

  UNION ALL

  -- Arbitrum
  SELECT 'arbitrum' AS chain, day,
    SUM(amount_usd),
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)
  FROM arb_withdrawals GROUP BY day

  UNION ALL

  -- BNB Chain
  SELECT 'bnb' AS chain, day,
    SUM(amount_usd),
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)
  FROM bnb_withdrawals GROUP BY day

  UNION ALL

  -- All chains combined
  SELECT 'all' AS chain, day,
    SUM(amount_usd),
    SUM(amount_usd) / NULLIF(COUNT(DISTINCT wallet), 0)
  FROM (
    SELECT day, amount_usd, wallet FROM eth_withdrawals
    UNION ALL
    SELECT day, amount_usd, wallet FROM arb_withdrawals
    UNION ALL
    SELECT day, amount_usd, wallet FROM bnb_withdrawals
  )
  GROUP BY day
),

all_chain_days AS (
  SELECT chain, day FROM chain_deposits
  UNION
  SELECT chain, day FROM chain_withdrawals
),

daily AS (
  SELECT
    d.chain,
    d.day,
    COALESCE(dep.daily_deposit_volume_24h,      0)  AS daily_deposit_volume_24h,
    COALESCE(dep.avg_deposit_size_per_wallet,   0)  AS avg_deposit_size_per_wallet,
    COALESCE(wd.daily_withdrawal_volume_24h,    0)  AS daily_withdrawal_volume_24h,
    COALESCE(wd.avg_withdrawal_size_per_wallet, 0)  AS avg_withdrawal_size_per_wallet
  FROM all_chain_days d
  LEFT JOIN chain_deposits    dep ON dep.chain = d.chain AND dep.day = d.day
  LEFT JOIN chain_withdrawals wd  ON wd.chain  = d.chain AND wd.day  = d.day
)

-- ── FINAL OUTPUT ──────────────────────────────────────────────────
SELECT
  day,
  chain,
  daily_deposit_volume_24h,
  daily_withdrawal_volume_24h,

  -- Month-to-date (resets each calendar month, per chain)
  SUM(daily_deposit_volume_24h) OVER (
    PARTITION BY chain, date_trunc('month', day)
    ORDER BY day
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS monthly_total_deposits,

  SUM(daily_withdrawal_volume_24h) OVER (
    PARTITION BY chain, date_trunc('month', day)
    ORDER BY day
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS monthly_total_withdrawals,

  -- 30-day rolling average (per chain)
  AVG(daily_deposit_volume_24h) OVER (
    PARTITION BY chain
    ORDER BY day
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) AS avg_deposit_per_day_30d,

  AVG(daily_withdrawal_volume_24h) OVER (
    PARTITION BY chain
    ORDER BY day
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) AS avg_withdrawal_per_day_30d,

  avg_deposit_size_per_wallet,
  avg_withdrawal_size_per_wallet

FROM daily
ORDER BY chain, day DESC
