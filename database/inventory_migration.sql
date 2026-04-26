-- Inventory Table Migration
-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Create the inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT        NOT NULL,
    category   TEXT        NOT NULL CHECK (category IN ('Shelter', 'Food', 'Medical', 'Equipment')),
    quantity   INTEGER     NOT NULL DEFAULT 0,
    unit       TEXT        NOT NULL DEFAULT '',
    location   TEXT        NOT NULL DEFAULT '',
    status     TEXT        NOT NULL CHECK (status IN ('In Stock', 'Low Stock', 'Critical')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access to inventory" ON inventory
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- Authenticated users can read inventory
CREATE POLICY "Authenticated users can read inventory" ON inventory
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Seed initial data (the default items shown in the UI)
INSERT INTO inventory (name, category, quantity, unit, location, status) VALUES
    ('Family Tents (Type A)',       'Shelter', 150,  'units',  'Gilgit Warehouse', 'In Stock'),
    ('Rice Sacks (20kg)',           'Food',     50,  'bags',   'Skardu Depot',     'Low Stock'),
    ('First Aid Kits',              'Medical', 500,  'kits',   'Gilgit Warehouse', 'In Stock'),
    ('Thermal Blankets',            'Shelter', 1200, 'pcs',    'Hunza Center',     'In Stock'),
    ('Water Purification Tablets',  'Medical',  10,  'boxes',  'Chilas',           'Critical')
ON CONFLICT DO NOTHING;
