-- ==========================================
-- MudeJá — Initial Database Schema
-- Migration: 00001_initial_schema
-- ==========================================

-- Enable PostGIS for geolocation
CREATE EXTENSION IF NOT EXISTS postgis;

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE service_type AS ENUM ('mudanca_residencial', 'mudanca_comercial', 'carreto', 'frete_pequeno', 'frete_grande', 'desmontagem_montagem');
CREATE TYPE request_status AS ENUM ('draft', 'published', 'receiving_proposals', 'matched', 'in_progress', 'completed', 'cancelled', 'expired');
CREATE TYPE proposal_status AS ENUM ('pending', 'viewed', 'accepted', 'rejected', 'expired', 'cancelled');
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'destaque');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'past_due');
CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
CREATE TYPE report_type AS ENUM ('fraud', 'inappropriate', 'fake_profile', 'harassment', 'no_show', 'damage', 'other');
CREATE TYPE notification_type AS ENUM ('new_opportunity', 'new_proposal', 'proposal_accepted', 'proposal_rejected', 'review_reminder', 'badge_earned', 'profile_verified', 'system', 'promotion');
CREATE TYPE vehicle_type AS ENUM ('utilitario', 'van', 'caminhonete', 'caminhao_34', 'caminhao_toco', 'caminhao_truck', 'carreta');
CREATE TYPE move_size AS ENUM ('pequeno', 'medio', 'grande', 'muito_grande');

-- ==========================================
-- USERS
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'client',
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    cpf TEXT UNIQUE,
    cpf_verified BOOLEAN DEFAULT FALSE,
    date_of_birth DATE,
    city TEXT,
    state CHAR(2),
    neighborhood TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    banned_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ,
    device_fingerprint TEXT,
    expo_push_token TEXT,
    terms_accepted_at TIMESTAMPTZ,
    privacy_accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone);

-- ==========================================
-- PROVIDERS
-- ==========================================
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    description TEXT,
    short_bio TEXT,
    services service_type[] NOT NULL DEFAULT '{}',
    selfie_verified BOOLEAN DEFAULT FALSE,
    selfie_url TEXT,
    document_verified BOOLEAN DEFAULT FALSE,
    document_url TEXT,
    address_verified BOOLEAN DEFAULT FALSE,
    whatsapp_verified BOOLEAN DEFAULT FALSE,
    background_check BOOLEAN DEFAULT FALSE,
    trust_score DECIMAL(3,1) DEFAULT 0.0,
    avg_rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    total_cancelled INTEGER DEFAULT 0,
    response_rate DECIMAL(3,1) DEFAULT 0.0,
    avg_response_time INTEGER DEFAULT 0,
    years_experience INTEGER,
    team_size INTEGER DEFAULT 1,
    has_insurance BOOLEAN DEFAULT FALSE,
    insurance_details TEXT,
    cnpj TEXT,
    max_distance_km INTEGER DEFAULT 30,
    is_available BOOLEAN DEFAULT TRUE,
    available_days TEXT[] DEFAULT '{"seg","ter","qua","qui","sex","sab"}',
    working_hours_start TIME DEFAULT '07:00',
    working_hours_end TIME DEFAULT '19:00',
    meta_title TEXT,
    meta_description TEXT,
    is_pro BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_completeness INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_providers_trust ON providers(trust_score DESC);
CREATE INDEX idx_providers_rating ON providers(avg_rating DESC);
CREATE INDEX idx_providers_services ON providers USING gin(services);
CREATE INDEX idx_providers_active ON providers(is_active) WHERE is_active = TRUE;

-- ==========================================
-- PROVIDER_VEHICLES
-- ==========================================
CREATE TABLE provider_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    vehicle_type vehicle_type NOT NULL,
    brand TEXT,
    model TEXT,
    year INTEGER,
    plate TEXT,
    photo_url TEXT,
    capacity_kg INTEGER,
    capacity_m3 DECIMAL(4,1),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PROVIDER_SERVICE_AREAS
-- ==========================================
CREATE TABLE provider_service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    city TEXT NOT NULL,
    state CHAR(2) NOT NULL,
    neighborhood TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 20,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_areas_city ON provider_service_areas(city, state);

-- ==========================================
-- PROVIDER_PHOTOS
-- ==========================================
CREATE TABLE provider_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    is_cover BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SERVICE_REQUESTS
-- ==========================================
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type service_type NOT NULL,
    move_size move_size,
    title TEXT NOT NULL,
    description TEXT,
    origin_address TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    origin_state CHAR(2) NOT NULL,
    origin_neighborhood TEXT,
    origin_latitude DOUBLE PRECISION,
    origin_longitude DOUBLE PRECISION,
    origin_floor INTEGER DEFAULT 0,
    origin_has_elevator BOOLEAN DEFAULT FALSE,
    destination_address TEXT,
    destination_city TEXT,
    destination_state CHAR(2),
    destination_neighborhood TEXT,
    destination_latitude DOUBLE PRECISION,
    destination_longitude DOUBLE PRECISION,
    destination_floor INTEGER DEFAULT 0,
    destination_has_elevator BOOLEAN DEFAULT FALSE,
    preferred_date DATE,
    flexible_date BOOLEAN DEFAULT FALSE,
    preferred_time TEXT,
    needs_packing BOOLEAN DEFAULT FALSE,
    needs_disassembly BOOLEAN DEFAULT FALSE,
    has_heavy_items BOOLEAN DEFAULT FALSE,
    heavy_items_description TEXT,
    photos TEXT[] DEFAULT '{}',
    estimated_distance_km DECIMAL(6,1),
    status request_status DEFAULT 'draft',
    total_proposals INTEGER DEFAULT 0,
    max_proposals INTEGER DEFAULT 10,
    chosen_proposal_id UUID,
    chosen_provider_id UUID,
    expires_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_user ON service_requests(user_id);
