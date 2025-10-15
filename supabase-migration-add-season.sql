-- Migration to add season tracking to assessments
-- Run this in your Supabase SQL Editor

-- Add season column to assessments table
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS season TEXT;

-- Set a default season for existing assessments based on their date
-- This sets season to "YYYY-YYYY+1" format based on assessment date
-- Hockey seasons typically run Sept-Aug, so dates Sept-Dec are YYYY-YYYY+1, Jan-Aug are YYYY-1-YYYY
UPDATE assessments
SET season =
  CASE
    WHEN EXTRACT(MONTH FROM date) >= 9 THEN
      EXTRACT(YEAR FROM date)::text || '-' || (EXTRACT(YEAR FROM date) + 1)::text
    ELSE
      (EXTRACT(YEAR FROM date) - 1)::text || '-' || EXTRACT(YEAR FROM date)::text
  END
WHERE season IS NULL;

-- Create index for fast season filtering
CREATE INDEX IF NOT EXISTS idx_assessments_season ON assessments(season);

-- Add comment to explain the column
COMMENT ON COLUMN assessments.season IS 'Hockey season in format YYYY-YYYY (e.g., 2024-2025)';
