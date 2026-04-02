CREATE TABLE IF NOT EXISTS listing_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  cities TEXT[] NOT NULL, -- array of city names e.g. ['West Jordan', 'South Jordan']
  min_price INTEGER,
  max_price INTEGER,
  min_beds INTEGER,
  property_types TEXT[], -- ['Residential', 'Commercial Sale']
  active BOOLEAN DEFAULT TRUE,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribe_token TEXT DEFAULT gen_random_uuid()::text
);

CREATE INDEX idx_listing_alerts_email ON listing_alerts(email);
CREATE INDEX idx_listing_alerts_active ON listing_alerts(active);
