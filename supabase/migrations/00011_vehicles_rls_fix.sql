-- Drop existing flawed policies
DROP POLICY IF EXISTS "Providers can insert own vehicles" ON provider_vehicles;
DROP POLICY IF EXISTS "Providers can update own vehicles" ON provider_vehicles;
DROP POLICY IF EXISTS "Providers can delete own vehicles" ON provider_vehicles;

-- Recreate with proper IN clause for accurate row binding
CREATE POLICY "Providers can insert own vehicles"
ON provider_vehicles FOR INSERT
WITH CHECK (
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);

CREATE POLICY "Providers can update own vehicles"
ON provider_vehicles FOR UPDATE
USING (
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);

CREATE POLICY "Providers can delete own vehicles"
ON provider_vehicles FOR DELETE
USING (
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);
