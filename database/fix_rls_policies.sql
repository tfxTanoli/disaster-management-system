-- FIX: RLS Policy for payment_submissions
-- Run this in Supabase SQL Editor to fix the "new row violates row-level security policy" error

-- First, drop the existing restrictive policies
DROP POLICY IF EXISTS "Users can view own submissions" ON payment_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON payment_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON payment_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON payment_submissions;

-- Create simpler, working policies

-- Allow authenticated users to insert their own payment submissions
CREATE POLICY "Authenticated users can insert submissions" ON payment_submissions
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON payment_submissions
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Admins can view ALL submissions
CREATE POLICY "Admins can view all submissions" ON payment_submissions
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- Admins can update submissions (approve/reject)
CREATE POLICY "Admins can update submissions" ON payment_submissions
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================
-- After creating the 'payment-proofs' bucket, run these policies:

-- Allow authenticated users to upload to payment-proofs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload payment proofs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow public read access to payment proofs (for admin viewing)
CREATE POLICY "Anyone can view payment proofs"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'payment-proofs');
