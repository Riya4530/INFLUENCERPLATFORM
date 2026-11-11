-- ==========================================================
-- Influencer Platform Database Schema & Seed Data
-- Compatible with PostgreSQL (Localhost & Render)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. USERS TABLE
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS influencer_profiles CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'influencer', 'admin')),
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. INFLUENCER PROFILES
CREATE TABLE influencer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
    name VARCHAR(255),
    category VARCHAR(100),
    followers_count INTEGER DEFAULT 0,
    bio TEXT,
    instagram VARCHAR(255),
    image TEXT,
    city VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. CAMPAIGNS
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    budget NUMERIC(10,2),
    category VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. REQUESTS (COLLABORATIONS)
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Pending',
    quotation_amount VARCHAR(50),
    deal_status VARCHAR(50),
    invoice_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_id)
);

-- 6. INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
    influencer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES users(id) ON DELETE SET NULL,
    influencer_email VARCHAR(255),
    brand_email VARCHAR(255),
    client_name VARCHAR(255),
    campaign_name VARCHAR(255),
    amount NUMERIC NOT NULL,
    gst NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    pdf_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. CONTACT MESSAGES
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- ADMIN USER (Password: admin123 or platform default)
INSERT INTO users (name, email, password, role, status)
VALUES
(
    'Admin',
    'admin@platform.com',
    '$2b$10$rsRHDnaVr2wmJPWFIRjNnOHzm7T3noQ6NjKsVaO7rIdw9AGHuw/Z2',
    'admin',
    'active'
);

-- BRANDS
INSERT INTO users (name, email, password, role, status)
VALUES
(
    'Brandly India',
    'contact@brandly.com',
    '$2b$10$RVP4D0CeU5IzmPesuE88n.RAf5eYAB03EPGkUKRqfwXsgBJkiwZ.S',
    'brand',
    'active'
),
(
    'Nike India',
    'nike@brand.com',
    '$2b$10$RVP4D0CeU5IzmPesuE88n.RAf5eYAB03EPGkUKRqfwXsgBJkiwZ.S',
    'brand',
    'active'
),
(
    'Adidas India',
    'adidas@brand.com',
    '$2b$10$RVP4D0CeU5IzmPesuE88n.RAf5eYAB03EPGkUKRqfwXsgBJkiwZ.S',
    'brand',
    'active'
);

-- INFLUENCERS
INSERT INTO users (name, email, password, role, status)
VALUES
(
    'Aarav Mehta',
    'aarav@gmail.com',
    '$2b$10$rsRHDnaVr2wmJPWFIRjNnOHzm7T3noQ6NjKsVaO7rIdw9AGHuw/Z2',
    'influencer',
    'active'
),
(
    'Karan Patel',
    'karan@gmail.com',
    '$2b$10$rsRHDnaVr2wmJPWFIRjNnOHzm7T3noQ6NjKsVaO7rIdw9AGHuw/Z2',
    'influencer',
    'active'
),
(
    'Simran Kaur',
    'simran@gmail.com',
    '$2b$10$RVP4D0CeU5IzmPesuE88n.RAf5eYAB03EPGkUKRqfwXsgBJkiwZ.S',
    'influencer',
    'active'
),
(
    'Dev Sharma',
    'dev@gmail.com',
    '$2b$10$rsRHDnaVr2wmJPWFIRjNnOHzm7T3noQ6NjKsVaO7rIdw9AGHuw/Z2',
    'influencer',
    'active'
);

-- CATEGORIES
INSERT INTO categories (name)
VALUES
('tech'),
('fashion'),
('fitness'),
('beauty'),
('gaming'),
('travel'),
('food'),
('education'),
('lifestyle'),
('sports'),
('finance'),
('automobile');

