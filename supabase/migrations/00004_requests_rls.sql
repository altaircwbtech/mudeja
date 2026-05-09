-- ==========================================
-- MovaFácil — Requests RLS Policies
-- Enable Row Level Security and add policies for requests table
-- ==========================================

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- Requests Policies
-- --------------------------------------------------------

-- 1. Authenticated users can create requests
CREATE POLICY "Authenticated users can create requests"
ON service_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Clients can view their own requests
CREATE POLICY "Clients can view own requests"
ON service_requests FOR SELECT
USING (auth.uid() = user_id);

-- 3. Clients can update their own requests
CREATE POLICY "Clients can update own requests"
ON service_requests FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Providers can view published requests
CREATE POLICY "Providers can view published requests"
ON service_requests FOR SELECT
USING (
  status IN ('published', 'receiving_proposals') AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'provider')
);

-- --------------------------------------------------------
-- Proposals Policies
-- --------------------------------------------------------

-- 1. Providers can create proposals
CREATE POLICY "Providers can create proposals"
ON proposals FOR INSERT
WITH CHECK (
  auth.uid() = provider_id AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'provider')
);

-- 2. Providers can view their own proposals
CREATE POLICY "Providers can view own proposals"
ON proposals FOR SELECT
USING (auth.uid() = provider_id);

-- 3. Clients can view proposals on their requests
CREATE POLICY "Clients can view proposals on their requests"
ON proposals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM service_requests 
    WHERE service_requests.id = proposals.request_id AND service_requests.user_id = auth.uid()
  )
);
