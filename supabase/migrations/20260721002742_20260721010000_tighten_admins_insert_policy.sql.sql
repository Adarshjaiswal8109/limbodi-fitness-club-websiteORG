-- Tighten admins INSERT policy: users can only insert their own profile
DROP POLICY IF EXISTS auth_insert_admins ON admins;
CREATE POLICY auth_insert_admins ON admins FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
