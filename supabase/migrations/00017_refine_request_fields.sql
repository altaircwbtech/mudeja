-- ==========================================
-- MovaFácil — Refine Request Fields
-- Add residence type and client helper info
-- ==========================================

-- Add residence type for origin and destination
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS origin_residence_type TEXT DEFAULT 'casa';
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS destination_residence_type TEXT DEFAULT 'casa';

-- Add client helpers info
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS client_has_helpers BOOLEAN DEFAULT FALSE;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS client_helpers_count INTEGER DEFAULT 0;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS needs_helper BOOLEAN DEFAULT FALSE;
