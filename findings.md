# 🔍 findings.md — Pesquisas e Descobertas

## 🧬 Descobertas Técnicas
- **Supabase Realtime**: Configurado com sucesso para a tabela `notifications`.
- **Next.js Turbopack**: Utilizado no Vercel, requer atenção em importações circulares e case-sensitivity de arquivos (ex: `[id]` no Windows vs Linux).
- **Trust Score**: Lógica baseada em triggers SQL é mais eficiente que recálculo via Server Actions para este volume de dados.

## ⚠️ Restrições e Limites
- **WhatsApp**: Limite de desintermediação é o maior risco de negócio identificado até agora.
- **Vercel**: Limite de build time em planos gratuitos.
- **Next.js Middleware**: Identificada mensagem de depreciação durante o build. O Next.js recomenda migrar de `middleware` para `proxy` em versões futuras.
