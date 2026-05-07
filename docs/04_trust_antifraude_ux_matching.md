# 🛡️ MudeJá — Trust, Antifraude, UX e Matching
## Parte 4/5 — Confiança, Segurança, Experiência e Algoritmo

---

## 5. SISTEMA DE REPUTAÇÃO E CONFIANÇA

### 5.1 Filosofia Trust-First

> A confiança não é uma feature — é O PRODUTO do MudeJá.

Cada decisão de design deve responder: **"Isso aumenta ou diminui a confiança do cliente?"**

### 5.2 Camadas de Verificação

| Nível | Verificação | Pontos Trust | Obrigatório |
|---|---|---|---|
| 1 | Telefone verificado (SMS OTP) | +0.5 | ✅ |
| 2 | WhatsApp ativo | +0.5 | ✅ |
| 3 | Foto de perfil real | +0.3 | ✅ |
| 4 | CPF validado | +0.5 | Recomendado |
| 5 | Selfie com documento | +0.5 | Recomendado |
| 6 | Foto do veículo | +0.3 | Recomendado |
| 7 | Endereço verificado | +0.5 | Opcional |
| 8 | Seguro comprovado | +0.5 | Opcional |
| 9 | CNPJ verificado | +0.3 | Opcional |

### 5.3 Sistema de Badges

| Badge | Critério | Ícone |
|---|---|---|
| **Verificado** | CPF + selfie + WhatsApp | ✅ |
| **Top Avaliado** | ≥4.5 estrelas, ≥10 avaliações | ⭐ |
| **Resposta Rápida** | Responde em <1h em 80%+ dos leads | ⚡ |
| **Veterano** | 6+ meses ativo na plataforma | 🏅 |
| **Super Prestador** | Top 10% trust score na cidade | 🏆 |
| **100 Serviços** | 100+ serviços completados | 💯 |
| **PRO** | Assinante ativo do plano PRO | 💎 |
| **Segurado** | Seguro de carga ativo | 🛡️ |

### 5.4 Avaliação — Estrutura

```
Após serviço completado:
├── Rating geral (1-5 estrelas) ← obrigatório
├── Pontualidade (1-5) ← obrigatório
├── Cuidado com pertences (1-5) ← obrigatório
├── Comunicação (1-5) ← opcional
├── Preço justo (1-5) ← opcional
├── Comentário texto ← opcional
└── Indicaria? (sim/não) ← opcional

Regras:
- Só pode avaliar serviço efetivamente realizado
- Avaliação liberada 24h após data do serviço
- Lembrete push em 48h se não avaliou
- Prestador pode responder publicamente
- Avaliações <3 estrelas geram alerta para moderação
- Avaliações não podem ser editadas após 7 dias
- Avaliações fraudulentas são removidas + penalidade
```

### 5.5 Trust Score — Composição

```
Trust Score (0-10) = Σ componentes:

Avaliação média (peso 25%)           → 0 a 2.5 pontos
Volume de avaliações (peso 15%)      → 0 a 1.5 pontos  
Verificações completadas (peso 25%)  → 0 a 2.5 pontos
Taxa de resposta (peso 15%)          → 0 a 1.5 pontos
Completude do perfil (peso 10%)      → 0 a 1.0 pontos
Tempo na plataforma (peso 5%)        → 0 a 0.5 pontos
Volume de serviços (peso 5%)         → 0 a 0.5 pontos

Penalidades:
- Cancelamentos excessivos: -0 a -1.0
- Denúncias confirmadas: -0.5 cada
- Avaliações removidas por fraude: -1.0 cada
```

### 5.6 Prevenção de Avaliações Falsas

| Mecanismo | Descrição |
|---|---|
| Vínculo a pedido real | Só avalia se houve match confirmado |
| Detecção de padrão | Muitas avaliações 5★ em curto período |
| IP/device check | Avaliações do mesmo device = alerta |
| Moderação manual | Avaliações flaggadas entram em fila |
| Período de carência | 24h após serviço para poder avaliar |
| Resposta pública | Prestador pode contestar publicamente |