CREATE INDEX idx_requests_status ON service_requests(status);
CREATE INDEX idx_requests_city ON service_requests(origin_city);
CREATE INDEX idx_requests_type ON service_requests(service_type);
CREATE INDEX idx_requests_date ON service_requests(preferred_date);

-- ==========================================
-- REQUEST_ITEMS
-- ==========================================
CREATE TABLE request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    needs_disassembly BOOLEAN DEFAULT FALSE,
    is_fragile BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- ==========================================
-- PROPOSALS
-- ==========================================
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    message TEXT,
    estimated_duration TEXT,
    includes_packing BOOLEAN DEFAULT FALSE,
    includes_disassembly BOOLEAN DEFAULT FALSE,
    available_date DATE,
    available_time TEXT,
    team_size INTEGER DEFAULT 1,
    vehicle_id UUID REFERENCES provider_vehicles(id),
    status proposal_status DEFAULT 'pending',
    viewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    lead_credit_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(request_id, provider_id)
);

CREATE INDEX idx_proposals_request ON proposals(request_id);
CREATE INDEX idx_proposals_provider ON proposals(provider_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- ==========================================
-- REVIEWS
-- ==========================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES service_requests(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewed_provider_id UUID NOT NULL REFERENCES providers(id),
    proposal_id UUID REFERENCES proposals(id),
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
    care_rating INTEGER CHECK (care_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    price_fairness_rating INTEGER CHECK (price_fairness_rating BETWEEN 1 AND 5),
    comment TEXT,
    provider_response TEXT,
    provider_responded_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(request_id, reviewer_id)
);

CREATE INDEX idx_reviews_provider ON reviews(reviewed_provider_id);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating);

-- ==========================================
-- SUBSCRIPTIONS
-- ==========================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    plan_type plan_type NOT NULL,
    status subscription_status DEFAULT 'active',
    price DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'BRL',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    external_id TEXT,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- LEAD_CREDITS
-- ==========================================
CREATE TABLE lead_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    credits_total INTEGER NOT NULL DEFAULT 0,
    credits_used INTEGER NOT NULL DEFAULT 0,
    credits_remaining INTEGER GENERATED ALWAYS AS (credits_total - credits_used) STORED,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    source TEXT DEFAULT 'monthly_free',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- FAVORITES
-- ==========================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider_id)
);

-- ==========================================
-- REPORTS
-- ==========================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    reported_user_id UUID REFERENCES users(id),
    reported_provider_id UUID REFERENCES providers(id),
    request_id UUID REFERENCES service_requests(id),
    report_type report_type NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[] DEFAULT '{}',
    status report_status DEFAULT 'pending',
    admin_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_pushed BOOLEAN DEFAULT FALSE,
    pushed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ==========================================
-- PROVIDER_BADGES
-- ==========================================
CREATE TABLE provider_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(provider_id, badge_type)
);

-- ==========================================
-- ADMIN_ACTIONS
-- ==========================================
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CITIES
-- ==========================================
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    state CHAR(2) NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    population INTEGER,
    is_active BOOLEAN DEFAULT FALSE,
    launched_at TIMESTAMPTZ,
    total_providers INTEGER DEFAULT 0,
    total_requests INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, state)
);

-- ==========================================
-- TRIGGERS: updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_requests_updated BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_proposals_updated BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- TRIGGER: Recalculate provider ratings
-- ==========================================
CREATE OR REPLACE FUNCTION recalculate_provider_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE providers SET
        avg_rating = (
            SELECT ROUND(AVG(overall_rating)::numeric, 1)
            FROM reviews WHERE reviewed_provider_id = NEW.reviewed_provider_id AND is_hidden = FALSE
        ),
        total_reviews = (
            SELECT COUNT(*) FROM reviews WHERE reviewed_provider_id = NEW.reviewed_provider_id AND is_hidden = FALSE
        ),
        updated_at = NOW()
    WHERE id = NEW.reviewed_provider_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalculate_ratings AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION recalculate_provider_ratings();

-- ==========================================
-- TRIGGER: Increment proposal count
-- ==========================================
CREATE OR REPLACE FUNCTION increment_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE service_requests SET
        total_proposals = total_proposals + 1,
        status = CASE WHEN status = 'published' THEN 'receiving_proposals' ELSE status END,
        updated_at = NOW()
    WHERE id = NEW.request_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_proposals AFTER INSERT ON proposals FOR EACH ROW EXECUTE FUNCTION increment_proposal_count();

-- ==========================================
-- SEED: Curitiba as first active city
-- ==========================================
INSERT INTO cities (name, state, slug, latitude, longitude, population, is_active, launched_at, meta_title, meta_description)
VALUES (
    'Curitiba', 'PR', 'curitiba', -25.4284, -49.2733, 1963726, TRUE, NOW(),
    'Mudança em Curitiba - Profissionais Verificados | MovaFácil',
    'Encontre motoristas e ajudantes de mudança verificados em Curitiba. Avaliações reais, preços justos. MovaFácil.'
);
