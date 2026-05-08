-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON reviews FOR SELECT
USING (true);

-- 2. Clients can insert reviews for their own requests
CREATE POLICY "Clients can insert reviews"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (
    SELECT 1 FROM service_requests 
    WHERE service_requests.id = request_id AND service_requests.user_id = auth.uid()
  )
);
