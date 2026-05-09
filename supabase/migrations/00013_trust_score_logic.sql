-- ==========================================
-- MovaFácil — Trust Score Logic
-- Migration: 00013_trust_score_logic
-- ==========================================

CREATE OR REPLACE FUNCTION public.calculate_trust_score(provider_row_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    score DECIMAL := 0.0;
    v_provider RECORD;
    v_user RECORD;
    v_has_vehicle BOOLEAN;
    v_has_photo BOOLEAN;
    v_has_area BOOLEAN;
BEGIN
    -- Get provider and user data
    SELECT * INTO v_provider FROM public.providers WHERE id = provider_row_id;
    SELECT * INTO v_user FROM public.users WHERE id = v_provider.user_id;
    
    -- 1. Profile Completeness (Max +1.5)
    IF v_user.avatar_url IS NOT NULL THEN score := score + 0.5; END IF;
    IF v_provider.bio IS NOT NULL AND length(v_provider.bio) > 10 THEN score := score + 0.5; END IF;
    
    SELECT EXISTS(SELECT 1 FROM public.provider_vehicles WHERE provider_id = provider_row_id) INTO v_has_vehicle;
    IF v_has_vehicle THEN score := score + 0.5; END IF;

    -- 2. Verifications (Max +2.0)
    IF v_provider.selfie_verified THEN score := score + 1.0; END IF;
    IF v_provider.document_verified THEN score := score + 1.0; END IF;

    -- 3. Reputation (Max +1.0)
    -- Score based on average rating (0 to 5 mapped to 0 to 1.0)
    IF v_provider.total_reviews > 0 THEN
        score := score + (v_provider.avg_rating / 5.0);
    END IF;

    -- 4. Experience (Max +0.5)
    IF v_provider.total_completed > 0 THEN
        score := score + 0.5;
    END IF;

    -- Clamp score between 0.0 and 5.0
    IF score > 5.0 THEN score := 5.0; END IF;
    
    RETURN ROUND(score, 1);
END;
$$ LANGUAGE plpgsql;

-- Trigger Function to update trust score
CREATE OR REPLACE FUNCTION public.trigger_recalculate_trust_score()
RETURNS TRIGGER AS $$
DECLARE
    v_provider_id UUID;
BEGIN
    -- Determine provider_id based on the table
    IF TG_TABLE_NAME = 'providers' THEN
        v_provider_id := NEW.id;
    ELSIF TG_TABLE_NAME = 'users' THEN
        SELECT id INTO v_provider_id FROM public.providers WHERE user_id = NEW.id;
    ELSIF TG_TABLE_NAME = 'provider_vehicles' THEN
        v_provider_id := NEW.provider_id;
    ELSIF TG_TABLE_NAME = 'reviews' THEN
        v_provider_id := NEW.reviewed_provider_id;
    END IF;

    -- Update the trust_score in the providers table
    IF v_provider_id IS NOT NULL THEN
        UPDATE public.providers 
        SET trust_score = calculate_trust_score(v_provider_id),
            updated_at = NOW()
        WHERE id = v_provider_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Triggers
DROP TRIGGER IF EXISTS trg_trust_providers ON public.providers;
CREATE TRIGGER trg_trust_providers 
AFTER UPDATE OF bio, selfie_verified, document_verified, total_completed, avg_rating 
ON public.providers FOR EACH ROW EXECUTE FUNCTION trigger_recalculate_trust_score();

DROP TRIGGER IF EXISTS trg_trust_users ON public.users;
CREATE TRIGGER trg_trust_users 
AFTER UPDATE OF avatar_url 
ON public.users FOR EACH ROW EXECUTE FUNCTION trigger_recalculate_trust_score();

DROP TRIGGER IF EXISTS trg_trust_vehicles ON public.provider_vehicles;
CREATE TRIGGER trg_trust_vehicles 
AFTER INSERT OR DELETE ON public.provider_vehicles FOR EACH ROW EXECUTE FUNCTION trigger_recalculate_trust_score();

DROP TRIGGER IF EXISTS trg_trust_reviews ON public.reviews;
CREATE TRIGGER trg_trust_reviews 
AFTER INSERT OR DELETE ON public.reviews FOR EACH ROW EXECUTE FUNCTION trigger_recalculate_trust_score();

-- Initial calculation for all providers
UPDATE public.providers SET trust_score = calculate_trust_score(id);
