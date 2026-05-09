-- ==========================================
-- Add service_mode to proposals
-- Migration: 00015_add_service_mode_to_proposals
-- ==========================================

-- Create type for service mode if not exists
DO $$ BEGIN
    CREATE TYPE service_mode AS ENUM ('full', 'labor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add service_mode column to proposals
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS service_mode service_mode DEFAULT 'full';

-- Add comment for clarity
COMMENT ON COLUMN proposals.service_mode IS 'Indicates if the provider is offering full service (truck + labor) or labor only for this specific proposal.';
