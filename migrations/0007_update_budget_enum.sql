-- Migration: Update contacts budget values to new enumerations
-- Created: 2026-06-07
-- Purpose: Map legacy budget keys (thousands-based) to the new budget keys
-- Note: The `contacts.budget` column is TEXT and has no CHECK constraint in the
-- original migration. This migration performs a best-effort mapping of existing
-- values so the application can rely on the new set of keys.

BEGIN TRANSACTION;

-- Map legacy k-based tiers to the new 'over_1000' bucket, since legacy values
-- like 'under_8k' and '20_50k' represent budgets well above the new small-dollar
-- tiers used on the public site.
UPDATE contacts
SET budget = 'over_1000'
WHERE budget IN ('under_8k', '8_20k', '20_50k', 'over_50k');

-- For any NULL budgets, set to empty string for consistency with application
-- expectation (the contact API accepts empty string as 'not sure yet').
UPDATE contacts
SET budget = ''
WHERE budget IS NULL;

COMMIT;
