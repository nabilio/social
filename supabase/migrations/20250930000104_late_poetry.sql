/*
  # Fix JWT function in RLS policies

  1. Problem
    - The function `jwt()` does not exist in Supabase
    - Need to use `auth.jwt()` instead
    - Update all admin policies to use correct JWT function

  2. Solution
    - Drop existing policies that use incorrect JWT function
    - Recreate policies with correct `auth.jwt()` function
    - Ensure all admin emails are properly referenced
*/

-- Drop existing policies that might have incorrect JWT function
DROP POLICY IF EXISTS "Admin users can delete any profile" ON profiles;
DROP POLICY IF EXISTS "Admin users can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admin users can read all profiles" ON profiles;

DROP POLICY IF EXISTS "Admin users can delete any user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can update any user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can read all user_profiles" ON user_profiles;

DROP POLICY IF EXISTS "Admin users can delete any social_link" ON social_links;
DROP POLICY IF EXISTS "Admin users can update any social_link" ON social_links;
DROP POLICY IF EXISTS "Admin users can read all social_links" ON social_links;

DROP POLICY IF EXISTS "Admin users can delete any friendship" ON friendships;
DROP POLICY IF EXISTS "Admin users can update any friendship" ON friendships;
DROP POLICY IF EXISTS "Admin users can read all friendships" ON friendships;

-- Create corrected admin function
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT (auth.jwt() ->> 'email') = ANY (ARRAY[
    'admin@socialid.com',
    'rouijel.nabil@gmail.com',
    'contact@nrinfra.fr',
    'rouijel.nabil.cp@gmail.com'
  ]);
$$;

-- Recreate admin policies for profiles table
CREATE POLICY "Admin users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can delete any profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- Recreate admin policies for user_profiles table
CREATE POLICY "Admin users can read all user_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any user_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can delete any user_profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- Recreate admin policies for social_links table
CREATE POLICY "Admin users can read all social_links"
  ON social_links
  FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any social_link"
  ON social_links
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can delete any social_link"
  ON social_links
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- Recreate admin policies for friendships table
CREATE POLICY "Admin users can read all friendships"
  ON friendships
  FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any friendship"
  ON friendships
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can delete any friendship"
  ON friendships
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- Test the admin function
SELECT is_admin_user() as admin_check;