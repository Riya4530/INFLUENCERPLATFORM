-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('brand', 'influencer')) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- BRANDS TABLE
-- (Optional: can be merged with users, but keeping as per your design)
-- =========================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- CATEGORIES TABLE
-- =========================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- INFLUENCER PROFILES
-- =========================
CREATE TABLE influencer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  name VARCHAR(255),
  category VARCHAR(100),
  followers_count INTEGER,
  bio TEXT,
  instagram VARCHAR(255),
  image TEXT,
  city VARCHAR(255),
  verification_status VARCHAR(20) DEFAULT 'pending'
);

-- =========================
-- CAMPAIGNS TABLE
-- =========================
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  budget VARCHAR(255),
  category VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- REQUESTS TABLE
-- =========================
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,

  status VARCHAR(20) DEFAULT 'Pending',
  quotation_amount VARCHAR(50),
  deal_status VARCHAR(50),

  invoice_generated BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  -- prevents duplicate influencer applying to same campaign
  UNIQUE (campaign_id, influencer_id)
);

-- =========================
-- INVOICES TABLE
-- =========================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  influencer_email VARCHAR(255) REFERENCES users(email),
  client_name VARCHAR(255),
  campaign_name VARCHAR(255),

  amount NUMERIC NOT NULL,
  gst NUMERIC NOT NULL,
  total NUMERIC NOT NULL,

  status VARCHAR(50) DEFAULT 'Pending',

  created_at TIMESTAMP DEFAULT NOW(),

  -- ensures ONLY ONE invoice per influencer per campaign
  UNIQUE (influencer_email, campaign_name)
);

-- =========================
-- CONTACT MESSAGES TABLE
-- =========================
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  subject VARCHAR(200),
  message VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);