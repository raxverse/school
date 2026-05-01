/*
  # Create profiles table with RLS and auto-insert trigger

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id with ON DELETE CASCADE)
      - `full_name` (text, default '')
      - `phone` (text, default '')
      - `role` (text, default 'student', check constraint: 'admin', 'teacher', 'student')
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `profiles` table
    - Policy: Users can read their own profile (SELECT where id = auth.uid())
    - Policy: Users can update their own profile (UPDATE where id = auth.uid())
    - Policy: Admins can read all profiles (SELECT where role = 'admin' in own profile)
    - Policy: Admins can update any profile (UPDATE where role = 'admin' in own profile)

  3. Functions & Triggers
    - Function `handle_new_user()`: Automatically inserts a row into profiles
      when a new user is created in auth.users, using the user's id and
      extracting full_name and phone from user metadata.
    - Trigger `on_auth_user_created`: Fires AFTER INSERT on auth.users

  4. Important Notes
    1. The trigger extracts `full_name` and `phone` from auth.users raw_user_meta_data
    2. Default role is 'student' for all new signups
    3. ON DELETE CASCADE ensures profile is deleted when user is deleted
    4. Admin policies check that the current user's own profile has role = 'admin'
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  role text DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger: auto-insert profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add index on role for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
