/*
  # Fix user profiles visibility for public view

  1. Security Changes
    - Update RLS policy to allow reading all user profiles (public and private)
    - This enables proper display of private profiles with restricted content
    - Private profile content is still protected by application logic

  2. Policy Updates
    - Allow public to view all user profiles (visibility controlled in app)
    - Maintain existing policies for authenticated users
*/

-- Drop existing public policy for user_profiles
DROP POLICY IF EXISTS "Public can view public user profiles" ON user_profiles;

-- Create new policy that allows reading all user profiles
-- The application will control what content is shown based on privacy settings
CREATE POLICY "Public can view all user profiles for display"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

-- Keep existing authenticated user policies unchanged
-- Users can still manage their own profiles normally