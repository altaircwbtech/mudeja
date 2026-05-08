-- Fix triggers to bypass RLS so they can update tables successfully

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;
