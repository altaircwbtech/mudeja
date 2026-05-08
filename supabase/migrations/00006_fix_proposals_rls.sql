-- Fix RLS policies for proposals since provider_id references providers.id, not users.id

DROP POLICY IF EXISTS "Providers can create proposals" ON proposals;
DROP POLICY IF EXISTS "Providers can view own proposals" ON proposals;

CREATE POLICY "Providers can create proposals"
ON proposals FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM providers WHERE id = proposals.provider_id AND user_id = auth.uid())
);

CREATE POLICY "Providers can view own proposals"
ON proposals FOR SELECT
USING (
  EXISTS (SELECT 1 FROM providers WHERE id = proposals.provider_id AND user_id = auth.uid())
);
