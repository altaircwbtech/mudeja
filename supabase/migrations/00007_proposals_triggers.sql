-- Trigger to update service_requests.total_proposals and status when a proposal is inserted
CREATE OR REPLACE FUNCTION public.handle_new_proposal()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment the total_proposals count
  UPDATE public.service_requests
  SET 
    total_proposals = total_proposals + 1,
    status = CASE 
      WHEN status = 'published' THEN 'receiving_proposals'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = NEW.request_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_proposal_created ON public.proposals;
CREATE TRIGGER on_proposal_created
  AFTER INSERT ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_proposal();
