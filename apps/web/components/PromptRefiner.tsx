"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Info, 
  TriangleAlert, 
  Stethoscope, 
  PlayCircle, 
  ShieldAlert, 
  Send,
  Zap,
  Terminal as TerminalIcon,
  Copy,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  Briefcase,
  Code,
  Palette,
  Workflow,
  Cpu,
  Moon,
  Database,
  Terminal,
  BrainCircuit,
  Command,
  FileCode,
  Globe,
  Settings,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  LayoutTemplate,
  Layers,
  BugPlay,
  Component,
  Search,
  BookOpen,
  GitBranch,
  Wrench,
  Activity,
  Award,
  Book,
  ClipboardCheck
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PromptRefinerProps {
  phase: any;
}

const STEPS = [
  { id: "rol", label: "Rol Designado", icon: User, placeholder: "Confirma el rol inyectado o ajusta detalles específicos..." },
  { id: "contexto", label: "Contexto", icon: Info, placeholder: "Situación actual, antecedentes y objetivos del proyecto..." },
  { id: "freno", label: "Freno", icon: TriangleAlert, placeholder: "Instrucciones críticas para evitar alucinaciones y errores..." },
  { id: "diagnostico", label: "Diagnóstico", icon: Stethoscope, placeholder: "Proceso de pensamiento y análisis previo esperado..." },
  { id: "accion", label: "Acción", icon: PlayCircle, placeholder: "La tarea técnica específica a ejecutar paso a paso..." },
  { id: "limites", label: "Límites", icon: ShieldAlert, placeholder: "Restricciones técnicas, tecnologías y estándares..." },
  { id: "entrega", label: "Entrega", icon: Send, placeholder: "Formato exacto de salida (ej. Markdown, JSON, Mermaid)..." },
];

const REQ_STEPS = [
  ...STEPS.slice(0, 4),
  { id: "nfr", label: "No Funcionales", icon: ShieldAlert, placeholder: "Define atributos de calidad: Rendimiento, Seguridad, Carga..." },
  ...STEPS.slice(4),
];

const REQ_AGENT_PROFILES = [
  { id: "product-owner", label: "Product Owner", icon: Briefcase, desc: "Experto en valor de negocio y priorización.", spec: ["Backlog Refinement", "Roadmaps", "KPIs"] },
  { id: "business-analyst", label: "Analista de Negocio", icon: Search, desc: "Traducción de necesidades a requerimientos técnicos.", spec: ["FRD/BRD", "User Stories", "Stakeholders"] },
  { id: "systems-arch", label: "Arquitecto de Sistemas", icon: Cpu, desc: "Definición de NFRs y arquitectura técnica.", spec: ["Scalability", "Security", "Availability"] },
];

const REQ_TOOLS_DB = [
  { id: "mermaid", label: "Mermaid Visualizer", icon: Workflow, prompt: "[TOOL CALLING]: Genera diagramas de flujo o arquitectura en Mermaid.", modelAff: "o1-preview" },
  { id: "stakeholders", label: "Stakeholder Mapping", icon: User, prompt: "[TOOL CALLING]: Identifica y categoriza a los interesados clave del proyecto.", modelAff: "Claude 3.5" },
  { id: "business-intel", label: "Business Intelligence", icon: Globe, prompt: "[TOOL CALLING]: Investiga tendencias del mercado para validar requerimientos.", modelAff: "Gemini 1.5 Pro" },
];

const NFR_GUIDE = [
  { id: 'seguridad', label: 'Seguridad', options: [
    { label: 'Básica', text: 'Manejo de sesión estándar y HTTPS.' },
    { label: 'Alta (GDPR)', text: 'Encriptación en reposo, auditoría y cumplimiento normativo estricto.' },
    { label: 'Crítica (Zero Trust)', text: 'Validación en cada capa, mTLS y logs de acceso auditables por IA.' }
  ]},
  { id: 'rendimiento', label: 'Rendimiento', options: [
    { label: 'Estándar', text: 'Tiempo de respuesta menor a 1s.' },
    { label: 'Tiempo Real', text: 'Latencia ultra baja (<100ms) para operaciones críticas.' },
    { label: 'Carga Masiva', text: 'Soporta picos de hasta 100k concurrentes.' }
  ]}
];
const ANAL_STEPS = [
  ...STEPS.slice(0, 4),
  { id: "viabilidad", label: "Viabilidad y Entidades", icon: Database, placeholder: "Entidades principales y factibilidad técnica..." },
  ...STEPS.slice(4),
];

const ANAL_AGENT_PROFILES = [
  { id: "systems-analyst", label: "Analista de Sistemas", icon: ClipboardCheck, desc: "Experto en transformar requerimientos en procesos lógicos.", spec: ["UML", "Process Flow", "Data Normalization"] },
  { id: "data-architect", label: "Arquitecto de Datos", icon: Database, desc: "Diseño de esquemas y relaciones de alta performance.", spec: ["Prisma", "SQL Optimization", "Relational Mapping"] },
  { id: "backend-lead", icon: Code, label: "Backend Lead", desc: "Definición de lógica de negocio y servicios.", spec: ["API Design", "Domain Models", "Clean Architecture"] },
];

const ANAL_TOOLS_DB = [
  { id: "er-modeler", label: "ER Modeler", icon: LayoutTemplate, prompt: "[TOOL CALLING]: Genera un esquema de base de datos (Prisma/SQL) basado en las entidades identificadas.", modelAff: "Claude 3.5" },
  { id: "mermaid-flow", label: "Mermaid Designer", icon: Workflow, prompt: "[TOOL CALLING]: Crea diagramas de flujo de procesos o estados en Mermaid.", modelAff: "o1-preview" },
  { id: "api-arch", label: "API Architect", icon: Globe, prompt: "[TOOL CALLING]: Diseña los endpoints y contratos de API necesarios.", modelAff: "GPT-4o" },
];

