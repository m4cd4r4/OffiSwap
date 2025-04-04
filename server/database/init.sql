-- Drop tables if they exist to ensure a clean slate (optional, use with caution in development)
DROP TABLE IF EXISTS Claims;
DROP TABLE IF EXISTS ListingImages;
DROP TABLE IF EXISTS Listings;
DROP TABLE IF EXISTS Users;

-- Create Users table (representing companies)
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    location TEXT, -- Could be address, city, etc.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Listings table
CREATE TYPE listing_status AS ENUM ('available', 'claimed', 'exchanged');
CREATE TYPE item_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');

CREATE TABLE Listings (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    item_type VARCHAR(100), -- e.g., 'Desk', 'Chair', 'Monitor'
    quantity INTEGER DEFAULT 1,
    condition item_condition,
    location TEXT, -- Location of the items
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    status listing_status DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create ListingImages table
CREATE TABLE ListingImages (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES Listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL, -- URL or path to the image
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Claims table (representing buyer interest)
CREATE TYPE claim_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE Claims (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES Listings(id) ON DELETE CASCADE,
    buyer_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    status claim_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (listing_id, buyer_id) -- Prevent duplicate claims by the same buyer for the same listing
);

-- Optional: Add indexes for frequently queried columns
CREATE INDEX idx_listings_seller_id ON Listings(seller_id);
CREATE INDEX idx_listings_status ON Listings(status);
CREATE INDEX idx_listings_item_type ON Listings(item_type);
CREATE INDEX idx_claims_listing_id ON Claims(listing_id);
CREATE INDEX idx_claims_buyer_id ON Claims(buyer_id);

-- Optional: Trigger function to update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON Users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON Listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON Claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
