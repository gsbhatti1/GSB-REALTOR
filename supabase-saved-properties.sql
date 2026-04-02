-- GSB Realtor — Saved Properties Table
-- Run this in the Supabase SQL editor to create the saved_properties table

CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- for anonymous users (browser session)
  listing_key TEXT NOT NULL,
  address TEXT,
  city TEXT,
  list_price INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  photo_url TEXT,
  property_type TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_key),
  UNIQUE(session_id, listing_key)
);

CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_session ON saved_properties(session_id);

-- Row Level Security (optional — service role bypasses RLS)
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own saved properties
CREATE POLICY "Users can manage own saved properties"
  ON saved_properties
  FOR ALL
  USING (auth.uid() = user_id OR session_id IS NOT NULL);
