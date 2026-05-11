-- Create provider credits table
CREATE TABLE IF NOT EXISTS public.provider_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(provider_id)
);

-- Create credit transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
    description TEXT,
    reference_id UUID, -- Can link to a service_request_id or payment_id
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.provider_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Providers can view their own credits"
    ON public.provider_credits
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM public.users WHERE id = (
            SELECT user_id FROM public.providers WHERE id = provider_id
        )
    ));

CREATE POLICY "Providers can view their own transactions"
    ON public.credit_transactions
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM public.users WHERE id = (
            SELECT user_id FROM public.providers WHERE id = provider_id
        )
    ));

-- Trigger to create credits entry for new providers
CREATE OR REPLACE FUNCTION public.handle_new_provider_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.provider_credits (provider_id, balance)
    VALUES (NEW.id, 10); -- Give 10 bonus credits for new providers
    
    INSERT INTO public.credit_transactions (provider_id, amount, type, description)
    VALUES (NEW.id, 10, 'bonus', 'Bônus de boas-vindas MovaFácil');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_provider_created
    AFTER INSERT ON public.providers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_provider_credits();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.provider_credits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
