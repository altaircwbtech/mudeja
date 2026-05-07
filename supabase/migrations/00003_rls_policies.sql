-- ==========================================
-- MovaFácil — RLS Policies
-- Enable Row Level Security and add policies
-- ==========================================

-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- Users Policies
-- --------------------------------------------------------

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Anyone can read basic provider profiles (we might join on users table)
-- Let's allow reading user profiles if they are providers
CREATE POLICY "Anyone can read provider user profiles"
ON users FOR SELECT
USING (role = 'provider');

-- --------------------------------------------------------
-- Providers Policies
-- --------------------------------------------------------

-- Anyone can read provider profiles
CREATE POLICY "Anyone can read provider profiles"
ON providers FOR SELECT
USING (true);

-- Providers can insert their own profile
CREATE POLICY "Providers can insert own profile"
ON providers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Providers can update their own profile
CREATE POLICY "Providers can update own profile"
ON providers FOR UPDATE
USING (auth.uid() = user_id);
