# 🏗️ POP: Estabilidade de Build & Supabase

## 📌 Objetivo
Eliminar erros de build no Vercel e garantir que o acesso aos dados do Supabase seja determinístico.

## 🛠️ Regras de Implementação

### 1. Acesso a Relacionamentos (O Padrão [0])
Em queries do Supabase com joins (ex: `user:users(...)`), o retorno é SEMPRE um array.
- **Errado:** `provider.user.full_name`
- **Certo:** `provider.user?.[0]?.full_name`
- **Obrigatório:** Usar tipos TypeScript que reflitam essa estrutura de array opcional.

### 2. Componentes de UI e `asChild`
Ao usar Radix UI (ou shadcn/ui) em DropdownMenus ou Tooltips:
- O `Trigger` deve usar `asChild` se contiver outro componente (ex: `Button`).
- Nunca aninhar botões dentro de botões sem `asChild`.

### 3. Case-Sensitivity (Windows vs Vercel)
O Vercel roda em Linux (Case-Sensitive).
- Arquivos com nomes `[id]` ou `[slug]` devem ser referenciados exatamente com as pastas físicas.
- Importações devem bater exatamente com o nome do arquivo no disco.

## 🧪 Verificação Pré-Commit
Antes de dar `git push`, rodar localmente:
`npm run build`
Se falhar, a correção deve ser documentada no `progress.md`.
