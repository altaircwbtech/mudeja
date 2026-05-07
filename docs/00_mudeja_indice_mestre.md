# 🚚 MudeJá — Documentação Completa do Produto
## Índice Mestre — Marketplace de Confiança para Mudanças Locais

---

> **"O lugar mais confiável para encontrar mudanças, carretos e fretes locais."**

---

## 📐 Decisão Arquitetural

> **PWA-first com Next.js** — uma única aplicação web responsiva, mobile-first, instalável como app.
> Quando houver tração, evolui para app nativo. Modelo Babysits.

---

## 📚 Documentos

| # | Documento | Seções |
|---|---|---|
| 1 | [Visão Estratégica e Modelo de Negócio](file:///C:/Users/NeoMissio/.gemini/antigravity/brain/39898f3d-9cf2-4f85-89fb-c34e04c17fa9/artifacts/01_visao_estrategica_e_negocio.md) | Posicionamento, proposta de valor, público-alvo, estratégia geográfica, liquidez, monetização, planos, unit economics |
| 2 | [Arquitetura do Sistema (v2 — PWA)](file:///C:/Users/NeoMissio/.gemini/antigravity/brain/39898f3d-9cf2-4f85-89fb-c34e04c17fa9/artifacts/02_arquitetura_sistema.md) | **Next.js PWA único**, Supabase, folder structure, rendering, auth, push, admin |
| 3 | [Banco de Dados](file:///C:/Users/NeoMissio/.gemini/antigravity/brain/39898f3d-9cf2-4f85-89fb-c34e04c17fa9/artifacts/03_banco_de_dados.md) | Schema PostgreSQL completo, tabelas, enums, indexes, RLS, triggers, trust score SQL |
| 4 | [Trust, Antifraude, UX e Matching](file:///C:/Users/NeoMissio/.gemini/antigravity/brain/39898f3d-9cf2-4f85-89fb-c34e04c17fa9/artifacts/04_trust_antifraude_ux_matching.md) | Reputação, badges, verificação, fraude, denúncias, UX flows, wireframes, matching algorithm |
| 5 | [SEO, Growth, Roadmap e Escala](file:///C:/Users/NeoMissio/.gemini/antigravity/brain/39898f3d-9cf2-4f85-89fb-c34e04c17fa9/artifacts/05_seo_growth_roadmap_escala.md) | SEO programático, aquisição, operações, LGPD, sprints, KPIs, mobile-first, escalabilidade |

---

## ⚡ Stack Definitivo

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Estado** | Zustand + TanStack Query v5 |
| **Forms** | React Hook Form + Zod |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions + Storage) |
| **PWA** | @serwist/next + Web Push API |
| **Maps** | Leaflet (gratuito) |
| **Analytics** | PostHog |
| **Monitoring** | Sentry |
| **Deploy** | Vercel |

## 📅 Timeline

| Sprint | Semanas | Foco |
|---|---|---|
| Sprint 0 | 1-2 | Setup Next.js + Supabase + design system |
| Sprint 1 | 3-4 | Auth + perfis + onboarding |
| Sprint 2 | 5-6 | Marketplace core (pedidos + propostas) |
| Sprint 3 | 7-8 | Trust + avaliações + busca |
| Sprint 4 | 9-10 | SEO pages + admin panel |
| Sprint 5 | 11-12 | Monetização + PWA polish + launch beta |

## 🎯 North Star Metric

> **Matches bem avaliados por semana** (serviços completados com rating ≥4)

---

> [!IMPORTANT]
> **Próximos passos:**
> 1. ✅ Documentação completa — concluída
> 2. 🔲 Revisar e aprovar
> 3. 🔲 Sprint 0: `npx create-next-app` + Supabase project + migrations
> 4. 🔲 Recrutar primeiros 20 prestadores em Curitiba