const ANAL_VIABILITY_GUIDE = [
  { id: 'datos', label: 'Disponibilidad de Datos', options: [
    { label: 'Total', text: 'Acceso directo a APIs/DB externa.' },
    { label: 'Parcial (Scraping)', text: 'Requiere extracción de datos de terceros (ej. carreras).' },
    { label: 'Inexistente', text: 'Requiere generación de datos sintéticos o entrada manual.' }
  ]},
  { id: 'entidades', label: 'Entidades Clave', options: [
    { label: 'Caballos/Carreras', text: 'Modelo base para seguimiento hípico.' },
    { label: 'Usuarios/Apuestas', text: 'Modelo transaccional y de identidad.' },
    { label: 'Resultados/Estadísticas', text: 'Modelo analítico para predicciones.' }
  ]}
];

const DB_STEPS = [
  ...STEPS.slice(0, 4),
  { id: "esquema", label: "Esquema y Relaciones", icon: Database, placeholder: "Define tablas, campos, tipos (UUID, JSONB) y relaciones (1:N, N:M)..." },
  ...STEPS.slice(4),
];

const DB_AGENT_PROFILES = [
  { id: "dba-senior", label: "DBA Senior", icon: Database, desc: "Experto en orquestación de datos y alta disponibilidad.", spec: ["Normalization", "Query Optimizacion", "Scalability"] },
  { id: "sql-optimizer", label: "SQL Optimizer", icon: Zap, desc: "Especialista en índices, particionamiento y planes de ejecución.", spec: ["EXPLAIN ANALYZE", "Performance", "PostgreSQL"] },
  { id: "data-modeler", label: "Data Modeler", icon: LayoutTemplate, desc: "Modelado lógico y físico de bases de datos complejas.", spec: ["ER Diagrams", "Data Integrity", "Prisma/Sequelize"] },
];

const DB_TOOLS_DB = [
  { id: "prisma-gen", label: "Prisma Schema Gen", icon: FileCode, prompt: "[TOOL CALLING]: Genera el esquema de Prisma definitivo siguiendo los modelos definidos.", modelAff: "Claude 3.5" },
  { id: "sql-ddl", label: "Exportar SQL DDL", icon: Terminal, prompt: "[TOOL CALLING]: Genera los scripts SQL CREATE TABLE con restricciones de integridad.", modelAff: "GPT-4o" },
  { id: "er-visualizer", label: "ER Visualizer", icon: Workflow, prompt: "[TOOL CALLING]: Genera un diagrama Entidad-Relación utilizando sintaxis Mermaid erDiagram.", modelAff: "o1-preview" },
];

const DB_NORMALIZATION_GUIDE = [
  { id: '1nf', label: '1NF: Atocimidad', desc: 'Cada celda debe contener un solo valor. ¿Tienes listas separadas por comas?' },
  { id: '2nf', label: '2NF: Dependencia Total', desc: 'Elimina datos redundantes que dependen de parte de una clave compuesta.' },
  { id: '3nf', label: '3NF: Independencia Transitiva', desc: 'Elimina campos que no dependen directamente de la clave primaria (ej: Nombre del Hipódromo).' }
];

const UI_STEPS = [
  ...STEPS.slice(0, 4),
  { id: "arquitectura", label: "Arquitectura y Wireframe", icon: LayoutTemplate, placeholder: "Define la jerarquía, CTA principal y mapa del sitio..." },
  { id: "identidad", label: "Identidad Visual", icon: Palette, placeholder: "Paleta de colores (Hex), Tipografía y Border Radius..." },
  ...STEPS.slice(4),
];

const UI_AGENT_PROFILES = [
  { id: "ux-architect", label: "UX Architect", icon: BrainCircuit, desc: "Experto en user journeys y jerarquía de información.", spec: ["User Flows", "Sitemaps", "A11y"] },
  { id: "product-designer", label: "Product Designer", icon: Palette, desc: "Diseño visual cohesivo y sistemas de diseño modernos.", spec: ["Atomic Design", "Design Tokens", "Visual Identity"] },
  { id: "frontend-specialist", label: "Tailwind Expert", icon: Code, desc: "Traducción de diseño a código con Tailwind 4 y Framer Motion.", spec: ["Tailwind 4", "Framer Motion", "Shadcn/ui"] },
];

const UI_TOOLS_DB = [
  { id: "mermaid-wire", label: "Mermaid Wireframer", icon: Workflow, prompt: "[TOOL CALLING]: Genera un wireframe esquemático usando sintaxis de bloques en Mermaid.", modelAff: "o1-preview" },
  { id: "tailwind-tokens", label: "Tailwind Tokenizer", icon: Terminal, prompt: "[TOOL CALLING]: Genera los design tokens para el config de Tailwind 4 basados en la identidad elegida.", modelAff: "Claude 3.5" },
  { id: "a11y-checker", label: "A11y Checker", icon: ShieldCheck, prompt: "[TOOL CALLING]: Evalúa el contraste y accesibilidad del sistema de diseño propuesto.", modelAff: "GPT-4o" },
];

const UI_PROFILES = [
  { id: 'minimalist', label: 'Minimalista', desc: 'Espacios en blanco amplios y tipografía sans-serif limpia.' },
  { id: 'dashboard', label: 'Data Dashboard', desc: 'Optimizado para densidad de información, tablas y gráficos.' },
  { id: 'enterprise', label: 'Enterprise', desc: 'Seguro, serio y altamente estructurado para flujos masivos.' }
];

