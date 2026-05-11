# 🎬 POP: Interface Cinematográfica (Cinematic UI)

## 📌 Objetivo
Garantir que cada componente do MovaFácil pareça um instrumento digital de alta precisão, eliminando qualquer padrão genérico de IA.

## 🛠️ Implementação Técnica

### 1. O Filtro de Ruído (Digital Grain)
Adicionar ao `index.css` global:
```css
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,...feTurbulence...");
}
```

### 2. Botões Magnéticos
Todo botão `primary` ou `accent` deve usar o componente `MagneticButton`:
- **Hover**: `scale: 1.03`
- **Easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Feedback**: Transição de cor via `overflow-hidden` e slide interno.

### 3. Ciclo de Vida GSAP
- Usar `gsap.context()` para evitar vazamento de memória.
- Stagger padrão de `0.08` para listas de itens.
- ScrollTrigger para todas as entradas de seção.

## 🚫 O que NÃO fazer
- Usar `rounded-md` ou `rounded-lg` (usar apenas `2rem+`).
- Deixar transições de cor sem easing customizado.
- Usar imagens sem o gradiente de sobreposição `bg-gradient-to-t`.
