-- Migration: Update contacts budget values to new enumerations (no explicit transaction)
-- Created: 2026-06-07
-- Purpose: Map legacy budget keys (thousands-based) to the new budget keys
-- For Cloudflare D1 remote execution we avoid explicit BEGIN/COMMIT.

-- Map legacy k-based tiers to the new 'over_1000' bucket
UPDATE contacts
SET budget = 'over_1000'
WHERE budget IN ('under_8k', '8_20k', '20_50k', 'over_50k');

-- Normalize NULL budgets to empty string
UPDATE contacts
SET budget = ''
WHERE budget IS NULL;
