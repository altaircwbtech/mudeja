-- ==========================================
-- MovaFácil — Request Items RLS Policies
-- Enable Row Level Security and add policies for request_items table
-- ==========================================

ALTER TABLE request_items ENABLE ROW LEVEL SECURITY;

-- 1. Clients can insert items to their own requests
-- This is checked by verifying ownership of the parent request
CREATE POLICY "Clients can insert request items"
ON request_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM service_requests 
    WHERE id = request_items.request_id AND user_id = auth.uid()
  )
);

-- 2. Clients can view items of their own requests
CREATE POLICY "Clients can view own request items"
ON request_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM service_requests 
    WHERE id = request_items.request_id AND user_id = auth.uid()
  )
);

-- 3. Providers can view items of published requests
CREATE POLICY "Providers can view request items"
ON request_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM service_requests 
    WHERE id = request_items.request_id 
    AND status IN ('published', 'receiving_proposals')
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'provider')
  )
);

-- 4. Clients can delete items of their own requests
CREATE POLICY "Clients can delete own request items"
ON request_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM service_requests 
    WHERE id = request_items.request_id AND user_id = auth.uid()
  )
);