---

## 6. SISTEMA ANTIFRAUDE

### 6.1 Principais Fraudes Possíveis

| Fraude | Risco | Probabilidade |
|---|---|---|
| Perfil falso de prestador | Golpe financeiro | Alta |
| Avaliações compradas/fake | Reputação inflada | Alta |
| Pedido fake para coletar dados | Phishing | Média |
| Prestador sumiu com pertences | Roubo | Baixa |
| Pagamento sem serviço | Golpe financeiro | Média |
| Spam de propostas | Degradação da experiência | Alta |
| Conta múltipla (ban evasion) | Contorno de regras | Média |
| Manipulação de preço | Bait & switch | Média |

### 6.2 Estratégia de Prevenção

```
Camada 1: PREVENÇÃO (antes do cadastro)
├── Telefone verificado obrigatório
├── Rate limiting de cadastro por IP/device
├── Honeypot fields no formulário
├── Blacklist de números conhecidos
└── Device fingerprint

Camada 2: DETECÇÃO (durante uso)
├── Análise de padrão de comportamento
├── Alertas automáticos por regras
├── Moderação de conteúdo
├── Detecção de texto suspeito
└── Análise de velocidade de ações

Camada 3: RESPOSTA (após detecção)
├── Suspensão temporária automática
├── Fila de revisão manual
├── Banimento com justificativa
├── Notificação ao usuário afetado
└── Log de todas as ações
```

### 6.3 Regras Automáticas de Alerta

| Regra | Ação |
|---|---|
| 3+ avaliações 5★ em 24h para o mesmo prestador | Flag + revisão |
| Mesmo IP/device em 2+ contas | Alerta + investigar |
| Proposta com preço 70% abaixo da média | Warning ao cliente |
| 5+ denúncias em 7 dias | Suspensão automática |
| Taxa de cancelamento >40% | Alerta + revisão |
| Mensagem com links externos suspeitos | Bloqueio + revisão |
| Cadastro + 10 propostas em <1h | Rate limit + flag |
| Tentativa de compartilhar telefone no texto da proposta (Free) | Bloqueio do texto |

### 6.4 Fluxo de Denúncia

```
Usuário reporta
    │
    ▼
Sistema categoriza (fraude, assédio, no-show, dano, etc.)
    │
    ▼
Alerta gerado no Admin
    │
    ├──→ Baixo risco: fila normal (SLA 48h)
    ├──→ Médio risco: fila prioritária (SLA 24h)
    └──→ Alto risco: suspensão imediata + investigação (SLA 4h)
          │
          ▼
    Admin investiga
          │
          ├──→ Confirmado: banimento + notificação
          ├──→ Parcial: warning + monitoramento
          └──→ Improcedente: dismiss + notificação
```

---

## 7. UX E EXPERIÊNCIA DO USUÁRIO

### 7.1 Princípios UX

| Princípio | Aplicação |
|---|---|
| **Confiança visual** | Badges, verificações, avaliações visíveis sempre |
| **Fricção mínima** | Criar pedido em <3 telas, proposta em <2 telas |
| **Progressive disclosure** | Mostrar o essencial, detalhes sob demanda |
| **Redução de ansiedade** | Status claro, feedback constante, transparência |
| **Design emocional** | Celebrar matches, comemore avaliações |
| **Mobile-first** | Toda experiência otimizada para toque |

### 7.2 Onboarding — Cliente

```
Tela 1: Splash + Value Prop
"Encontre prestadores confiáveis para sua mudança"
[CTA: Começar]

Tela 2: Cadastro
- Telefone (SMS OTP)  OU
- Google / Apple Sign-In
→ Após verificação: nome, cidade

Tela 3: O que você precisa?
- Mudança residencial
- Carreto / frete pequeno
- Frete grande
→ Seleção rápida

Tela 4: Home do cliente
- Buscar prestadores
- Publicar pedido
- Destaques na sua cidade
```

