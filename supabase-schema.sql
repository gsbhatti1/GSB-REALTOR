-- =============================================
-- GSB REALTOR — SUPABASE DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New Query
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------
-- LEADS TABLE
-- Every person who contacts Gurpreet
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  lead_type       TEXT NOT NULL DEFAULT 'contact_form',
  message         TEXT,
  property_id     TEXT,
  property_address TEXT,
  source          TEXT DEFAULT 'website',
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  status          TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'dead')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- -----------------------------------------------
-- PROPERTY VIEWS TABLE
-- Track which listings get the most attention
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS property_views (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_key     TEXT NOT NULL,
  session_id      TEXT,
  user_id         UUID,
  viewed_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS property_views_listing_key_idx ON property_views(listing_key);
CREATE INDEX IF NOT EXISTS property_views_viewed_at_idx ON property_views(viewed_at DESC);

-- -----------------------------------------------
-- SAVED SEARCHES TABLE
-- For when users create accounts
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS saved_searches (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID,
  email           TEXT,
  name            TEXT,
  filters         JSONB NOT NULL DEFAULT '{}',
  alert_enabled   BOOLEAN DEFAULT false,
  alert_frequency TEXT DEFAULT 'daily' CHECK (alert_frequency IN ('instant', 'daily', 'weekly')),
  last_sent_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- SAVED PROPERTIES TABLE
-- Favorite/bookmarked listings
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS saved_properties (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID,
  session_id      TEXT,
  listing_key     TEXT NOT NULL,
  listing_address TEXT,
  listing_price   NUMERIC,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- Row Level Security
-- Leads are private — only service role can read
-- -----------------------------------------------
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

-- Allow insert from public (lead forms on website)
CREATE POLICY "allow_lead_insert" ON leads FOR INSERT WITH CHECK (true);

-- Only service role can select leads (admin dashboard only)
CREATE POLICY "leads_service_only" ON leads FOR SELECT USING (false);

-- Property views — anyone can insert, no reads from public
CREATE POLICY "allow_view_insert" ON property_views FOR INSERT WITH CHECK (true);

-- -----------------------------------------------
-- FUNCTION: Update updated_at automatically
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DONE! Your database is ready.
-- =============================================
