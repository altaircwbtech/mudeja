# 📈 MudeJá — SEO, Growth, Operações, Roadmap e Escala
## Parte 5/5 — Aquisição, Operação, Legal e Planejamento

---

## 10. SEO PROGRAMÁTICO

### 10.1 Estratégia de Páginas Automáticas

```
Estrutura de URLs:

/                                    → Landing page
/curitiba                            → Hub cidade
/curitiba/mudanca                    → Serviço + cidade
/curitiba/carreto                    → Serviço + cidade
/curitiba/frete                      → Serviço + cidade
/curitiba/batel                      → Bairro + cidade
/curitiba/mudanca/batel              → Serviço + bairro + cidade
/prestador/joao-mudancas-curitiba    → Perfil público
/blog/quanto-custa-mudanca-curitiba  → Conteúdo SEO
```

### 10.2 Páginas Locais — Template

```html
<!-- /curitiba/mudanca -->
<title>Mudança em Curitiba - Prestadores Verificados | MudeJá</title>
<meta name="description" content="Encontre os melhores prestadores de mudança
em Curitiba. Avaliações reais, preços justos e profissionais verificados.
Compare e contrate agora." />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Mudança em Curitiba - MudeJá",
  "areaServed": { "@type": "City", "name": "Curitiba" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "234"
  }
}
</script>

Conteúdo da página:
├── H1: "Mudança em Curitiba"
├── Subtítulo: "X prestadores verificados disponíveis"
├── Filtros: tipo, bairro, avaliação, preço
├── Lista de prestadores (cards com rating + badge)
├── Seção: "Como funciona"
├── Seção: "Perguntas frequentes sobre mudança em Curitiba"
├── Seção: "Bairros atendidos em Curitiba"
├── Links internos para bairros e serviços relacionados
└── CTA: "Publique seu pedido grátis"
```

### 10.3 Perfil Público Indexável

```html
<!-- /prestador/joao-mudancas-curitiba -->
<title>João Mudanças - Curitiba | ⭐ 4.8 (47 avaliações) | MudeJá</title>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "name": "João Mudanças",
  "address": { "@type": "PostalAddress", "addressLocality": "Curitiba" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47"
  },
  "review": [...]
}
</script>
```

### 10.4 Conteúdo SEO Programático

| Tipo de página | Volume estimado | Exemplo |
|---|---|---|
| Hub cidade | ~100 | /curitiba |
| Serviço + cidade | ~400 | /curitiba/mudanca |
| Serviço + bairro | ~5.000 | /curitiba/mudanca/batel |
| Perfil prestador | Ilimitado | /prestador/joao-mudancas |
| Blog SEO | ~200 | /blog/quanto-custa-mudanca-curitiba |
| FAQ cidade | ~100 | /curitiba/perguntas-frequentes |

### 10.5 Sitemap Dinâmico

```typescript
// app/sitemap.ts (Next.js)
export default async function sitemap() {
  const cities = await supabase.from('cities').select('slug').eq('is_active', true);
  const providers = await supabase.from('providers').select('slug').eq('is_active', true);
  const serviceTypes = ['mudanca', 'carreto', 'frete'];

  const cityPages = cities.map(c => ({
    url: `https://mudeja.com.br/${c.slug}`,
    lastModified: new Date(), changeFrequency: 'daily', priority: 0.8
  }));

  const servicePages = cities.flatMap(c =>
    serviceTypes.map(s => ({
      url: `https://mudeja.com.br/${c.slug}/${s}`,
      lastModified: new Date(), changeFrequency: 'daily', priority: 0.7
    }))
  );

  const providerPages = providers.map(p => ({
    url: `https://mudeja.com.br/prestador/${p.slug}`,
    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6
  }));

  return [...cityPages, ...servicePages, ...providerPages];
}
```

---

## 11. GROWTH E LIQUIDEZ

### 11.1 Cold Start — Playbook

```
Semana 1-2: SEED SUPPLY
├── Founder faz 50 ligações para mudanceiros locais
├── Visitar estacionamentos de caminhões
├── Grupos de WhatsApp/Facebook de fretistas
├── OLX/ML: contatar anunciantes de frete
└── Meta: 20 prestadores com perfil completo