### 7.3 Onboarding — Prestador

```
Tela 1: Value Prop Prestador
"Receba oportunidades de trabalho na sua região"
[CTA: Cadastrar como prestador]

Tela 2: Cadastro
- Telefone (SMS OTP)
→ Nome, CPF, cidade

Tela 3: Seu perfil profissional
- Nome do negócio
- Serviços oferecidos (multi-select)
- Região de atendimento
- Foto do veículo (câmera direta)

Tela 4: Verificação (opcional, incentivada)
- Selfie com documento
- WhatsApp verificado
→ "Perfis verificados recebem 3x mais contatos"

Tela 5: Perfil preview
→ "Assim seu perfil aparece para os clientes"
[CTA: Publicar perfil]
```

### 7.4 Fluxo: Criar Pedido de Mudança (Cliente)

```
Tela 1: Tipo de serviço
┌────────────────────────────────┐
│  O que você precisa?           │
│                                │
│  🏠 Mudança residencial       │
│  📦 Carreto / frete pequeno   │
│  🚛 Frete grande              │
│  🔧 Montagem / desmontagem    │
└────────────────────────────────┘

Tela 2: Detalhes
┌────────────────────────────────┐
│  De onde?                      │
│  [📍 Usar localização atual]  │
│  [Digitar endereço]            │
│                                │
│  Para onde?                    │
│  [Digitar endereço]            │
│                                │
│  Tamanho da mudança:           │
│  ○ Poucos itens  ○ Apartamento │
│  ○ Casa média   ○ Casa grande  │
│                                │
│  Data preferida: [Calendário]  │
│  ☐ Tenho flexibilidade de data │
└────────────────────────────────┘

Tela 3: Detalhes adicionais (opcional)
┌────────────────────────────────┐
│  Itens especiais? (opcional)   │
│  ☐ Itens pesados (geladeira…) │
│  ☐ Preciso embalar            │
│  ☐ Preciso desmontar móveis   │
│                                │
│  📸 Adicionar fotos (opcional) │
│                                │
│  Observações:                  │
│  [___________________________] │
└────────────────────────────────┘

Tela 4: Confirmação
┌────────────────────────────────┐
│  ✅ Seu pedido será publicado  │
│                                │
│  Prestadores da sua região     │
│  receberão seu pedido e        │
│  enviarão propostas.           │
│                                │
│  Você receberá notificação     │
│  quando receber propostas.     │
│                                │
│  [Publicar pedido]             │
└────────────────────────────────┘
```

### 7.5 Fluxo: Enviar Proposta (Prestador)

```
Prestador vê oportunidade no feed
    │
    ▼
Tela: Detalhe da oportunidade
┌────────────────────────────────┐
│  📦 Mudança residencial       │
│  📍 Batel → Santa Felicidade  │
│  📅 15/06 (flexível)          │
│  🏠 Apartamento médio         │
│  ⚠️ Itens pesados             │
│                                │
│  [Enviar proposta]             │
│  (ou: "Comprar 1 crédito R$10")│
└────────────────────────────────┘
    │
    ▼
Tela: Sua proposta
┌────────────────────────────────┐
│  💰 Valor: R$ [____]          │
│  📅 Data disponível: [____]   │
│  ⏰ Horário: [manhã/tarde]    │
│  👥 Equipe: [1-5] pessoas     │
│  🚛 Veículo: [selecionar]     │
│                                │
│  Mensagem ao cliente:          │
│  [___________________________] │
│                                │
│  [Enviar proposta]             │
└────────────────────────────────┘
```

### 7.6 Perfil Público do Prestador

