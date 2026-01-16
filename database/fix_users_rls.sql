-- FIX: RLS policies on users table
-- The current policies are blocking reads. Run this in Supabase SQL Editor.

-- First, check if RLS is enabled
-- If you want to temporarily disable RLS for testing:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or better: Fix the policies properly
-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Allow read access" ON users;
DROP POLICY IF EXISTS "Enable read for users" ON users;
DROP POLICY IF EXISTS "authenticated users can read users" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows authenticated users to read their own row
CREATE POLICY "Users can read own row" ON users
    FOR SELECT 
    USING (auth.uid() = id);

-- Allow authenticated users to read all rows (needed for admin checks on other tables)
-- This is simpler and more permissive
CREATE POLICY "Authenticated users can read users" ON users
    FOR SELECT TO authenticated
    USING (true);

-- Allow users to update their own row
CREATE POLICY "Users can update own row" ON users
    FOR UPDATE 
    USING (auth.uid() = id);

-- Allow admins to update any row
CREATE POLICY "Admins can update any user" ON users
    FOR UPDATE TO authenticated
    USING (
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    );

-- Verify: This should return your users now
SELECT id, email, name, role, subscription_status FROM users;
