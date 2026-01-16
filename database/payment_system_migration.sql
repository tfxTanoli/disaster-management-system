-- Manual Payment & Subscription System Migration
-- Run this in your Supabase SQL Editor

-- Add subscription fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- Set trial_ends_at for existing users (1 month from now)
UPDATE users SET trial_ends_at = NOW() + INTERVAL '1 month' WHERE trial_ends_at IS NULL;

-- Payment submissions table
CREATE TABLE IF NOT EXISTS payment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    user_name TEXT,
    amount DECIMAL(10,2) NOT NULL,
    proof_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- Payment settings table (admin-controlled, single row)
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name TEXT DEFAULT 'HBL',
    bank_account_number TEXT DEFAULT '1234567890',
    bank_account_title TEXT DEFAULT 'GBDMS Official',
    easypaisa_number TEXT DEFAULT '03001234567',
    jazzcash_number TEXT DEFAULT '03001234567',
    monthly_price DECIMAL(10,2) DEFAULT 1000,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default payment settings row if empty
INSERT INTO payment_settings (id, bank_name, bank_account_number, bank_account_title, easypaisa_number, jazzcash_number, monthly_price)
SELECT gen_random_uuid(), 'HBL', '1234567890', 'GBDMS Official', '03001234567', '03001234567', 1000
WHERE NOT EXISTS (SELECT 1 FROM payment_settings);

-- Enable RLS
ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_submissions
CREATE POLICY "Users can view own submissions" ON payment_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON payment_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" ON payment_submissions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

CREATE POLICY "Admins can update submissions" ON payment_submissions
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- RLS Policies for payment_settings
CREATE POLICY "Anyone can read payment settings" ON payment_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update payment settings" ON payment_settings
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );
