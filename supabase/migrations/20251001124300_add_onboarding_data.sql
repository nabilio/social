/*
  # Add Onboarding Data

  1. Changes
    - Add `user_type` column to profiles table (creator/standard)
    - Add `onboarding_completed` column to profiles table
    - Create `onboarding_social_links` table to store selected social networks during onboarding
    
  2. New Tables
    - `onboarding_social_links`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `platform` (text, social platform name)
      - `username` (text, username on that platform)
      - `profile_id` (uuid, references user_profiles - which profile category this link belongs to)
      - `created_at` (timestamp)
  
  3. Security
    - Enable RLS on `onboarding_social_links` table
    - Add policies for users to manage their own onboarding data
*/

-- Add columns to profiles table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_type text DEFAULT 'standard' CHECK (user_type IN ('creator', 'standard'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Create onboarding_social_links table
CREATE TABLE IF NOT EXISTS onboarding_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  username text NOT NULL,
  profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE onboarding_social_links ENABLE ROW LEVEL SECURITY;

-- Onboarding social links policies
CREATE POLICY "Users can view their own onboarding social links"
  ON onboarding_social_links FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own onboarding social links"
  ON onboarding_social_links FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding social links"
  ON onboarding_social_links FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own onboarding social links"
  ON onboarding_social_links FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS onboarding_social_links_user_id_idx ON onboarding_social_links(user_id);
CREATE INDEX IF NOT EXISTS onboarding_social_links_profile_id_idx ON onboarding_social_links(profile_id);