Semana 3-4: SEED DEMAND
├── Google Ads local ("mudança curitiba")
├── Postar em grupos de Facebook locais
├── Panfleto em imobiliárias e portarias
├── Parcerias com corretores de imóveis
└── Meta: 30 pedidos publicados

Semana 5-8: VALIDAR LIQUIDEZ
├── Medir: % pedidos com ≥3 propostas em 24h
├── Medir: % matches (proposta aceita)
├── Iterar onboarding baseado em feedback
├── Ajustar raio geográfico se necessário
└── Meta: >60% dos pedidos com 3+ propostas
```

### 11.2 Canais de Aquisição

| Canal | Tipo | CAC est. | Volume | Prioridade |
|---|---|---|---|---|
| SEO local | Orgânico | R$ 0 | Alto (longo prazo) | 🔴 Crítica |
| Google Ads | Pago | R$ 15-30 | Médio | 🟡 Alta |
| Indicação prestador→prestador | Orgânico | R$ 10 (bonus) | Médio | 🟡 Alta |
| Indicação cliente→cliente | Orgânico | R$ 5 (bonus) | Médio | 🟡 Alta |
| Grupos Facebook/WhatsApp | Orgânico | R$ 0 | Baixo | 🟢 Média |
| Parcerias imobiliárias | Partnership | R$ 5-10 | Médio | 🟢 Média |
| Instagram/TikTok | Social | R$ 10-20 | Variável | 🔵 Baixa (MVP) |

### 11.3 Programa de Indicação

```
Prestador indica Prestador:
├── Indicador: 1 mês de lead credits grátis
└── Indicado: perfil destacado por 7 dias

Cliente indica Cliente:
├── Indicador: selo "Membro indicado" (trust social)
└── Indicado: pedido destacado no feed

Mecânica:
├── Link/código único por usuário
├── Tracking via deep link
├── Ativação após primeiro match completado
└── Limite: 10 indicações/mês
```

### 11.4 Estratégia de Retenção

| Ação | Prestador | Cliente |
|---|---|---|
| Push semanal | Resumo de oportunidades na região | - |
| Email mensal | Relatório de performance | Dicas de mudança |
| Gamificação | Badges + ranking local | - |
| Reputação acumulada | Lock-in por reputação | Histórico de avaliações |
| Promoções sazonais | Destaque grátis em pico | Desconto em parceiros |

---

## 12. ESTRATÉGIA OPERACIONAL

### 12.1 Suporte

```
Canais de suporte (MVP):
├── WhatsApp Business (principal)
├── Email: suporte@mudeja.com.br
├── Central de Ajuda (FAQ web)
└── In-app: formulário de contato

SLAs:
├── Denúncia urgente (fraude/segurança): 4h
├── Denúncia normal: 24h
├── Dúvida operacional: 48h
├── Feedback/sugestão: 72h
└── Bug report: 24h
```

### 12.2 Playbook de Disputas

```
Cliente reclama de serviço:
1. Coletar evidências (fotos, relato)
2. Contatar prestador para versão
3. Analisar histórico de ambos
4. Decisão:
   ├── Prestador culpado → warning/suspensão + orientação ao cliente
   ├── Cliente abusivo → flag na conta
   └── Inconclusivo → mediação + registro

Prestador reclama de cliente:
1. Coletar evidências
2. Verificar se houve no-show/comportamento inadequado
3. Decisão:
   ├── Cliente no-show recorrente → warning/suspensão
   └── Situação isolada → registro + orientação
