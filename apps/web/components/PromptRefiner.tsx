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
  Book
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
      entrega: "Devuelve el código del test en un bloque ```typescript."
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
      entrega: "Script de Playwright `.spec.ts` y tabla Markdown con los Casos de Borde probados."
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
  });
  
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [researchSource, setResearchSource] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<{ optimizedPrompt?: string; result?: string; explanation?: string } | null>(null);
  const [typingText, setTypingText] = useState("");

  const name = phase.name;

  const handleInputChange = (id: string, value: string) => {
    setBlocks(prev => ({ ...prev, [id]: value }));
  };

  const selectAgent = (agent: typeof AGENT_PROFILES[0]) => {
    setSelectedAgent(agent.id);
    const agentPrompt = `${agent.label}: ${agent.desc} Especializado en ${agent.spec.join(", ")}.`;
    setBlocks(prev => ({ ...prev, rol: agentPrompt }));
  };

  const toggleTool = (tool: typeof TOOLS_DB[0]) => {
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

  const setResearch = (source: typeof RESEARCH_SOURCES[0]) => {
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

  const currentStepData = STEPS[currentStep] || STEPS[0]!;
  const currentStepKey = currentStepData.id;

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 min-h-[850px]">
      
      {/* 40% LEFT PANEL */}
      <div className="flex-1 xl:w-[40%] space-y-6 flex flex-col">
        {/* TABS HEADER */}
        <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('config')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2",
              activeTab === 'config' ? "bg-primary text-black shadow-lg" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <Settings className="w-4 h-4" /> Configuración de Agente
          </button>
          <button
            onClick={() => setActiveTab('build')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2",
              activeTab === 'build' ? "bg-accent text-black shadow-lg" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <Layers className="w-4 h-4" /> Construcción de Prompt
          </button>
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
                    {AGENT_PROFILES.map((agent) => (
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
                          {agent.spec.map((s, i) => (
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
                    {TOOLS_DB.map((tool) => {
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
                        {SKILLS_DB.soft.map((skill, i) => (
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
                        {SKILLS_DB.hard.map((skill, i) => (
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
                  {STEPS.map((step, idx) => {
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
                DevFlow::Orchestration_Lab
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
