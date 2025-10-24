/*
  # Add profile_id to social_links table

  1. Changes
    - Add `profile_id` column to `social_links` table
    - This allows social links to be associated with specific user profiles
    - Enables users to organize their social links across multiple profiles (Personal, Professional, etc.)
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add profile_id column to social_links if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'social_links' AND column_name = 'profile_id'
  ) THEN
    ALTER TABLE social_links ADD COLUMN profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS social_links_profile_id_idx ON social_links(profile_id);