```

### 12.3 Processos Críticos

| Processo | Frequência | Responsável |
|---|---|---|
| Revisão de denúncias | Diária | Ops |
| Verificação de novos perfis | Diária | Ops |
| Remoção de avaliações fake | Semanal | Ops + Auto |
| Análise de churn PRO | Semanal | Growth |
| Atualização de cidades ativas | Mensal | PM |
| Revisão de preços/planos | Trimestral | PM + Fin |

---

## 13. LGPD E JURÍDICO

### 13.1 Modelo Intermediador

> [!IMPORTANT]
> O MudeJá é **intermediador**, não prestador de serviço. A relação contratual do serviço de mudança é entre **cliente e prestador diretamente**. A plataforma facilita a conexão.

### 13.2 Termos de Uso — Pontos Essenciais

| Cláusula | Conteúdo |
|---|---|
| **Natureza** | Plataforma intermediadora de contatos |
| **Responsabilidade** | Não se responsabiliza pela execução do serviço |
| **Vínculo** | Não há vínculo empregatício com prestadores |
| **Conteúdo** | Usuários são responsáveis por informações publicadas |
| **Moderação** | Plataforma pode remover conteúdo/perfis que violem termos |
| **Pagamentos** | Combinados diretamente entre as partes |
| **Disputas** | Plataforma não é parte em disputas de serviço |

### 13.3 LGPD — Compliance

| Requisito | Implementação |
|---|---|
| **Consentimento** | Aceite explícito nos termos + política de privacidade |
| **Finalidade** | Dados usados exclusivamente para operação do marketplace |
| **Minimização** | Coletar apenas dados necessários |
| **Transparência** | Política de privacidade clara e acessível |
| **Portabilidade** | Exportação de dados do usuário via settings |
| **Exclusão** | "Deletar minha conta" com remoção efetiva |
| **DPO** | Encarregado de dados definido (pode ser o founder no MVP) |
| **Base legal** | Consentimento + execução contratual + legítimo interesse |

### 13.4 Proteção Jurídica

```
Para evitar responsabilidade excessiva:
├── Termos claros de intermediação (NÃO somos transportadora)
├── Sem garantia de qualidade do serviço
├── Sem definição de preços (livre mercado)
├── Sem controle de horários (sem vínculo)
├── Avaliações são opinião do usuário
├── Canal de denúncia claro (porto seguro)
└── Compliance com Marco Civil da Internet
```

---

## 14. ROADMAP COMPLETO

### Sprint 0 (Semana 1-2): Fundação

| Entrega | Tipo |
|---|---|
| Setup Supabase (auth, DB, storage) | Backend |
| Setup Expo projeto + navegação | Mobile |
| Setup Next.js web + admin | Web |
| Schema do banco + migrations | Backend |
| Design system + componentes base | Design |
| CI/CD básico (EAS + Vercel) | DevOps |

### Sprint 1 (Semana 3-4): Core Auth + Perfil

| Entrega | Tipo |
|---|---|
| Login/registro (telefone + Google) | Mobile |
| Onboarding cliente | Mobile |
| Onboarding prestador | Mobile |
| Perfil do prestador (CRUD) | Mobile + Backend |
| Upload de fotos | Mobile + Storage |
| RLS policies | Backend |

### Sprint 2 (Semana 5-6): Marketplace Core

| Entrega | Tipo |
|---|---|
| Criar pedido de mudança | Mobile |
| Feed de oportunidades (prestador) | Mobile |
| Enviar proposta | Mobile |
| Ver propostas recebidas (cliente) | Mobile |
| Aceitar/rejeitar proposta | Mobile |
| Matching algorithm v1 | Backend |
| Push notifications | Backend + Mobile |

### Sprint 3 (Semana 7-8): Trust + Avaliações

| Entrega | Tipo |
|---|---|
| Sistema de avaliações | Mobile + Backend |
| Trust score calculation | Backend |
| Badges automáticos | Backend |
| Perfil público do prestador | Mobile |
| Buscar prestadores | Mobile |
| Denúncias básico | Mobile + Backend |
| WhatsApp redirect | Mobile |

### Sprint 4 (Semana 9-10): SEO + Admin

| Entrega | Tipo |
|---|---|
| Landing page web | Web |
| Páginas de cidade (SSG) | Web |
| Perfis públicos web | Web |
| Admin: dashboard básico | Admin |
| Admin: gestão de usuários | Admin |
| Admin: moderação de denúncias | Admin |
| Sitemap dinâmico | Web |

### Sprint 5 (Semana 11-12): Monetização + Polish

| Entrega | Tipo |
|---|---|
| Plano PRO (assinatura) | Mobile + Backend |
| Créditos de lead (Free) | Mobile + Backend |
| Destaque patrocinado | Backend |
| Favoritos | Mobile |
| Notificações avançadas | Mobile + Backend |
| Bug fixes + performance | All |
| Beta launch Curitiba | Ops |

### Fase 2 (Mês 4-6): Crescimento

| Entrega | Tipo |
|---|---|
| Programa de indicação | Mobile + Backend |
| Blog SEO | Web |
| Páginas de bairro | Web |
| Admin: dashboard growth | Admin |
| Admin: dashboard antifraude | Admin |
| Verificação por selfie | Mobile |
| Expansão para 2ª cidade | Ops |
| A/B testing framework | All |

### Escala Nacional (Mês 7-12)

| Entrega | Tipo |
|---|---|
| Pagamento in-app (opcional) | Mobile + Backend |
| Chat in-app simples | Mobile + Backend |
| Seguro parceria | Ops + Backend |
| App rating/review prompts | Mobile |
| PWA web | Web |
| Expansão 5-10 cidades | Ops |
| Otimização de matching (ML) | Backend |

---

## 15. KPIs E MÉTRICAS

### 15.1 North Star Metric

> **Matches bem avaliados por semana** (serviços completados com rating ≥4)

### 15.2 Métricas por Categoria

| Categoria | Métrica | Meta MVP |
|---|---|---|
| **Liquidez** | % pedidos com ≥3 propostas em 24h | >60% |
| **Match Rate** | % pedidos que resultam em match | >40% |
| **Ativação Cliente** | % cadastros que publicam 1º pedido | >30% |
| **Ativação Prestador** | % cadastros que enviam 1ª proposta | >50% |
| **Retenção Prestador** | % ativos após 30 dias | >60% |
| **NPS Cliente** | Score | >50 |
| **NPS Prestador** | Score | >40 |
| **CAC Cliente** | Custo | <R$ 20 |
| **CAC Prestador** | Custo | <R$ 40 |
| **LTV PRO** | Receita total do prestador PRO | >R$ 500 |
| **Churn PRO** | % cancelamento mensal | <12% |
| **Conversão Free→PRO** | % | >10% |
| **Rating médio** | Estrelas | >4.2 |
| **Tempo médio de resposta** | Horas | <4h |

### 15.3 Funil Completo

```
Visitante web/app
    │ (100%)
    ▼
