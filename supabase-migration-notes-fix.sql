-- Migration to add skill_ratings and fix notes field
-- Run this in your Supabase SQL Editor
-- WARNING: This will drop any existing notes data

-- Step 1: Add skill_ratings column
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS skill_ratings JSONB DEFAULT '{}'::jsonb;

-- Step 2: Drop old notes column (we'll recreate it as JSONB)
ALTER TABLE assessments
  DROP COLUMN IF EXISTS notes;

-- Step 3: Add new notes column as JSONB
ALTER TABLE assessments
  ADD COLUMN notes JSONB DEFAULT '{}'::jsonb;
