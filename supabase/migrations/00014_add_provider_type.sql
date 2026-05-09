-- Migration: 00014_add_provider_type
-- Description: Adds provider_type to distinguish between Drivers and Helpers

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_type') THEN
        CREATE TYPE provider_type AS ENUM ('driver', 'helper', 'both');
    END IF;
END $$;

ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS type provider_type DEFAULT 'driver';

-- Update existing providers to 'driver' if they have vehicles
UPDATE providers 
SET type = 'driver' 
WHERE id IN (SELECT provider_id FROM provider_vehicles);

-- Comments for documentation
COMMENT ON COLUMN providers.type IS 'Distinguishes if the provider is a Driver (with vehicle), Helper (labor only), or both.';
