# Season Tracking Feature - Setup Instructions

## Overview
This feature adds hockey season tracking to your assessments, allowing you to filter and compare player progress across multiple seasons.

## Step 1: Database Migration

**IMPORTANT:** Before deploying the updated app, you MUST run this SQL in your Supabase database.

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the SQL from `supabase-migration-add-season.sql`
6. Click **Run**

The migration will:
- Add a `season` column to the assessments table
- Auto-populate existing assessments with seasons based on their dates
- Create an index for fast season filtering

## Step 2: Deploy the App

After running the SQL migration, the updated app will be deployed with these new features:

### New Features:

1. **Assessment Form** (`/assess`)
   - New "Season" dropdown field
   - Auto-updates when you change the assessment date
   - Defaults to current season (e.g., "2024-2025")

2. **Reports** (`/reports`)
   - "Filter by Season" dropdown
   - Select "All Seasons" or a specific season
   - Progress charts filter by selected season
   - Assessment history shows season for each assessment

3. **Dashboard** (`/`)
   - New stat box showing current season assessment count
   - Recent assessments display their season

### How Seasons Work:

- Hockey seasons run September through August
- Format: "YYYY-YYYY" (e.g., "2024-2025")
- September - December → Current year to next year
- January - August → Previous year to current year
- Example: Assessment on November 2024 = "2024-2025" season
- Example: Assessment on March 2025 = "2024-2025" season

## Benefits:

✅ Track player development year-over-year
✅ Compare "End Season 2024" vs "End Season 2025"
✅ Filter reports to focus on current season
✅ See long-term trends across multiple years
✅ Better organization of assessment data

## Files Changed:

- `src/utils/seasonHelper.js` - New utility for season calculations
- `src/components/NewAssessment.jsx` - Added season field
- `src/components/Reports.jsx` - Added season filter
- `src/components/PlayerProgress.jsx` - Added season filtering to charts
- `src/components/Dashboard.jsx` - Added current season stats
- `src/utils/supabaseClient.js` - Updated to save season field
- `supabase-migration-add-season.sql` - Database migration script
