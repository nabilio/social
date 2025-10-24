/*
  # Fix admin permissions for user deletion

  1. Security Updates
    - Add proper admin policies for all tables
    - Enable admin users to delete any user data
    - Add audit logging for admin actions

  2. Tables Updated
    - profiles: Allow admin delete
    - user_profiles: Allow admin delete  
    - social_links: Allow admin delete
    - friendships: Allow admin delete
    - admin_audit_log: Allow admin insert/select
*/

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean AS $$
BEGIN
  RETURN (jwt() ->> 'email') = ANY (ARRAY[
    'admin@socialid.com',
    'rouijel.nabil@gmail.com', 
    'contact@nrinfra.fr',
    'rouijel.nabil.cp@gmail.com'
  ]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admin users can delete any profile" ON profiles;
DROP POLICY IF EXISTS "Admin users can delete any user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can delete any social_link" ON social_links;
DROP POLICY IF EXISTS "Admin users can delete any friendship" ON friendships;

-- Create comprehensive admin policies for profiles
CREATE POLICY "Admin users can delete any profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Create comprehensive admin policies for user_profiles
CREATE POLICY "Admin users can delete any user_profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any user_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Create comprehensive admin policies for social_links
CREATE POLICY "Admin users can delete any social_link"
  ON social_links
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any social_link"
  ON social_links
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Create comprehensive admin policies for friendships
CREATE POLICY "Admin users can delete any friendship"
  ON friendships
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can update any friendship"
  ON friendships
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_type text,
  target_user_id uuid DEFAULT NULL,
  target_email text DEFAULT NULL,
  action_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
DECLARE
  admin_email text;
BEGIN
  admin_email := jwt() ->> 'email';
  
  IF is_admin_user() THEN
    INSERT INTO admin_audit_log (
      admin_user_id,
      admin_email,
      action,
      target_user_id,
      target_email,
      details
    ) VALUES (
      auth.uid(),
      admin_email,
      action_type,
      target_user_id,
      target_email,
      action_details
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;