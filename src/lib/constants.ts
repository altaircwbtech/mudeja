// ============================================
// MovaFácil — Constants
// ============================================

export const APP_NAME = "MovaFácil";
export const APP_DESCRIPTION =
  "O app que facilita sua mudança. Conectamos você a motoristas flex e ajudantes de confiança.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const APP_TAGLINE = "Sua mudança sem dor de cabeça.";

// Service types
export const SERVICE_TYPES = {
  mudanca_residencial: {
    label: "Mudança Residencial",
    icon: "🏠",
    slug: "mudanca",
  },
  mudanca_comercial: {
    label: "Mudança Comercial",
    icon: "🏢",
    slug: "mudanca-comercial",
  },
  carreto: {
    label: "Carreto",
    icon: "📦",
    slug: "carreto",
  },
  frete_pequeno: {
    label: "Frete Pequeno",
    icon: "🚚",
    slug: "frete",
  },
  frete_grande: {
    label: "Frete Grande",
    icon: "🚛",
    slug: "frete-grande",
  },
  desmontagem_montagem: {
    label: "Montagem e Desmontagem",
    icon: "🔧",
    slug: "montagem",
  },
} as const;

export type ServiceTypeKey = keyof typeof SERVICE_TYPES;

// Move sizes
export const MOVE_SIZES = {
  pequeno: { label: "Poucos itens", description: "Até 10 caixas ou itens pequenos" },
  medio: { label: "Apartamento / Kitnet", description: "Até 30 caixas + alguns móveis" },
  grande: { label: "Casa média", description: "Mobília completa de 2-3 quartos" },
  muito_grande: { label: "Casa grande", description: "Mobília completa de 4+ quartos" },
} as const;

export type MoveSizeKey = keyof typeof MOVE_SIZES;

// Vehicle types
export const VEHICLE_TYPES = {
  utilitario: { label: "Utilitário", capacity: "até 500kg" },
  van: { label: "Van", capacity: "até 1.500kg" },
  caminhonete: { label: "Caminhonete", capacity: "até 1.000kg" },
  caminhao_34: { label: "Caminhão 3/4", capacity: "até 4.000kg" },
  caminhao_toco: { label: "Caminhão Toco", capacity: "até 8.000kg" },
  caminhao_truck: { label: "Caminhão Truck", capacity: "até 14.000kg" },
  carreta: { label: "Carreta", capacity: "até 25.000kg" },
} as const;

// Badge types
export const BADGE_TYPES = {
  verificado: { label: "Verificado", icon: "✅", color: "green" },
  top_avaliado: { label: "Top Avaliado", icon: "⭐", color: "yellow" },
  resposta_rapida: { label: "Resposta Rápida", icon: "⚡", color: "blue" },
  veterano: { label: "Veterano", icon: "🏅", color: "orange" },
  super_prestador: { label: "Super Prestador", icon: "🏆", color: "purple" },
  "100_servicos": { label: "100 Serviços", icon: "💯", color: "red" },
  pro: { label: "PRO", icon: "💎", color: "indigo" },
  segurado: { label: "Segurado", icon: "🛡️", color: "teal" },
} as const;

// Plans
export const PLANS = {
  free: {
    name: "Gratuito",
    price: 0,
    leads_per_month: 3,
    proposals_per_month: 3,
    photos: 3,
  },
  pro: {
    name: "PRO",
    price: 79,
    leads_per_month: -1, // unlimited
    proposals_per_month: -1,
    photos: 15,
  },
} as const;

// Limits
export const LIMITS = {
  MAX_PROPOSALS_PER_REQUEST: 10,
  REQUEST_EXPIRY_HOURS: 72,
  MIN_REVIEW_WAIT_HOURS: 24,
  REVIEW_REMINDER_HOURS: 48,
  REVIEW_EDIT_DAYS: 7,
  MAX_PHOTOS_FREE: 3,
  MAX_PHOTOS_PRO: 15,
  MAX_DISTANCE_KM_DEFAULT: 30,
} as const;
