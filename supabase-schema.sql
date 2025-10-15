-- Hockey Baseline Development Tracker - Database Schema
-- Run this in your Supabase SQL Editor

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  assessor TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_assessments_player_id ON assessments(player_id);
CREATE INDEX IF NOT EXISTS idx_assessments_date ON assessments(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (you can customize these later for auth)
-- WARNING: These policies allow anyone to read/write.
-- Update these if you want to add authentication later.

-- Players policies
CREATE POLICY "Enable read access for all users" ON players
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON players
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON players
  FOR DELETE USING (true);

-- Assessments policies
CREATE POLICY "Enable read access for all users" ON assessments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON assessments
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON assessments
  FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to automatically update updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
