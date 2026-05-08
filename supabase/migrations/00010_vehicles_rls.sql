-- Enable RLS for provider_vehicles
ALTER TABLE provider_vehicles ENABLE ROW LEVEL SECURITY;

-- Anyone can read provider vehicles (clients need to see them on the provider's profile or proposal)
CREATE POLICY "Anyone can read provider vehicles"
ON provider_vehicles FOR SELECT
USING (true);

-- Providers can insert their own vehicles
CREATE POLICY "Providers can insert own vehicles"
ON provider_vehicles FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM providers 
        WHERE providers.id = provider_vehicles.provider_id AND providers.user_id = auth.uid()
    )
);

-- Providers can update their own vehicles
CREATE POLICY "Providers can update own vehicles"
ON provider_vehicles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM providers 
        WHERE providers.id = provider_vehicles.provider_id AND providers.user_id = auth.uid()
    )
);

-- Providers can delete their own vehicles
CREATE POLICY "Providers can delete own vehicles"
ON provider_vehicles FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM providers 
        WHERE providers.id = provider_vehicles.provider_id AND providers.user_id = auth.uid()
    )
);