Cadastro iniciado
    │ (40%)
    ▼
Cadastro completo
    │ (70% dos que iniciaram = 28% total)
    ▼
Primeira ação (publicar pedido / enviar proposta)
    │ (50% dos cadastrados = 14% total)
    ▼
Match (proposta aceita)
    │ (40% dos pedidos = 5.6% total)
    ▼
Serviço completado
    │ (85% dos matches = 4.8% total)
    ▼
Avaliação deixada
    │ (60% dos completados = 2.9% total)
    ▼
Retorno / indicação
    │ (30% = 0.9% total)
```

### 15.4 Dashboard Semanal (métricas operacionais)

| Métrica | Fonte |
|---|---|
| Novos cadastros (cliente + prestador) | DB |
| Pedidos publicados | DB |
| Propostas enviadas | DB |
| Matches realizados | DB |
| Avaliações criadas | DB |
| Denúncias abertas / resolvidas | DB |
| Receita (PRO + leads) | Gateway |
| Churn PRO | DB |
| Prestadores ativos (≥1 proposta/semana) | DB |
| Tempo médio de primeira proposta | DB |

---

## 16. ESTRATÉGIA MOBILE-FIRST

### 16.1 Princípios

| Princípio | Implementação |
|---|---|
| Toque-first | Botões ≥44px, gestos nativos |
| Offline mínimo | Cache de perfil + pedidos recentes |
| Performance | <3s primeiro render, <1s navegação |
| Push inteligente | Batch notifications, horário adequado |
| Deep links | Perfil público abre no app se instalado |
| WhatsApp | Botão "Chamar no WhatsApp" sempre visível |
| Câmera nativa | Foto direto pela câmera para veículo/perfil |
| Localização | Permissão contextual (ao criar pedido) |

### 16.2 Permissões

| Permissão | Quando pedir | Justificativa mostrada |
|---|---|---|
| Localização | Ao criar pedido ou perfil | "Para encontrar prestadores perto de você" |
| Câmera | Ao adicionar foto | "Para fotografar seu veículo/mudança" |
| Notificações | Após primeiro match | "Para avisar quando receber propostas" |
| Contatos | Nunca (MVP) | - |

---

## 17. ESCALABILIDADE FUTURA

### 17.1 Quando migrar do Supabase

| Trigger | Ação |
|---|---|
| >100k usuários | Avaliar instância dedicada |
| >10k requisições/minuto | Load balancer + read replicas |
| Necessidade de ML pesado | Serviço separado (Python) |
| Pagamento in-app complexo | Microserviço financeiro |
| Multi-região | Supabase self-hosted ou cloud dedicado |

### 17.2 Roadmap Técnico de Escala

```
MVP (agora): Supabase hosted + Expo + Vercel
    │
