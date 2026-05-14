export const TOKENOMICS_CONFIG = {
  FREE_TIER_QUOTA: 25000, // Total Engineering Credits
  HOURLY_LIMIT: 5000,
  MODELS: [
    { 
      id: "gemini-1.5-flash", 
      label: "Gemini 1.5 Flash", 
      multiplier: 1.0, 
      desc: "Económico (1x) - Ideal para prototipado rápido.",
      provider: "Google"
    },
    { 
      id: "gpt-4o-mini", 
      label: "GPT-4o Mini", 
      multiplier: 1.5, 
      desc: "Estándar (1.5x) - Historias de Usuario y Requerimientos.",
      provider: "OpenAI"
    },
    { 
      id: "qwen-2.5-72b", 
      label: "Qwen 2.5 (Groq)", 
      multiplier: 0.8, 
      desc: "Eficiente (0.8x) - Desarrollo de código puro.",
      provider: "Groq"
    },
    { 
      id: "claude-3-5-sonnet", 
      label: "Claude 3.5 Sonnet", 
      multiplier: 5.0, 
      desc: "Premium (5x) - Auditoría Crítica y Arquitectura.",
      provider: "Anthropic"
    }
  ]
};

export type ModelId = "gemini-1.5-flash" | "gpt-4o-mini" | "qwen-2.5-72b" | "claude-3-5-sonnet";

export function calculateCreditCost(tokens: number, multiplier: number): number {
  return Math.ceil(tokens * multiplier);
}
