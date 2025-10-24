/*
  # Create user_profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles.id)
      - `name` (text, profile name like "Professional", "Personal")
      - `slug` (text, URL-friendly version of name)
      - `is_default` (boolean, whether this is the default profile)
      - `is_public` (boolean, whether profile is publicly visible)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to manage their own profiles
    - Add policy for public to view public profiles

  3. Constraints
    - Unique constraint on (user_id, slug) to prevent duplicate slugs per user
    - Unique constraint on (user_id) where is_default = true to ensure only one default profile per user

  4. Indexes
    - Index on user_id for efficient queries
    - Index on slug for public profile lookups

  5. Triggers
    - Auto-update updated_at timestamp on changes
*/

-- Create the user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  is_public boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own user profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own user profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own user profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own user profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can view public user profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (is_public = true);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_slug_idx ON user_profiles(slug);
CREATE INDEX IF NOT EXISTS user_profiles_is_default_idx ON user_profiles(user_id, is_default);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_slug_key 
  ON user_profiles(user_id, slug);

-- Ensure only one default profile per user
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_default_key 
  ON user_profiles(user_id) 
  WHERE is_default = true;

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Update social_links table to reference user_profiles instead of profiles
DO $$
BEGIN
  -- Check if profile_id column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'social_links' AND column_name = 'profile_id'
  ) THEN
    ALTER TABLE social_links ADD COLUMN profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS social_links_profile_id_idx ON social_links(profile_id);
  END IF;
END $$;

-- Update RLS policies for social_links to work with profiles
DROP POLICY IF EXISTS "Users can manage their own social links" ON social_links;
DROP POLICY IF EXISTS "Users can view their own social links" ON social_links;
DROP POLICY IF EXISTS "Visible social links are viewable by everyone" ON social_links;

CREATE POLICY "Users can manage their own social links"
  ON social_links
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    profile_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    profile_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view visible social links"
  ON social_links
  FOR SELECT
  TO public
  USING (
    is_visible = true AND (
      user_id IN (SELECT id FROM profiles WHERE is_public = true) OR
      profile_id IN (SELECT id FROM user_profiles WHERE is_public = true)
    )
  );