6 meses: Supabase Pro + CDN + monitoring avançado
    │
12 meses: Read replicas + serviço de busca (Typesense/Meilisearch)
    │
18 meses: Microserviço de pagamentos + serviço de matching separado
    │
24 meses: Avaliar Supabase self-hosted ou migrar para AWS/GCP
    │
36 meses: Arquitetura de microserviços onde necessário
```

### 17.3 Quando Implementar Funcionalidades Complexas

| Feature | Quando | Trigger |
|---|---|---|
| Pagamento in-app | 6-12 meses | Demanda de clientes + regulação |
| Chat in-app | 6-9 meses | WhatsApp se mostra insuficiente |
| Tracking realtime | 12-18 meses | Operação de fretes urgentes |
| IA/ML matching | 12-18 meses | >10k matches para treinar modelo |
| Escrow | 12-18 meses | Pagamento in-app ativo + disputas |
| Seguro integrado | 9-12 meses | Parceria com seguradora |
| Multi-idioma | 18-24 meses | Expansão internacional |

---

## RESUMO DE DECISÕES TÉCNICAS

| # | Decisão | Alternativa rejeitada | Justificativa |
|---|---|---|---|
| 1 | Supabase | Firebase | SQL relacional para marketplace |
| 2 | React Native Expo | Flutter | Ecossistema JS, velocidade |
| 3 | Next.js (Web) | Gatsby | SSR/ISR para SEO dinâmico |
| 4 | Zustand | Redux | Simplicidade, performance |
| 5 | TanStack Query | SWR | Mais features, melhor cache |
| 6 | WhatsApp redirect | Chat próprio | Zero custo, zero manutenção |
| 7 | Assinatura > Comissão | Comissão | Não precisa trackear pagamento |
| 8 | PostgREST (Supabase) | API custom | Zero boilerplate, RLS nativo |
| 9 | Expo Push | FCM direto | Unificado iOS+Android |
| 10 | PostHog | Mixpanel | Open source, self-hostable |

---

> [!TIP]
> **Próximos passos recomendados:**
> 1. Validar esta documentação com stakeholders
> 2. Criar o projeto Supabase e rodar as migrations
> 3. Iniciar Sprint 0 (setup de projetos)
> 4. Recrutar os primeiros 20 prestadores em Curitiba
> 5. Configurar domínio mudeja.com.br + Vercel