const AGENT_PROFILES = [
  { id: "cloud-arch", label: "Arquitecto Cloud", icon: Cpu, desc: "Experto en AWS/Azure y Serverless.", spec: ["Terraform", "Microservicios", "Alta Disponibilidad"] },
  { id: "dba-senior", label: "DBA Senior", icon: Database, desc: "Optimización de datos y modelado.", spec: ["PostgreSQL", "Indexación", "NoSQL Patterns"] },
  { id: "ui-ux", label: "UI Architect", icon: Palette, desc: "Sistemas de diseño y accesibilidad.", spec: ["WCAG 2.1", "TailwindCSS", "Atomic Design"] },
  { id: "backend", label: "Backend Lead", icon: Terminal, desc: "APIs robustas y Domain Driven Design.", spec: ["Node.js", "Clean Architecture", "Pruebas Unitarias"] },
  { id: "sec-ops", label: "DevSecOps", icon: ShieldAlert, desc: "Ciberseguridad y pipelines CI/CD.", spec: ["OWASP", "GitHub Actions", "Docker"] },
  { id: "cyber-sec", label: "Experto Ciberseguridad", icon: ShieldCheck, desc: "Auditoría de código e infra.", spec: ["OWASP Top 10", "Pentesting", "Análisis Estático"] },
];

const TOOLS_DB = [
  { id: "python", label: "Python Interpreter", icon: Terminal, prompt: "[TOOL CALLING]: Utiliza el entorno Python para ejecutar algoritmos o verificar scripts. Usa importaciones integradas.", modelAff: "Claude 3.5 Sonnet" },
  { id: "sql", label: "SQL Executor", icon: Database, prompt: "[TOOL CALLING]: Conéctate a la DB virtual y realiza querys EXPLAIN ANALYZE antes de confirmar la consulta.", modelAff: "GPT-4o" },
  { id: "web", label: "Web Browser", icon: Globe, prompt: "[TOOL CALLING]: Ejecuta una búsqueda web para validar la documentación en su última versión 2026.", modelAff: "Gemini 1.5 Pro" },
  { id: "mermaid", label: "Mermaid Renderer", icon: Workflow, prompt: "[TOOL CALLING]: Retorna diagramas utilizando sintaxis encapsulada en ```mermaid.", modelAff: "o1-preview" },
  { id: "snyk", label: "Snyk Scanner", icon: ShieldAlert, prompt: "[TOOL CALLING]: Ejecuta un análisis estático en el código e identifica vulnerabilidades graves.", modelAff: "Claude 3.5 Sonnet" },
  { id: "zap", label: "OWASP ZAP", icon: BugPlay, prompt: "[TOOL CALLING]: Configura un ataque de spidering para fuzzing de endpoints en la aplicación web.", modelAff: "GPT-4o" },
];

const SKILLS_DB = {
  soft: [
    { label: "Pensamiento Crítico", text: "Antes de codificar, analiza 3 alternativas posibles." },
    { label: "Seguridad Ética", text: "Valida implicaciones de privacidad en los datos manejados." },
    { label: "Comunicación Asertiva", text: "Resume la solución en un TL;DR humano al inicio." }
  ],
  hard: [
    { label: "Clean Code", text: "Aplica principios SOLID y patrón AAA en tests." },
    { label: "Zero Trust", text: "Asume validación completa en cada capa del sistema." },
    { label: "O(1) Efficiency", text: "Minimiza la complejidad temporal de los algoritmos (Big O)." },
    { label: "OWASP Security Shield", text: "Prioriza mitigaciones para XSS, SQLi, Broken Auth y CSRF por defecto." }
  ]
};

const RESEARCH_SOURCES = [
  { id: "github", label: "Repositorio GitHub", icon: GitBranch },
  { id: "docs", label: "Documentación Oficial", icon: BookOpen },
  { id: "owasp", label: "Estándares OWASP", icon: ShieldCheck },
  { id: "logs", label: "Logs de Producción", icon: Activity },
];

const QA_TEMPLATES = [
  {
    id: "qa-unit",
    name: "Automatización de Pruebas Unitarias (Jest/Vitest)",
    blocks: {
      rol: "Experto Ciberseguridad: Auditoría de código e infra. Especializado en OWASP Top 10, Pentesting, Análisis Estático.",
      contexto: "El sistema actual requiere cobertura del 80% en componentes clave del frontend y lógica de negocio backend.",
      freno: "NO uses librerías de testing obsoletas. Asegura mocking asincrónico limpio.",
      diagnostico: "[FUENTE DE VERDAD: Documentación Oficial]\nAnalizaré los flujos críticos antes de sugerir asserts.",
      accion: "Diseña un suite de tests con Jest/Vitest siguiendo el patrón Arrange-Act-Assert.",
      limites: "- Clean Code: Aplica principios SOLID y patrón AAA en tests.",
      entrega: "Devuelve el código del test en un bloque ```typescript.",
      nfr: "",
      viabilidad: "",
      esquema: "",
      arquitectura: "",
      identidad: "",
    }
  },
  {
    id: "qa-e2e",
    name: "Plan de Pruebas E2E y Casos de Borde (Playwright)",
    blocks: {
      rol: "Experto Ciberseguridad: Auditoría de código e infra. Especializado en OWASP Top 10, Pentesting, Análisis Estático.",
      contexto: "Definición de rutas transaccionales, como el checkout y login, para ser probadas en entornos headless.",
      freno: "Enfócate en escenarios de error y validación defensiva, no solo 'happy paths'.",
      diagnostico: "[FUENTE DE VERDAD: Repositorio GitHub]\nMapa mental de la jerarquía del DOM y flujos de red.",
      accion: "Genera el script E2E de Playwright comprobando interacciones asíncronas y timeouts.",
      limites: "- Zero Trust: Asume validación completa en cada capa del sistema.",
      entrega: "Script de Playwright `.spec.ts` y tabla Markdown con los Casos de Borde probados.",
      nfr: "",
      viabilidad: "",
      esquema: "",
      arquitectura: "",
      identidad: "",
    }
  }
];

