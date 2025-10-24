/*
  # Admin Access Policy

  1. Security
    - Create admin access policy for profiles table
    - Allow admin users to read all profiles
    - Ensure admin operations are logged

  2. Admin Functions
    - Create helper functions for admin operations
    - Add audit logging for admin actions
*/

-- Create admin access policy
CREATE POLICY "Admin users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@socialid.com',
      'rouijel.nabil@gmail.com', 
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    )
  );

-- Create admin access policy for user_profiles
CREATE POLICY "Admin users can read all user_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@socialid.com',
      'rouijel.nabil@gmail.com',
      'contact@nrinfra.fr', 
      'rouijel.nabil.cp@gmail.com'
    )
  );

-- Create admin access policy for social_links
CREATE POLICY "Admin users can read all social_links"
  ON social_links
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@socialid.com',
      'rouijel.nabil@gmail.com',
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    )
  );

-- Create admin access policy for friendships
CREATE POLICY "Admin users can read all friendships"
  ON friendships
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@socialid.com',
      'rouijel.nabil@gmail.com',
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    )
  );

-- Create audit log table for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  admin_email text NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  target_email text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin can read all audit logs
CREATE POLICY "Admin users can read audit logs"
  ON admin_audit_log
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@socialid.com',
      'rouijel.nabil@gmail.com',
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    )
  );

-- Admin can insert audit logs
CREATE POLICY "Admin users can insert audit logs"
  ON admin_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@socialid.com',
      'rouijel.nabil@gmail.com',
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    )
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_type text,
  target_user_id uuid DEFAULT NULL,
  target_email text DEFAULT NULL,
  action_details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_audit_log (
    admin_user_id,
    admin_email,
    action,
    target_user_id,
    target_email,
    details
  ) VALUES (
    auth.uid(),
    auth.jwt() ->> 'email',
    action_type,
    target_user_id,
    target_email,
    action_details
  );
END;
$$;