```
┌────────────────────────────────┐
│  [FOTO]                        │
│  João Mudanças                 │
│  ⭐ 4.8 (47 avaliações)       │
│  ✅ Verificado  💎 PRO         │
│  📍 Curitiba - Atende 30km    │
│                                │
│  Badges: ⚡🏆🛡️              │
│                                │
│  "Mudanças com cuidado e       │
│   pontualidade. 8 anos de      │
│   experiência."                │
│                                │
│  Serviços:                     │
│  🏠 Mudança  📦 Carreto       │
│                                │
│  🚛 Caminhão baú              │
│  👥 Equipe de 3 pessoas       │
│                                │
│  [📸 Fotos dos serviços]      │
│                                │
│  ─── Avaliações ───           │
│  ⭐⭐⭐⭐⭐ Maria S.          │
│  "Excelente! Muito cuidado..." │
│                                │
│  [💬 Solicitar orçamento]     │
│  [❤️ Salvar nos favoritos]    │
└────────────────────────────────┘
```

---

## 8. SISTEMA DE MATCHING

### 8.1 Algoritmo Inicial (MVP)

```
Quando um pedido é publicado:

1. FILTRO GEOGRÁFICO
   → Buscar prestadores onde:
     - provider_service_areas.city = request.origin_city
     - distância(provider_location, request_origin) ≤ provider.max_distance_km
     - provider.is_active = TRUE

2. FILTRO DE SERVIÇO
   → request.service_type ∈ provider.services[]

3. FILTRO DE DISPONIBILIDADE
   → provider.is_available = TRUE
   → request.preferred_date.day_of_week ∈ provider.available_days

4. ORDENAÇÃO (ranking score)
   score = (
       trust_score * 0.30                    -- 30% confiança
     + avg_rating * 2 * 0.25                 -- 25% avaliação (normalizado para 0-10)
     + (is_pro ? 2.0 : 0) * 0.15            -- 15% plano PRO
     + (is_featured ? 2.0 : 0) * 0.10       -- 10% destaque
     + response_rate / 10 * 0.10             -- 10% taxa de resposta
     + profile_completeness / 10 * 0.05      -- 5% completude
     + (distance_km < 10 ? 0.5 : 0) * 0.05  -- 5% proximidade
   )

5. NOTIFICAR top 20 prestadores (push + in-app)

6. EXPIRAÇÃO: 72h sem proposta → alertar cliente
```

### 8.2 Consulta SQL de Matching

```sql
SELECT 
    p.*,
    u.full_name,
    u.avatar_url,
    ST_Distance(
        ST_SetSRID(ST_MakePoint(psa.longitude, psa.latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint($origin_lng, $origin_lat), 4326)::geography
    ) / 1000 as distance_km,
    (
        p.trust_score * 0.30 +
        p.avg_rating * 2 * 0.25 +
        CASE WHEN p.is_pro THEN 2.0 ELSE 0 END * 0.15 +
        CASE WHEN p.is_featured THEN 2.0 ELSE 0 END * 0.10 +
        p.response_rate / 10 * 0.10 +
        p.profile_completeness / 10 * 0.05 +
        CASE WHEN ST_Distance(...) / 1000 < 10 THEN 0.5 ELSE 0 END * 0.05
    ) as ranking_score
FROM providers p
JOIN users u ON u.id = p.user_id
JOIN provider_service_areas psa ON psa.provider_id = p.id
WHERE p.is_active = TRUE
  AND $service_type = ANY(p.services)
  AND psa.city = $origin_city
  AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(psa.longitude, psa.latitude), 4326)::geography,
      ST_SetSRID(ST_MakePoint($origin_lng, $origin_lat), 4326)::geography,
      p.max_distance_km * 1000
  )
ORDER BY ranking_score DESC
LIMIT 20;
```

### 8.3 Evolução Futura do Matching

| Fase | Melhoria |
|---|---|
| V2 | Histórico de aceitação (prestadores que aceitam mais = score maior) |
| V3 | Machine learning: predição de match baseada em features |
| V4 | Preço dinâmico sugerido baseado em histórico |
| V5 | Matching instantâneo para fretes urgentes |

---

> [!NOTE]
> Continua na Parte 5: SEO Programático, Growth, Operações, LGPD, Roadmap, KPIs e Escala.
