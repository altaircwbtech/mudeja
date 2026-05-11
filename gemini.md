# 📜 gemini.md — A Constituição do Projeto

## 🎯 Visão Geral
**MovaFácil** é um marketplace premium de mudanças que conecta clientes a prestadores verificados.

## 🗄️ Esquema de Dados (Source of Truth)
### Tabelas Supabase (Core)
- `profiles`: Dados básicos de usuários (auth.users -> profiles).
- `providers`: Perfis de prestadores (business_name, bio, trust_score).
- `service_requests`: Pedidos de mudança (origem, destino, inventário, status).
- `proposals`: Propostas enviadas por prestadores.
- `notifications`: Sistema real-time de alertas.
- `reviews`: Avaliações e notas (impactam o Trust Score).
- `provider_credits`: Saldo de créditos dos prestadores (`provider_id`, `balance`).
- `credit_transactions`: Extrato de movimentação (`amount`, `type: purchase | usage`, `description`).

## ⚖️ Regras Comportamentais
1. **Confiança Primeiro:** Nenhum prestador sem Trust Score aparece em destaque.
2. **Match Determinístico:** Uma proposta aceita bloqueia novas propostas para aquele pedido.
3. **Comunicação Direta:** O WhatsApp é o canal de "Handshake" final entre as partes.
4. **Pay-per-Lead:** O acesso ao "Handshake" exige saldo positivo de créditos.

## 📊 JSON Data Schemas (Payloads)
### 1. Service Request (Input)
```json
{
  "origin": "string (address)",
  "destination": "string (address)",
  "items": "array (objects)",
  "date": "ISO-8601",
  "service_mode": "standard | premium",
  "credit_cost": "number (calculated by complexity)"
}
```

### 2. Credit Purchase (Input)
```json
{
  "provider_id": "uuid",
  "package_id": "string",
  "amount_paid": "number",
  "credits_added": "number"
}
```

### 2. Proposal (Output)
```json
{
  "provider_id": "uuid",
  "price": "number",
  "message": "string",
  "status": "pending | accepted | rejected"
}
```

## 🛡️ Invariantes Arquiteturais
- **Auth:** RLS estrito. Usuários só veem seus próprios dados ou dados públicos de prestadores.
- **Realtime:** Obrigatório para notificações de novas propostas.

## ✨ Invariantes de Estilo (Cinematic UI)
- **Textura:** Sobreposição de ruído (noise) SVG global (opacidade 0.05).
- **Geometria:** Bordas `rounded-[2rem]` a `rounded-[3rem]`. Sem cantos vivos.
- **Interação:** Botões com sensação "magnética" (`scale(1.03)` no hover com `cubic-bezier`).
- **Animações:** Uso obrigatório de `GSAP` com easing `power3.out` e stagger de `0.08`.

---
## 📅 Log de Manutenção
- **2026-05-11**: Inicialização do Protocolo V.L.A.E.G.
