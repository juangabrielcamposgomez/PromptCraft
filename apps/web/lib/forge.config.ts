import { 
  User, Cpu, Workflow, Terminal, BookOpen, 
  Zap, BrainCircuit, Rocket, ShieldCheck, Microscope
} from "lucide-react";

export const FORGE_PILLARS = [
  { id: "perfil", label: "Perfil de Rol", icon: User },
  { id: "stack", label: "Stack Tecnológico", icon: Cpu },
  { id: "patron", label: "Patrón de Trabajo", icon: Workflow },
  { id: "tools", label: "MCP & Tools", icon: Terminal },
  { id: "framework", label: "Metodología", icon: BookOpen },
];

export const FORGE_TEMPLATES: Record<string, any> = {
  "Definición de Stack Personal": {
    instruction: "Actúa como un Coach de Ingeniería de Élite. Tu misión es configurar el ecosistema personal del usuario. Si elige 'Investigación Profunda', inyecta automáticamente la recomendación de Gemini 1.5 Pro (2M tokens). Explica la jerarquía Etapa -> Plan -> Ejecución para maximizar la eficiencia.",
    format: "Genera una tabla comparativa de herramientas y una justificación técnica basada en el patrón AgentX (ahorro del 62.1% de tokens).",
    panelA_style: "table"
  },
  "Diseño de Flujo Agéntico": {
    instruction: "Actúa como un Agentic Architect. Diseña un flujo de trabajo basado en patrones AgentX o ReAct. Explica cómo configurar los tres niveles: Etapa -> Plan -> Ejecución. Destaca que este flujo reduce el consumo de tokens en un 62.1%.",
    format: "Genera un diagrama de flujo en Mermaid que represente la interacción entre agentes y describe la lógica de planificación.",
    panelA_style: "code"
  },
  "Configuración de Metodología de Aprendizaje": {
    instruction: "Actúa como un Career Coach AI. Diseña un framework metodológico personal (Scrum o Kanban de aprendizaje) para dominar las Hard Skills seleccionadas. Define rituales diarios y métricas de éxito.",
    format: "Genera un tablero de hitos y una lista de 'Daily Rituals' para el crecimiento profesional.",
    panelA_style: "sticky"
  },
  "Conectividad MCP (External Tools)": {
    instruction: "Actúa como un Automation Expert. Define cómo conectar herramientas externas mediante MCP (Model Context Protocol). Proporciona ejemplos de funciones FaaS (AWS Lambda) para conectar APIs y bases de datos.",
    format: "Genera fragmentos de código para despliegue de conectores y un mapa de arquitectura de red distribuida.",
    panelA_style: "audit"
  }
};

export const FORGE_AGENTS = [
  { id: 'coach', label: 'Career Coach AI', icon: BrainCircuit, desc: 'Mentoría en habilidades y crecimiento.' },
  { id: 'architect', label: 'Tech Stack Architect', icon: Cpu, desc: 'Diseño de ecosistemas y selección de modelos.' },
  { id: 'automation', label: 'Automation Expert', icon: Zap, desc: 'Conectividad MCP y flujos de trabajo.' }
];
