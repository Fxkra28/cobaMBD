/*
  # Fix Users Table INSERT Policy

  1. Security Changes
    - Add INSERT policy for users table to allow authenticated users to create their own records
    - This enables the sign-up flow to work properly by allowing new users to insert their data

  2. Policy Details
    - Policy allows INSERT operations where the user_id matches the authenticated user's ID
    - This ensures users can only create records for themselves, maintaining security
*/

-- Add INSERT policy for users table
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = user_id);