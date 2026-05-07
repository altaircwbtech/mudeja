import { z } from "zod";

// Phone validation (Brazilian format)
export const phoneSchema = z
  .string()
  .min(10, "Telefone inválido")
  .max(15, "Telefone inválido")
  .regex(/^[\d\s()+-]+$/, "Telefone inválido");

// CPF validation
export const cpfSchema = z
  .string()
  .length(11, "CPF deve ter 11 dígitos")
  .regex(/^\d{11}$/, "CPF inválido");

// User registration
export const registerSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: phoneSchema,
  city: z.string().min(2, "Selecione uma cidade"),
  state: z.string().length(2, "Selecione um estado"),
});

// Provider profile
export const providerProfileSchema = z.object({
  business_name: z.string().min(3, "Nome do negócio deve ter pelo menos 3 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  short_bio: z.string().max(160, "Bio deve ter no máximo 160 caracteres").optional(),
  services: z.array(z.string()).min(1, "Selecione pelo menos 1 serviço"),
  city: z.string().min(2, "Selecione uma cidade"),
  state: z.string().length(2, "Selecione um estado"),
  max_distance_km: z.number().min(5).max(100).default(30),
  years_experience: z.number().min(0).max(50).optional(),
  team_size: z.number().min(1).max(50).default(1),
});

// Service request
export const serviceRequestSchema = z.object({
  service_type: z.string().min(1, "Selecione o tipo de serviço"),
  move_size: z.string().optional(),
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z.string().max(1000).optional(),
  origin_address: z.string().min(5, "Informe o endereço de origem"),
  origin_city: z.string().min(2, "Informe a cidade de origem"),
  origin_state: z.string().length(2),
  destination_address: z.string().optional(),
  destination_city: z.string().optional(),
  preferred_date: z.string().optional(),
  flexible_date: z.boolean().default(false),
  needs_packing: z.boolean().default(false),
  needs_disassembly: z.boolean().default(false),
  has_heavy_items: z.boolean().default(false),
  heavy_items_description: z.string().optional(),
});

// Proposal
export const proposalSchema = z.object({
  price: z.number().min(1, "Informe o valor"),
  message: z.string().max(500).optional(),
  estimated_duration: z.string().optional(),
  available_date: z.string().optional(),
  team_size: z.number().min(1).default(1),
});

// Review
export const reviewSchema = z.object({
  overall_rating: z.number().min(1).max(5, "Avaliação obrigatória"),
  punctuality_rating: z.number().min(1).max(5).optional(),
  care_rating: z.number().min(1).max(5).optional(),
  communication_rating: z.number().min(1).max(5).optional(),
  price_fairness_rating: z.number().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
});

// Report
export const reportSchema = z.object({
  report_type: z.string().min(1, "Selecione o tipo de denúncia"),
  description: z.string().min(10, "Descreva o problema com pelo menos 10 caracteres"),
});
