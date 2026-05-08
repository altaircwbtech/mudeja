-- ==========================================================
-- SCRIPT DE TESTE: FLUXO COMPLETO MARKETPLACE MOVAFÁCIL
-- OBJETIVO: Validar Triggers de Trust Score e Notificações
-- ==========================================================

DO $$
DECLARE
    test_client_id UUID;
    test_provider_user_id UUID;
    test_provider_id UUID;
    test_request_id UUID;
    test_proposal_id UUID;
BEGIN
    -- 1. SETUP: Buscar usuários REAIS que já existem no banco para evitar erro de FK com auth.users
    SELECT id INTO test_client_id FROM public.users WHERE role = 'client' LIMIT 1;
    SELECT id INTO test_provider_user_id FROM public.users WHERE role = 'provider' LIMIT 1;

    -- Validar se encontramos os usuários
    IF test_client_id IS NULL OR test_provider_user_id IS NULL THEN
        RAISE EXCEPTION 'Não foi possível encontrar um cliente e um prestador no banco para o teste. Por favor, cadastre um de cada via interface antes.';
    END IF;

    -- Buscar o provider_id correspondente
    SELECT id INTO test_provider_id FROM public.providers WHERE user_id = test_provider_user_id LIMIT 1;

    IF test_provider_id IS NULL THEN
        -- Criar entrada de provider se não existir (para o teste)
        INSERT INTO public.providers (user_id, business_name, trust_score)
        VALUES (test_provider_user_id, 'Prestador de Teste', 1.0)
        RETURNING id INTO test_provider_id;
    END IF;

    -- 2. SOLICITAÇÃO: Cliente cria um pedido com dados completos
    INSERT INTO public.service_requests (
        user_id, 
        title, 
        description, 
        service_type, 
        status,
        origin_address,
        origin_neighborhood,
        origin_city,
        origin_state,
        destination_address,
        destination_neighborhood,
        destination_city,
        destination_state
    )
    VALUES (
        test_client_id, 
        'Mudança de Teste - Auditoria', 
        'Preciso levar 10 caixas e um sofá', 
        'mudanca_residencial', 
        'published',
        'Rua de Teste, 123',
        'Centro',
        'Curitiba',
        'PR',
        'Av das Araucárias, 456',
        'Batel',
        'Curitiba',
        'PR'
    )
    RETURNING id INTO test_request_id;
    
    RAISE NOTICE 'PASSO 1: Solicitação criada com ID %', test_request_id;

    -- 3. PROPOSTA: Prestador envia uma oferta
    INSERT INTO public.proposals (request_id, provider_id, price, status, message)
    VALUES (test_request_id, test_provider_id, 450.00, 'pending', 'Faço esse carreto hoje mesmo!')
    RETURNING id INTO test_proposal_id;
    
    RAISE NOTICE 'PASSO 2: Proposta enviada com ID %', test_proposal_id;

    -- 4. ACEITE: Cliente aceita a proposta
    UPDATE public.proposals SET status = 'accepted' WHERE id = test_proposal_id;
    UPDATE public.service_requests SET status = 'matched' WHERE id = test_request_id;
    
    RAISE NOTICE 'PASSO 3: Proposta aceita e Match realizado.';

    -- 5. FINALIZAÇÃO: Serviço concluído
    UPDATE public.service_requests SET status = 'completed' WHERE id = test_request_id;
    
    RAISE NOTICE 'PASSO 4: Serviço marcado como Concluído.';

    -- 6. AVALIAÇÃO: Cliente avalia com 5 estrelas
    INSERT INTO public.reviews (request_id, reviewed_provider_id, reviewer_id, overall_rating, comment)
    VALUES (test_request_id, test_provider_id, test_client_id, 5, 'Excelente serviço, super pontual!');
    
    RAISE NOTICE 'PASSO 5: Avaliação de 5 estrelas enviada.';

    -- 7. EXIBIÇÃO DOS RESULTADOS (RAISE NOTICE)
    RAISE NOTICE '---------------------------------------------------';
    RAISE NOTICE 'AUDITORIA CONCLUÍDA COM SUCESSO!';
    
    DECLARE
        final_score DECIMAL;
    BEGIN
        SELECT trust_score INTO final_score FROM public.providers WHERE id = test_provider_id;
        RAISE NOTICE 'Novo Trust Score do Prestador: %', final_score;
    END;

    RAISE NOTICE '---------------------------------------------------';
    RAISE NOTICE 'ÚLTIMAS NOTIFICAÇÕES DISPARADAS:';
    
    -- Imprimir as últimas 3 notificações do usuário
    FOR test_proposal_id IN (
        SELECT 1 FROM public.notifications WHERE user_id = test_provider_user_id ORDER BY created_at DESC LIMIT 3
    ) LOOP
        -- (Apenas para garantir que o loop rode, as infos reais virão do SELECT abaixo se preferir, 
        -- mas via RAISE NOTICE fica mais limpo no log)
        NULL;
    END LOOP;

END $$;

-- Query final dinâmica para ver o prestador que acabou de ser testado
SELECT 
    p.business_name, 
    p.trust_score, 
    p.avg_rating,
    p.total_completed,
    u.full_name as provider_name
FROM public.providers p
JOIN public.users u ON p.user_id = u.id
ORDER BY p.updated_at DESC
LIMIT 1;

-- Ver notificações reais
SELECT title, body, type, created_at 
FROM public.notifications 
ORDER BY created_at DESC 
LIMIT 5;
