-- GSB Realtor — Testimonials Table
-- Run this in your Supabase SQL editor to create the testimonials table

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  transaction_type TEXT, -- 'bought', 'sold', 'invested', 'commercial'
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public to read approved testimonials
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (approved = true);

-- Allow service role to insert (from API route)
CREATE POLICY "Service role can insert testimonials"
  ON testimonials FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to update (for approving reviews)
CREATE POLICY "Service role can update testimonials"
  ON testimonials FOR UPDATE
  TO service_role
  USING (true);

-- Index for faster approval queries
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Sample data (optional — remove if not needed)
-- INSERT INTO testimonials (name, city, rating, review, transaction_type, approved) VALUES
-- ('Sarah M.', 'West Jordan', 5, 'Gurpreet made buying my first home completely stress-free.', 'bought', true),
-- ('James & Linda T.', 'Sandy', 5, 'We sold for $28,000 over list price. His negotiation skills are exceptional.', 'sold', true);