-- INFLUENCER PROFILES
INSERT INTO influencer_profiles
(
    user_id,
    user_email,
    name,
    category,
    followers_count,
    bio,
    instagram,
    image,
    city,
    verification_status
)
VALUES
(
    (SELECT id FROM users WHERE email='aarav@gmail.com'),
    'aarav@gmail.com',
    'Aarav Mehta',
    'tech',
    12000,
    'Tech reviewer & gadget explorer',
    '@aaravtech',
    'https://res.cloudinary.com/djwrldhh1/image/upload/v1780502410/influencers/stb2lsbuxfp3u2vqt6sq.jpg',
    'Mumbai',
    'Verified'
),
(
    (SELECT id FROM users WHERE email='karan@gmail.com'),
    'karan@gmail.com',
    'Karan Patel',
    'fitness',
    30000,
    'Fitness coach & transformation guide',
    '@karanfit',
    'https://res.cloudinary.com/djwrldhh1/image/upload/v1781288539/profiles/i6nm16puq88wu6z113on.webp',
    'Pune',
    'Verified'
),
(
    (SELECT id FROM users WHERE email='simran@gmail.com'),
    'simran@gmail.com',
    'Simran Kaur',
    'beauty',
    55000,
    'Makeup & skincare enthusiast',
    '@simranbeauty',
    'https://res.cloudinary.com/djwrldhh1/image/upload/v1780145937/main-sample.png',
    'Jaipur',
    'pending'
),
(
    (SELECT id FROM users WHERE email='dev@gmail.com'),
    'dev@gmail.com',
    'Dev Sharma',
    'gaming',
    80000,
    'Gaming streamer & esports lover',
    '@devgaming',
    'https://res.cloudinary.com/djwrldhh1/image/upload/v1781286956/image-1778067529145_dtgwmc.webp',
    'Bangalore',
    'Verified'
);

-- CONTACT MESSAGES
INSERT INTO contact_messages (name, email, subject, message)
VALUES
('John Doe', 'john@gmail.com', 'Collaboration', 'I want to collaborate with influencers for my brand.'),
('Sara Ali', 'sara@gmail.com', 'Verification', 'How do I become a verified influencer?'),
('Marketing Team', 'marketing@brand.com', 'Campaign', 'Looking for tech influencers for campaign.'),
('Ravi Kumar', 'ravi@gmail.com', 'Signup Issue', 'Facing issue while signing up.'),
('Neha Sharma', 'neha@gmail.com', 'Suggestion', 'Great platform, want more fashion influencers.'),
('Amit Patel', 'amit@gmail.com', 'Support', 'Need help with campaign creation.');

-- CAMPAIGNS
INSERT INTO campaigns (brand_id, title, budget, category, description, status)
VALUES
(
    (SELECT id FROM users WHERE email='nike@brand.com'),
    'Nike Air Max Launch',
    50000,
    'fashion',
    'Promote the new Nike Air Max collection.',
    'Active'
),
(
    (SELECT id FROM users WHERE email='adidas@brand.com'),
    'Adidas Sports Challenge',
    75000,
    'sports',
    'Promote Adidas sportswear on Instagram.',
    'Active'
),
(
    (SELECT id FROM users WHERE email='contact@brandly.com'),
    'Tech Creator Hunt',
    40000,
    'tech',
    'Looking for technology creators.',
    'Active'
);

-- REQUESTS
INSERT INTO requests (brand_id, influencer_id, campaign_id, status, quotation_amount, deal_status, invoice_generated)
VALUES
(
    (SELECT id FROM users WHERE email='nike@brand.com'),
    (SELECT id FROM users WHERE email='karan@gmail.com'),
    1,
    'Completed',
    '25000',
    'Accepted',
    TRUE
),
(
    (SELECT id FROM users WHERE email='adidas@brand.com'),
    (SELECT id FROM users WHERE email='dev@gmail.com'),
    2,
    'Pending',
    '35000',
    'Negotiation',
    FALSE
),
(
    (SELECT id FROM users WHERE email='contact@brandly.com'),
    (SELECT id FROM users WHERE email='aarav@gmail.com'),
    3,
    'Completed',
    '20000',
    'Accepted',
    TRUE
);

-- INVOICES
INSERT INTO invoices (request_id, campaign_id, influencer_id, brand_id, influencer_email, brand_email, client_name, campaign_name, amount, gst, total, status)
VALUES
(
    1,
    1,
    (SELECT id FROM users WHERE email='karan@gmail.com'),
    (SELECT id FROM users WHERE email='nike@brand.com'),
    'karan@gmail.com',
    'nike@brand.com',
    'Nike India',
    'Nike Air Max Launch',
    25000,
    4500,
    29500,
    'Paid'
),
(
    3,
    3,
    (SELECT id FROM users WHERE email='aarav@gmail.com'),
    (SELECT id FROM users WHERE email='contact@brandly.com'),
    'aarav@gmail.com',
    'contact@brandly.com',
    'Brandly India',
    'Tech Creator Hunt',
    20000,
    3600,
    23600,
    'Pending'
);