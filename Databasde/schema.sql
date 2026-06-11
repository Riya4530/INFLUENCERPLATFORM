-- =====================================
-- USERS TABLE (MASTER AUTH TABLE)
-- =====================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'influencer', 'admin')),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- INFLUENCER PROFILES
-- =====================================
CREATE TABLE influencer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100),
  followers_count INTEGER DEFAULT 0,
  bio TEXT,
  instagram VARCHAR(255),
  image TEXT,
  city VARCHAR(255),
  verification_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- CAMPAIGNS
-- =====================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  budget NUMERIC,
  category VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- REQUESTS (COLLABORATIONS)
-- =====================================
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  status VARCHAR(20) DEFAULT 'pending',
  quotation_amount NUMERIC,
  deal_status VARCHAR(20),
  invoice_generated BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (brand_id, influencer_id, campaign_id)
);

-- =====================================
-- INVOICES
-- =====================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  influencer_id UUID REFERENCES users(id),
  brand_id UUID REFERENCES users(id),
  campaign_id UUID REFERENCES campaigns(id),

  amount NUMERIC NOT NULL,
  gst NUMERIC NOT NULL,
  total NUMERIC NOT NULL,

  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (influencer_id, campaign_id)
);

-- =====================================
-- CATEGORIES
-- =====================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- CONTACT MESSAGES
-- =====================================
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  subject VARCHAR(200),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- NOTIFICATIONS
-- =====================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);