export default function PromptRefiner({ phase }: PromptRefinerProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'build'>('config');
  const [currentStep, setCurrentStep] = useState(0);
  
  const [blocks, setBlocks] = useState({
    rol: "",
    contexto: "",
    freno: "",
    diagnostico: "",
    accion: "",
    limites: "",
    entrega: "",
    nfr: "",
    viabilidad: "",
    esquema: "",
    arquitectura: "",
    identidad: "",
  });
  
  const [userProfile, setUserProfile] = useState<'aprendiz' | 'profesional'>('aprendiz');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [researchSource, setResearchSource] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<{ optimizedPrompt?: string; result?: string; explanation?: string } | null>(null);
  const [typingText, setTypingText] = useState("");

  const isRequirementsPhase = phase.name === "Requerimientos";
  const isAnalysisPhase = phase.name === "Análisis";
  const isDatabasePhase = phase.name === "Modelado de Base de Datos";
  const isUIPhase = phase.name === "Diseño de Interfaz";

  const currentSteps = isUIPhase ? UI_STEPS : isDatabasePhase ? DB_STEPS : isAnalysisPhase ? ANAL_STEPS : isRequirementsPhase ? REQ_STEPS : STEPS;
  const currentAgents = isUIPhase ? UI_AGENT_PROFILES : isDatabasePhase ? DB_AGENT_PROFILES : isAnalysisPhase ? ANAL_AGENT_PROFILES : isRequirementsPhase ? REQ_AGENT_PROFILES : AGENT_PROFILES;
  const currentTools = isUIPhase ? UI_TOOLS_DB : isDatabasePhase ? DB_TOOLS_DB : isAnalysisPhase ? ANAL_TOOLS_DB : isRequirementsPhase ? REQ_TOOLS_DB : TOOLS_DB;

  const handleInputChange = (id: string, value: string) => {
    setBlocks(prev => ({ ...prev, [id]: value }));
  };

  const selectAgent = (agent: any) => {
    setSelectedAgent(agent.id);
    const agentPrompt = `${agent.label}: ${agent.desc} Especializado en ${agent.spec.join(", ")}.`;
    setBlocks(prev => ({ ...prev, rol: agentPrompt }));
  };

  const toggleTool = (tool: any) => {
    setActiveTools(prev => {
      const isCurrentlyActive = prev.includes(tool.id);
      const nextTools = isCurrentlyActive ? prev.filter(t => t !== tool.id) : [...prev, tool.id];
      
      // Update action block text
      setBlocks(b => {
        let newAccion = b.accion;
        if (isCurrentlyActive) {
          newAccion = newAccion.replace(tool.prompt, "").replace(/^\s*$(?:\r\n?|\n)/gm, "").trim();
        } else {
          newAccion = newAccion ? `${newAccion}\n\n${tool.prompt}` : tool.prompt;
        }
        return { ...b, accion: newAccion };
      });
      return nextTools;
    });
  };

  const toggleSkill = (skill: { label: string, text: string }) => {
    setActiveSkills(prev => {
      const isCurrentlyActive = prev.includes(skill.label);
      const nextSkills = isCurrentlyActive ? prev.filter(s => s !== skill.label) : [...prev, skill.label];
      
      setBlocks(b => {
        let newLimites = b.limites;
        if (isCurrentlyActive) {
          newLimites = newLimites.replace(`- ${skill.label}: ${skill.text}`, "").replace(/^\s*$(?:\r\n?|\n)/gm, "").trim();
        } else {
          const entry = `- ${skill.label}: ${skill.text}`;
          newLimites = newLimites ? `${newLimites}\n${entry}` : entry;
        }
        return { ...b, limites: newLimites };
      });
      return nextSkills;
    });
  };

  const setResearch = (source: any) => {
    setResearchSource(source.id);
    setBlocks(b => {
      const researchTag = `[FUENTE DE VERDAD: ${source.label}]`;
      let newDiag = b.diagnostico.replace(/\[FUENTE DE VERDAD: .*?\]\s*/, "");
      newDiag = `${researchTag}\n${newDiag}`.trim();
      return { ...b, diagnostico: newDiag };
    });
  };

  const marketIntelModel = useMemo(() => {
    if (activeTools.length > 2) return { name: "GPT-4o", desc: "Maestría en Function Calling múltiple." };
    if (activeTools.includes("python") || activeTools.includes("sql")) return { name: "Claude 3.5 Sonnet", desc: "Top Tier en código y razonamiento algorítmico." };
    if (activeSkills.length > 3) return { name: "o1-preview", desc: "Capacidad de razonamiento profundo frente a altos límites." };
    return { name: "Gemini 1.5 Flash", desc: "Rapidez estela para orquestación básica." };
  }, [activeTools, activeSkills]);

  const executeAI = async () => {
    setIsGenerating(true);
    setAiOutput(null);
    setTypingText("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phaseId: phase.id,
          phaseName: phase.name,
          blocks
        })
      });

      const data = await res.json();
      setAiOutput(data);
      
      let i = 0;
      const text = data.result || "";
      const timer = setInterval(() => {
        setTypingText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(timer);
      }, 5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const fullPromptPreview = useMemo(() => {
    return Object.entries(blocks)
      .filter(([_, val]) => val.length > 0)
      .map(([key, val]) => `[${key.toUpperCase()}]\n${val}`)
      .join("\n\n");
  }, [blocks]);

  const currentStepData = currentSteps[currentStep] || currentSteps[0]!;
  const currentStepKey = currentStepData.id;

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 min-h-[850px]">
      
      {/* 40% LEFT PANEL */}
      <div className="flex-1 xl:w-[40%] space-y-6 flex flex-col">
        {/* TABS HEADER & PROFILE SWITCH */}
        <div className="flex flex-col gap-4 shrink-0">
          <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/10">
            <button
              onClick={() => setActiveTab('config')}
              className={cn(
                "flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2",
                activeTab === 'config' ? "bg-primary text-black shadow-lg" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Settings className="w-4 h-4" /> {isUIPhase ? "1. Perfil del Diseñador" : isDatabasePhase ? "1. Perfil del DBA" : isAnalysisPhase ? "1. Perfil del Analista" : isRequirementsPhase ? "1. Perfil del Agente" : "Configuración de Agente"}
            </button>
            <button
              onClick={() => setActiveTab('build')}
              className={cn(
                "flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2",
                activeTab === 'build' ? "bg-accent text-black shadow-lg" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Layers className="w-4 h-4" /> {isUIPhase ? "2. Identidad y Layout" : isDatabasePhase ? "2. Diseño de Esquema" : isAnalysisPhase ? "2. Modelado y Viabilidad" : isRequirementsPhase ? "2. Definición FR/NFR" : "Construcción de Prompt"}
            </button>
          </div>

          {/* Profile Toggle Switch */}
          <div className="flex items-center justify-between px-4 py-3 glass rounded-2xl border-white/5">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full", userProfile === 'aprendiz' ? "bg-amber-400 animate-pulse" : "bg-primary")} />
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nivel de Usuario</p>
                <p className="text-xs font-bold text-white capitalize">{userProfile}</p>
              </div>
            </div>
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setUserProfile('aprendiz')}
                className={cn("px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all", userProfile === 'aprendiz' ? "bg-amber-400 text-black" : "text-white/40")}
              >
                Aprendiz
              </button>
              <button 
                onClick={() => setUserProfile('profesional')}
                className={cn("px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all", userProfile === 'profesional' ? "bg-primary text-black" : "text-white/40")}
              >
                Pro
              </button>
            </div>
          </div>
        </div>

        <div className="glass flex-1 rounded-[2.5rem] relative overflow-hidden border border-white/10 shadow-3xl bg-black/40 flex flex-col p-6">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: AGENT CONFIGURATION */}
            {activeTab === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 overflow-y-auto custom-scrollbar pr-2 pb-4 h-full"
              >
                {/* Agentes */}
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-primary" /> 1. Selector de Agente
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentAgents.map((agent: any) => (
                      <button
                        key={agent.id}
                        onClick={() => selectAgent(agent)}
                        className={cn(
                          "p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all",
                          selectedAgent === agent.id ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,166,126,0.2)]" : "bg-black/50 border-white/10 hover:border-primary/40 text-[#D7D3C2]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", selectedAgent === agent.id ? "bg-primary border-primary text-black" : "bg-white/5 border-white/10 text-white/60")}>
                            {React.createElement(agent.icon, { className: "w-4 h-4" })}
                          </div>
                          <span className={cn("text-xs font-bold leading-tight", selectedAgent === agent.id ? "text-primary" : "text-white")}>{agent.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.spec.map((s: string, i: number) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{s}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Herramientas (Tools) */}
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Wrench className="w-4 h-4 text-accent" /> 2. Tools Library (Acción)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {currentTools.map((tool: any) => {
                      const isActive = activeTools.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => toggleTool(tool)}
                          className={cn(
                            "px-4 py-3 rounded-xl border text-[11px] font-bold flex items-center gap-3 transition-all",
                            isActive ? "bg-accent/20 border-accent text-white shadow-[0_0_10px_rgba(255,165,0,0.2)]" : "bg-black/50 border-white/10 text-white/40 hover:text-white"
                          )}
                        >
                          {React.createElement(tool.icon, { className: cn("w-4 h-4", isActive ? "text-accent" : "") })}
                          {tool.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-4 h-4 text-purple-400" /> 3. Skills Check (Límites)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold ml-1">Soft Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DB.soft.map((skill, i: number) => (
                          <button
                            key={i}
                            onClick={() => toggleSkill(skill)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition-all",
                              activeSkills.includes(skill.label) ? "bg-purple-500/20 border-purple-500 text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <Award className="w-3 h-3" /> {skill.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold ml-1">Hard Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DB.hard.map((skill, i: number) => (
                          <button
                            key={i}
                            onClick={() => toggleSkill(skill)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition-all",
                              activeSkills.includes(skill.label) ? "bg-red-500/20 border-red-500 text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <Code className="w-3 h-3" /> {skill.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Intel */}
                <div className="glass p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)] mt-8">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4" /> Market Intelligence 2026
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Modelo Recomendado para tu contexto:</p>
                      <p className="text-lg font-black text-white">{marketIntelModel.name}</p>
                      <p className="text-[10px] text-blue-400 mt-1 italic">{marketIntelModel.desc}</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: PROMPT ARCHITECTURE (7 Pillars) */}
            {activeTab === 'build' && (
              <motion.div
                key="build"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent" /> Ingeniería del Prompt
                  </h3>
                  {phase.name === "QA & Testing" && (
                    <div className="flex gap-2">
                      {QA_TEMPLATES.map(tpl => (
                        <button 
                          key={tpl.id}
                          onClick={() => setBlocks(tpl.blocks)}
                          className="px-3 py-1 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary text-[9px] text-[#D7D3C2] hover:text-primary font-bold uppercase rounded-lg transition-all"
                        >
                          Cargar: {tpl.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 pb-4">
                  {currentSteps.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = blocks[step.id as keyof typeof blocks]?.length > 0;
                    
                    return (
                      <div 
                        key={step.id} 
                        className={cn(
                          "rounded-2xl border transition-all duration-300 overflow-hidden",
                          isActive ? "bg-white/5 border-primary/50 shadow-[0_0_15px_rgba(0,166,126,0.1)]" : "bg-transparent border-white/5"
                        )}
                      >
                        <button 
                          onClick={() => setCurrentStep(idx)}
                          className="w-full flex items-center justify-between p-4 focus:outline-none hover:bg-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                               isActive ? "bg-primary/20 text-primary" : isCompleted ? "bg-accent/20 text-accent" : "bg-white/5 text-white/40"
                            )}>
                              {React.createElement(step.icon, { className: "w-4 h-4" })}
                            </div>
                            <span className={cn(
                              "font-bold text-sm tracking-tight capitalize",
                              isActive ? "text-white" : isCompleted ? "text-[#D7D3C2]" : "text-white/40"
                            )}>
                              {step.label}
                            </span>
                            {userProfile === 'aprendiz' && isActive && (isRequirementsPhase || isAnalysisPhase || isDatabasePhase) && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-black animate-pulse">
                                MODO GUÍA
                              </span>
                            )}
                          </div>
                          {isCompleted && !isActive && <CheckCircle2 className="w-4 h-4 text-accent" />}
                        </button>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="p-4 pt-0">
                                
                                {/* Educational Concept Explanation (Aprendiz only) */}
                                {userProfile === 'aprendiz' && (isRequirementsPhase || isAnalysisPhase || isDatabasePhase || isUIPhase) && (
                                  <div className="mb-4 p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-[11px] text-amber-200/70 leading-relaxed flex items-start gap-2">
                                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                      {isRequirementsPhase && (
                                        <>
                                          {step.id === 'contexto' && "El contexto define el escenario actual. Explica por qué necesitamos esta solución."}
                                          {step.id === 'nfr' && "Los Requerimientos No Funcionales definen CÓMO debe operar el sistema (Seguridad, Rapidez, Escalabilidad)."}
                                          {step.id === 'accion' && "Aquí defines los Requerimientos Funcionales: Qué debe HACER el sistema paso a paso."}
                                        </>
                                      )}
                                      {isAnalysisPhase && (
                                        <>
                                          {step.id === 'contexto' && "Define los antecedentes del sistema para entender el flujo de datos necesario."}
                                          {step.id === 'viabilidad' && "La viabilidad asegura que tenemos los datos y la tecnología para construir lo que planeamos."}
                                          {step.id === 'accion' && "El Análisis Funcional detalla cómo se procesa la información y qué reglas de negocio aplican."}
                                          {step.id === 'limites' && "El Análisis Estructural define la DB (esquemas) y la arquitectura técnica del backend."}
                                        </>
                                      )}
                                      {isDatabasePhase && (
                                        <>
                                          {step.id === 'rol' && "Como DBA, tu misión es diseñar una base de datos segura, rápida y sin redundancia."}
                                          {step.id === 'esquema' && "Define tablas maestros (ej. Catálogos) y transaccionales (ej. Movimientos/Apuestas)."}
                                          {step.id === 'accion' && "Define restricciones: Claves Foráneas, Índices y valores NOT NULL."}
                                          {step.id === 'entrega' && "Prioriza esquemas en Prisma (ORM) y scripts SQL DDL."}
                                        </>
                                      )}
                                      {isUIPhase && (
                                        <>
                                          {step.id === 'arquitectura' && "No pienses en color aún. Define cuál es la acción principal (CTA) que el usuario debe realizar."}
                                          {step.id === 'identidad' && "Los design tokens (colores, bordes) aseguran que el desarrollo sea consistente con Tailwind."}
                                          {step.id === 'accion' && "Define la disposición de los componentes atómicos (botones, cards, inputs)."}
                                          {step.id === 'limites' && "Asegura que el diseño sea accesible (A11y) y respete los ratios de contraste."}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* NFR Assistant Guided UI */}
                                {step.id === 'nfr' && isRequirementsPhase && userProfile === 'aprendiz' && (
                                  <div className="mb-4 space-y-4">
                                    {NFR_GUIDE.map(guide => (
                                      <div key={guide.id} className="space-y-2">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">{guide.label}</p>
                                        <div className="grid grid-cols-1 gap-2">
                                          {guide.options.map(opt => (
                                            <button
                                              key={opt.label}
                                              onClick={() => {
                                                const currentVal = blocks.nfr;
                                                const entry = `[${guide.label}]: ${opt.text}`;
                                                // Avoid duplicate categories
                                                const baseVal = currentVal.replace(new RegExp(`\\[${guide.label}\\]: .*?(\\n|$)`, 'g'), "");
                                                handleInputChange('nfr', `${baseVal}\n${entry}`.trim());
                                              }}
                                              className={cn(
                                                "p-3 rounded-xl border text-left transition-all text-xs",
                                                blocks.nfr.includes(opt.text) ? "bg-primary/20 border-primary text-white" : "bg-black/40 border-white/5 text-white/40 hover:border-white/20"
                                              )}
                                            >
                                              <span className="font-bold block mb-1">{opt.label}</span>
                                              <span className="opacity-60">{opt.text}</span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Viabilidad Assistant Guided UI (Analysis Phase) */}
                                {step.id === 'viabilidad' && isAnalysisPhase && userProfile === 'aprendiz' && (
                                  <div className="mb-4 space-y-4">
                                    {ANAL_VIABILITY_GUIDE.map(guide => (
                                      <div key={guide.id} className="space-y-2">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">{guide.label}</p>
                                        <div className="grid grid-cols-1 gap-2">
                                          {guide.options.map(opt => (
                                            <button
                                              key={opt.label}
                                              onClick={() => {
                                                const currentVal = blocks.viabilidad;
                                                const entry = `[${guide.label}]: ${opt.text}`;
                                                // Avoid duplicate categories
                                                const baseVal = currentVal.replace(new RegExp(`\\[${guide.label}\\]: .*?(\\n|$)`, 'g'), "");
                                                handleInputChange('viabilidad', `${baseVal}\n${entry}`.trim());
                                              }}
                                              className={cn(
                                                "p-3 rounded-xl border text-left transition-all text-xs",
                                                blocks.viabilidad.includes(opt.text) ? "bg-primary/20 border-primary text-white" : "bg-black/40 border-white/5 text-white/40 hover:border-white/20"
                                              )}
                                            >
                                              <span className="font-bold block mb-1">{opt.label}</span>
                                              <span className="opacity-60">{opt.text}</span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Normalization Assistant UI (Database Phase) */}
                                {step.id === 'esquema' && isDatabasePhase && userProfile === 'aprendiz' && (
                                  <div className="mb-4 space-y-4">
                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-3">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                          <ShieldCheck className="w-3.5 h-3.5" /> Asistente de Normalización
                                        </p>
                                        <button className="px-3 py-1 bg-primary text-black text-[9px] font-black uppercase rounded-lg hover:bg-[#008f6d] transition-colors">
                                          Validar Normalización
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-white/50 leading-relaxed">
                                        Haz clic para verificar si tu esquema cumple con las reglas 1NF, 2NF y 3NF. Evitaremos redundancias y datos inconsistentes.
                                      </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-2 mt-4">
                                      <div className="p-3 rounded-xl border border-white/5 bg-black/40">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Tip de Identidad</span>
                                        </div>
                                        <p className="text-[11px] text-white/60 leading-relaxed">
                                          Usamos **UUID** por defecto para que tus IDs sean únicos globalmente y más seguros (evita predecir registros).
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Identity Card Preview & Contrast UI (UI/UX Phase) */}
                                {step.id === 'identidad' && isUIPhase && userProfile === 'aprendiz' && (() => {
                                  // Basic Contrast Logic (Extract Hex if present)
                                  const getHex = (text: string, fallback: string) => {
                                    const match = text.match(/#[0-9a-fA-F]{6}/);
                                    return match ? match[0] : fallback;
                                  };
                                  
                                  const primaryHex = getHex(blocks.identidad, "#00A67E");
                                  
                                  // Simple Luminance check
                                  const hexToRgb = (hex: string) => {
                                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                    return result ? {
                                      r: parseInt(result[1]!, 16),
                                      g: parseInt(result[2]!, 16),
                                      b: parseInt(result[3]!, 16)
                                    } : { r: 0, g: 0, b: 0 };
                                  };
                                  
                                  const rgb = hexToRgb(primaryHex);
                                  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
                                  const textColor = luminance > 0.5 ? "text-black" : "text-white";
                                  
                                  return (
                                    <div className="mb-4 space-y-4">
                                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Vista Previa: Identity Card</p>
                                      <div 
                                        className="p-6 rounded-3xl border border-white/10 transition-all duration-500 shadow-xl overflow-hidden relative group"
                                        style={{ backgroundColor: primaryHex }}
                                      >
                                        <div className="relative z-10">
                                          <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-60", textColor)}>
                                            Identidad Visual v1.0
                                          </p>
                                          <h4 className={cn("text-xl font-black mb-4 tracking-tighter", textColor)}>
                                            Probar contraste de la Identity Card
                                          </h4>
                                          <div className="flex gap-2">
                                            <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold border", textColor === "text-white" ? "bg-white/10 border-white/20" : "bg-black/10 border-black/20", textColor)}>
                                              Primary Token
                                            </div>
                                            <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold border", textColor === "text-white" ? "bg-white/10 border-white/20" : "bg-black/10 border-black/20", textColor)}>
                                              A11y Check
                                            </div>
                                          </div>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                          <Layers className={cn("w-16 h-16", textColor)} />
                                        </div>
                                      </div>
                                      
                                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[10px] text-white/50 leading-relaxed italic">
                                        Tip: Escribe un color hexadecimal (ej: #000000) para ver cómo el sistema ajusta automáticamente la legibilidad del texto.
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* Hierarchy Assistant UI (UI/UX Phase) */}
                                {step.id === 'arquitectura' && isUIPhase && userProfile === 'aprendiz' && (
                                  <div className="mb-4 space-y-4">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Arquitecto de Wireframes</p>
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                                      <p className="text-[11px] font-bold text-white/80">¿Cuál es la acción principal (CTA) de esta pantalla?</p>
                                      <div className="grid grid-cols-2 gap-2">
                                        {['Registrar Apuesta', 'Ver Resultados', 'Cargar Saldo', 'Ver Perfil'].map(act => (
                                          <button
                                            key={act}
                                            onClick={() => handleInputChange('arquitectura', `${blocks.arquitectura}\n[CTA PRINCIPAL]: ${act}`.trim())}
                                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/40 hover:bg-primary/20 hover:text-primary hover:border-primary transition-all"
                                          >
                                            {act}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Research Module injected inside Diagnóstico step */}
                                {step.id === 'diagnostico' && (
                                  <div className="mb-4 bg-black/40 p-4 rounded-xl border border-white/10">
                                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                       <Search className="w-3.5 h-3.5" /> Investigación Previa (Fuente de Verdad)
                                     </p>
                                     <div className="flex flex-wrap gap-2">
                                       {RESEARCH_SOURCES.map(source => (
                                         <button
                                           key={source.id}
                                           onClick={() => setResearch(source)}
                                           className={cn(
                                             "px-3 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-2 transition-all",
                                             researchSource === source.id ? "bg-amber-500/20 border-amber-500 text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                                           )}
                                         >
                                           {React.createElement(source.icon, { className: "w-3 h-3" })}
                                           {source.label}
                                         </button>
                                       ))}
                                     </div>
                                  </div>
                                )}

                                <div className="relative group">
                                  <textarea
                                    value={blocks[step.id as keyof typeof blocks]}
                                    onChange={(e) => handleInputChange(step.id, e.target.value)}
                                    placeholder={step.placeholder}
                                    className="w-full h-40 bg-black/60 border border-white/10 rounded-xl p-4 text-sm text-[#F3EFE0] placeholder-white/20 focus:outline-none focus:border-primary/50 resize-none font-medium leading-relaxed"
                                  />
                                  <div className="absolute bottom-4 right-4 pointer-events-none opacity-[0.05] group-focus-within:opacity-[0.1] transition-opacity">
                                    {React.createElement(step.icon, { className: "w-20 h-20 text-white" })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto shrink-0">
                  <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 disabled:opacity-30 transition-all text-[#D7D3C2]/60 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
                    disabled={currentStep === 6}
                    className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all uppercase tracking-wider disabled:opacity-30"
                  >
                    Sig <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* 60% RIGHT PANEL: Hacker AI Terminal & Explanations */}
      <div className="xl:w-[60%] flex flex-col gap-6">
        <div className={cn(
          "glass rounded-[2.5rem] bg-[#0A0A0A] border-2 flex flex-col flex-1 overflow-hidden relative min-h-[500px] transition-all duration-700",
          activeSkills.includes("OWASP Security Shield") ? "border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.25)]" : "border-primary/20 shadow-2xl"
        )}>
          <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.08] z-10" />
          
          <div className="h-14 bg-black border-b border-primary/20 flex items-center justify-between px-8 shrink-0 z-20">
            <div className="flex items-center gap-3">
              <TerminalIcon className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-black text-primary/80 uppercase tracking-widest">
                DevFlow::Orchestration_Lab {isRequirementsPhase ? "- Requirements Core" : isAnalysisPhase ? "- Analysis Engine" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={executeAI}
                disabled={isGenerating || !blocks.rol}
                className="bg-primary hover:bg-[#008f6d] px-6 py-2 rounded-xl text-[10px] font-black text-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgb(0,166,126,0.4)] uppercase tracking-wider disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                REFINAR PROMPT
              </button>
              
              <button 
                onClick={() => fullPromptPreview && navigator.clipboard.writeText(fullPromptPreview)}
                disabled={!fullPromptPreview}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 px-4 py-2 rounded-xl text-[10px] text-white transition-colors flex items-center gap-2 border border-white/10 font-bold uppercase tracking-wider"
              >
                <Copy className="w-3.5 h-3.5" /> COPY RAW
              </button>
            </div>
          </div>

          <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-y-auto custom-scrollbar-terminal z-20">
            {isGenerating ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-primary/20 rounded w-3/4" />
                <div className="h-4 bg-primary/20 rounded w-1/2" />
                <div className="h-4 bg-primary/20 rounded w-5/6" />
                <div className="flex items-center gap-2 mt-4">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-primary italic">Orquestando arquitectura basada en {marketIntelModel.name}...</span>
                </div>
              </div>
            ) : aiOutput ? (
              <div className="space-y-8">
                <div>
                  <p className="text-primary font-bold mb-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" /> ./prompt_orquestado.sh
                  </p>
                  <pre className="bg-primary/5 p-6 rounded-2xl border border-primary/20 whitespace-pre-wrap text-[#D7D3C2]/90 leading-relaxed italic shadow-inner">
                    {aiOutput.optimizedPrompt}
                  </pre>
                </div>
                
                <div>
                  <p className="text-accent font-bold mb-3 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> ./ejecutar_tarea.sh
                  </p>
                  <div className="text-white whitespace-pre-wrap bg-black/50 p-6 rounded-2xl border border-white/5">
                    <span className="text-primary font-bold mr-2 text-xs">root@devflow:~$</span>
                    {typingText}
                    <span className="inline-block w-2.5 h-5 bg-primary ml-1 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <Command className="w-20 h-20 mb-6 text-primary" />
                <p className="text-lg font-bold uppercase tracking-widest text-[#D7D3C2]">Laboratorio de Orquestación</p>
                <p className="text-xs mt-3 text-[#D7D3C2]/70 font-sans max-w-md mx-auto">Selecciona tu Agente, configura Herramientas y Skills, luego construye los 7 pilares semánticos para iniciar.</p>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {aiOutput?.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="glass p-6 rounded-3xl border border-accent/20 bg-accent/5 shadow-xl shrink-0"
            >
              <div className="flex items-center gap-3 mb-3">
                <BrainCircuit className="w-5 h-5 text-accent" />
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Explicación Arquitectónica</h4>
              </div>
              <p className="text-sm text-[#D7D3C2]/80 leading-relaxed font-medium pl-2">
                {aiOutput.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
