"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "../context/TutorialContext";
import { useTokenomics } from "../context/TokenomicsContext";
import { TOKENOMICS_CONFIG, ModelId } from "../lib/tokenomics.config";
import { 
  Briefcase, Code, Palette, Workflow, Cpu, Database, Terminal, 
  BrainCircuit, LayoutGrid, Settings, HelpCircle, LogOut, LucideIcon, 
  Sparkles, ShieldCheck, Lock, ChevronRight, ClipboardList, Search, 
  Layout as LayoutIcon, Code2, ShieldAlert, Rocket, Wrench, User, BookOpen,
  Zap, Battery, BatteryMedium, BatteryFull, BatteryWarning, Send, Loader2,
  Copy, ArrowRight, AlertCircle, Info, ChevronDown, Stethoscope, PlayCircle, ArrowDown
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import MethodologyBoard from "./MethodologyBoard";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { SdlcPhase, Category } from "@devflow/core";
import { SPECIALIZED_TEMPLATES } from "../lib/templates.config";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface PromptRefinerProps { 
  phase: SdlcPhase & { categories: Category[] }; 
  injectedBody?: string; 
}

const PROMPT_PILLARS = [
  { id: "contexto", label: "Contexto", icon: Info },
  { id: "diagnostico", label: "Diagnóstico", icon: Stethoscope },
  { id: "accion", label: "Acción", icon: PlayCircle },
  { id: "entrega", label: "Entrega", icon: Send },
];

const PHASE_MILESTONES: Record<string, string[]> = {
  "Requerimientos": ["Análisis de Stakeholders", "Matriz de Trazabilidad", "Definición de NFRs", "Documento de Acción Funcional"],
  "Análisis": ["Análisis de Viabilidad", "Definición de Stack", "Modelado de Procesos", "Validación de Viabilidad", "Contratos de Interfaz"],
  "Modelado de Base de Datos": ["Diccionario de Datos", "Esquema ER", "Script de Normalización", "Diferencial de Migración"],
  "Diseño de Interfaz": ["Wireframes", "Prototipo de Alta Fidelidad", "Definición de Design Tokens", "Auditoría de Accesibilidad"],
  "Implementación": ["Setup del Proyecto", "Desarrollo de Features", "Server Actions Config", "Integración de Servicios"],
  "Producción/Despliegue": ["Configuración de CI/CD", "Monitoreo y Alertas", "IaC Terraform Setup", "Estrategia Blue-Green"],
  "QA & Testing": ["Automatización de Pruebas", "Planes E2E", "Diseño de Casos de Prueba", "Bug Report Matrix"],
  "OWASP / Seguridad": ["Auditoría OWASP", "Análisis Snyk", "Defensa en Profundidad", "Sanitización de Inputs"]
};

const TASK_METADATA: Record<string, { desc: string; icon: any; color: string }> = {
  "Análisis de Stakeholders": { desc: "Identifica a los actores clave y sus necesidades.", icon: User, color: "text-blue-400" },
  "Matriz de Trazabilidad": { desc: "Mapea requerimientos con objetivos de negocio.", icon: ClipboardList, color: "text-purple-400" },
  "Análisis de Viabilidad": { desc: "Valida si el proyecto es técnica y financieramente posible.", icon: Search, color: "text-amber-400" },
  "Definición de Stack": { desc: "Selecciona las herramientas y lenguajes adecuados.", icon: Code2, color: "text-emerald-400" },
  "Diccionario de Datos": { desc: "Define la estructura y significado de cada entidad.", icon: Database, color: "text-cyan-400" },
  "Setup del Proyecto": { desc: "Configuración inicial del repositorio y entorno.", icon: Rocket, color: "text-orange-400" },
  "Auditoría OWASP": { desc: "Verificación de las 10 vulnerabilidades más críticas.", icon: ShieldAlert, color: "text-red-400" },
  "Definición de NFRs": { desc: "Especifica atributos de calidad como rendimiento y seguridad.", icon: Settings, color: "text-indigo-400" },
  "Esquema ER": { desc: "Diseño lógico de la base de datos y sus relaciones.", icon: LayoutGrid, color: "text-pink-400" },
  "Desarrollo de Features": { desc: "Codificación de las funcionalidades principales.", icon: Code, color: "text-blue-500" }
};

export default function PromptRefiner({ phase, injectedBody }: PromptRefinerProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'build'>('config');
  const [currentPillar, setCurrentPillar] = useState(0);
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [userProfile, setUserProfile] = useState<'aprendiz' | 'profesional'>('aprendiz');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>("");
  const [iterationSnapshots, setIterationSnapshots] = useState<Record<string, any>>({});
  const [selectedIterationId, setSelectedIterationId] = useState<string | null>(null);

  // COPILOT INTEGRATION: Readable State
  useCopilotReadable({
    description: "La fase actual del SDLC y sus categorías de hitos.",
    value: phase,
  });

  useCopilotReadable({
    description: "Los bloques de texto actuales del prompt que el usuario está editando.",
    value: blocks,
  });

  useCopilotReadable({
    description: "La tarea (hito) activa que se está refinando.",
    value: projectTasks.find(t => t.id === activeTaskId),
  });

  // COPILOT INTEGRATION: Actions
  useCopilotAction({
    name: "updatePromptBlock",
    description: "Actualiza el contenido de un bloque específico del prompt (Contexto, Diagnóstico, Acción o Entrega).",
    parameters: [
      {
        name: "pillarId",
        type: "string",
        description: "El ID del pilar a actualizar (contexto, diagnostico, accion, entrega).",
        enum: PROMPT_PILLARS.map(p => p.id),
      },
      {
        name: "content",
        type: "string",
        description: "El nuevo contenido sugerido para ese bloque.",
      },
    ],
    handler: async ({ pillarId, content }) => {
      setBlocks(prev => ({ ...prev, [`${activeTaskId}-${pillarId}`]: content }));
    },
  });

  useCopilotAction({
    name: "moveToTask",
    description: "Cambia el hito activo a otro hito de la fase actual.",
    parameters: [
      {
        name: "taskId",
        type: "string",
        description: "El ID de la tarea a la que cambiar.",
        enum: projectTasks.map(t => t.id),
      },
    ],
    handler: async ({ taskId }) => {
      setActiveTaskId(taskId);
    },
  });

  useCopilotAction({
    name: "auditRisks",
    description: "Analiza el prompt actual en busca de riesgos técnicos o falta de detalle según la fase del SDLC.",
    handler: async () => {
      // This is a "read-only" analysis action for the brain
      return `Analizando riesgos para la fase ${phase.name}... He detectado que podrías mejorar los NFRs (Requerimientos No Funcionales) en el bloque de Acción.`;
    },
  });

  useCopilotAction({
    name: "executeRefinement",
    description: "Ejecuta el proceso de refinamiento por IA del hito actual.",
    handler: async () => {
      executeAI();
      return "Refinamiento iniciado. Verás los resultados en el panel de 'Arquitectura Técnica' en unos segundos.";
    },
  });

  useCopilotAction({
    name: "getDailyScrum",
    description: "Genera un reporte de progreso diario (Daily Scrum) para el aprendizaje del usuario.",
    handler: async () => {
      const doneCount = projectTasks.filter(t => t.status === 'done').length;
      const total = projectTasks.length;
      return `Reporte de Mentoría: Estamos en la fase de ${phase.name}. Has completado ${doneCount} de ${total} hitos técnicos. Sigue con ${activeMilestoneLabel} para mantener la velocidad del sprint.`;
    },
  });

  useEffect(() => {
    if (injectedBody && activeTaskId) {
      setBlocks(prev => {
        if (!prev[`${activeTaskId}-contexto`]) {
          return { ...prev, [`${activeTaskId}-contexto`]: injectedBody };
        }
        return prev;
      });
    }
  }, [injectedBody, activeTaskId]);

  const { selectedModel, setSelectedModel, deductCredits, isOutOfCredits, isHourlyLimited } = useTokenomics();
  const [showModelMenu, setShowModelMenu] = useState(false);

  useEffect(() => {
    const milestones = PHASE_MILESTONES[phase.name] || ["Configuración Inicial", "Refinamiento Técnico", "Validación Final"];
    const tasks = milestones.map((label, idx) => ({
      id: `task-${idx}`,
      label,
      status: "backlog" as const,
      points: 5,
      phase: phase.name
    }));
    setProjectTasks(tasks);
    setActiveTaskId(tasks[0]?.id || "");
  }, [phase.name]);

  const executeAI = async () => {
    if (isOutOfCredits || isHourlyLimited) return;
    
    setIsGenerating(true); setAiOutput(null);
    const activeTemplate = SPECIALIZED_TEMPLATES[activeMilestoneLabel] || null;
    
    try {
      const res = await fetch("/api/ai/generate", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          phaseId: phase.id, 
          phaseName: phase.name, 
          blocks, 
          milestone: activeTaskId,
          template: activeTemplate,
          model: selectedModel,
          forgeIdentity: typeof window !== 'undefined' ? localStorage.getItem('forge_identity_prompt') : null
        }) 
      });
      const data = await res.json(); 
      setAiOutput(data);
      setIterationSnapshots(prev => ({ ...prev, [activeTaskId]: { ...data, style: activeTemplate?.panelA_style } }));
      setProjectTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, status: 'done' as const } : t));
      
      // DEDUCT CREDITS
      deductCredits(1000); // Fixed 1000 base tokens for now
      
      // Auto-move to next task if available
      const currentIndex = projectTasks.findIndex(t => t.id === activeTaskId);
      if (currentIndex < projectTasks.length - 1) {
        setTimeout(() => setActiveTaskId(projectTasks[currentIndex + 1].id), 2000);
      }
    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
  };

  const activeMilestoneLabel = useMemo(() => projectTasks.find(t => t.id === activeTaskId)?.label || "Tarea", [projectTasks, activeTaskId]);

  return (
    <div className="w-full space-y-12 pb-20">
      
      {/* 1. TOP SECTION: THE METHODOLOGY BOARD (HORIZONTAL KANBAN) */}
      <section className="animate-in fade-in slide-in-from-top duration-700">
        <MethodologyBoard 
          currentPhase={phase.name} 
          projectTasks={projectTasks}
          activeTaskId={activeTaskId}
          onSelectIteration={(taskId) => {
            setSelectedIterationId(taskId);
            setActiveTaskId(taskId);
          }}
          userProfile={userProfile} 
        />
      </section>

      {/* FORGE SYNERGY ALERT */}
      {typeof window !== 'undefined' && localStorage.getItem('forge_identity_role') && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/20 flex items-center gap-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
             <BrainCircuit className="w-7 h-7 text-amber-500" />
          </div>
          <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-amber-500 text-black">Forged Identity Active</span>
                        <h4 className="text-sm font-bold text-white">Asistente: {localStorage.getItem('forge_identity_role')}</h4>
                      </div>
                      <p className="text-xs text-[#D7D3C2]/60">"He revisado la fase de <b>{phase.name}</b>. Aplicaré mis directrices de <b>{localStorage.getItem('forge_identity_role')}</b> para auditar riesgos y optimizar la arquitectura."</p>
                      {/* SYMBIOSIS: Contextual Task Tip */}
                      {TASK_METADATA[activeMilestoneLabel] && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-500/80 font-medium italic border-t border-amber-500/10 pt-3">
                          <Zap className="w-3 h-3" />
                          <span>Tip del Hito: {TASK_METADATA[activeMilestoneLabel].desc}</span>
                        </div>
                      )}
                  </div>
          <div className="hidden md:flex flex-col items-end gap-1">
             <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Sinergia Activada</div>
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: `${i*200}ms` }} />)}
             </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col items-center gap-4 opacity-20">
        <ArrowDown className="w-6 h-6 animate-bounce" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">SDLC Workspace Flow</span>
      </div>

      {/* 2. MIDDLE SECTION: REFINER & BUILDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* REFINER AREA (8 COLS) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-8 rounded-[3rem] border border-white/10 bg-black/40 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Refiner: <span className="text-primary">{activeMilestoneLabel}</span></h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Iteración Técnica del Hito</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                      isOutOfCredits ? "border-red-500/20 bg-red-500/5 text-red-500" : "border-white/5 bg-black/40 text-white/60 hover:border-white/20"
                    )}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {isOutOfCredits ? "Sinfín de Energía" : TOKENOMICS_CONFIG.MODELS.find(m => m.id === selectedModel)?.label}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-20" />
                  </button>

                  <AnimatePresence>
                    {showModelMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 left-0 w-64 glass p-2 rounded-2xl border-white/10 bg-black/90 z-100 shadow-2xl"
                      >
                        {TOKENOMICS_CONFIG.MODELS.map((m) => (
                          <button 
                            key={m.id}
                            onClick={() => { setSelectedModel(m.id as ModelId); setShowModelMenu(false); }}
                            className={cn(
                              "w-full flex flex-col items-start p-3 rounded-xl transition-all mb-1",
                              selectedModel === m.id ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-white/40"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-tight">{m.label}</span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40 font-bold">{m.multiplier}x</span>
                            </div>
                            <p className="text-[9px] leading-tight text-white/20">{m.desc}</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                  <button onClick={() => setActiveTab('config')} className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all", activeTab === 'config' ? "bg-white/10 text-white" : "text-white/30")}>Agente</button>
                  <button onClick={() => setActiveTab('build')} className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all", activeTab === 'build' ? "bg-primary/20 text-primary" : "text-white/30")}>Prompt</button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'config' ? (
                <motion.div key="config" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'pro', label: 'Senior Architect', icon: Briefcase, desc: 'Arquitectura y NFRs.' },
                    { id: 'dev', label: 'Fullstack Dev', icon: Code, desc: 'Lógica e implementación.' }
                  ].map(agent => (
                    <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={cn("p-5 rounded-3xl border-2 text-left transition-all", selectedAgent === agent.id ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" : "bg-black/20 border-white/5 hover:border-white/10")}>
                      <div className="flex items-center gap-3 mb-2">
                        <agent.icon className={cn("w-5 h-5", selectedAgent === agent.id ? "text-primary" : "text-white/40")} />
                        <span className="text-sm font-black text-white uppercase">{agent.label}</span>
                      </div>
                      <p className="text-[10px] text-white/40 leading-relaxed">{agent.desc}</p>
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="build" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 w-full overflow-x-auto custom-scrollbar-hide">
                    {PROMPT_PILLARS.map((p, idx) => (
                      <button key={p.id} onClick={() => setCurrentPillar(idx)} className={cn("flex-none flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", currentPillar === idx ? "bg-primary text-black" : "text-white/40 hover:text-white/60")}>
                        <p.icon className="w-3.5 h-3.5" /> {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <textarea 
                      value={blocks[`${activeTaskId}-${PROMPT_PILLARS[currentPillar]?.id}`] || ""}
                      onChange={(e) => setBlocks(prev => ({ ...prev, [`${activeTaskId}-${PROMPT_PILLARS[currentPillar]?.id}`]: e.target.value }))}
                      className="relative w-full h-48 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-sm text-[#F3EFE0] resize-none focus:border-primary/40 focus:outline-none transition-all font-mono"
                      placeholder={`Escribe el ${PROMPT_PILLARS[currentPillar]?.label} para ${activeMilestoneLabel}...`}
                    />
                  </div>
                  <button 
                    onClick={executeAI} 
                    disabled={isGenerating || isOutOfCredits || isHourlyLimited} 
                    className={cn(
                      "w-full py-6 rounded-3xl text-sm font-black uppercase transition-all flex items-center justify-center gap-4",
                      isOutOfCredits || isHourlyLimited 
                        ? "bg-red-500/20 border border-red-500/40 text-red-500 cursor-not-allowed" 
                        : "bg-primary hover:bg-[#008f6d] text-black shadow-[0_0_40px_rgba(0,166,126,0.2)]"
                    )}
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : (isOutOfCredits || isHourlyLimited) ? <BatteryWarning className="w-5 h-5" /> : <Zap className="w-5 h-5 fill-current" />}
                    {isGenerating ? "Procesando Iteración..." : (isOutOfCredits || isHourlyLimited) ? "Sin Energía (Límite Superado)" : "Finalizar y Mover a Done"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RESULTS AREA (4 COLS) - SIDE BY SIDE WITH REFINER ON LARGE SCREENS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[3rem] bg-[#050505] border border-primary/20 flex flex-col min-h-[350px] overflow-hidden">
             <div className="h-12 bg-black border-b border-primary/10 flex items-center px-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2"><Database className="w-3.5 h-3.5" /> Arquitectura Técnica</span>
             </div>
             <div className="flex-1 p-6 font-mono text-[11px] text-white/60 overflow-y-auto custom-scrollbar leading-relaxed">
                {selectedIterationId || aiOutput ? (
                  <div className={cn(
                    "h-full w-full transition-all duration-500",
                    (selectedIterationId ? iterationSnapshots[selectedIterationId]?.style : SPECIALIZED_TEMPLATES[activeMilestoneLabel]?.panelA_style) === 'table'
                      ? "bg-blue-400/5 border border-blue-400/20 p-6 rounded-lg text-blue-100 overflow-x-auto"
                      : (selectedIterationId ? iterationSnapshots[selectedIterationId]?.style : SPECIALIZED_TEMPLATES[activeMilestoneLabel]?.panelA_style) === 'sticky' 
                      ? "bg-yellow-400/10 border border-yellow-400/20 p-6 rounded-lg text-yellow-100 shadow-[inset_0_0_20px_rgba(250,204,21,0.05)]" 
                      : (selectedIterationId ? iterationSnapshots[selectedIterationId]?.style : SPECIALIZED_TEMPLATES[activeMilestoneLabel]?.panelA_style) === 'audit'
                      ? "bg-red-400/10 border border-red-400/20 p-6 rounded-lg text-red-100"
                      : ""
                  )}>
                    <pre className={cn(
                      "whitespace-pre-wrap wrap-break-word",
                      (selectedIterationId ? iterationSnapshots[selectedIterationId]?.explanation : aiOutput?.explanation)?.includes("Baja") && "text-green-400",
                      (selectedIterationId ? iterationSnapshots[selectedIterationId]?.explanation : aiOutput?.explanation)?.includes("Media") && "text-yellow-400",
                      (selectedIterationId ? iterationSnapshots[selectedIterationId]?.explanation : aiOutput?.explanation)?.includes("Alta") && "text-red-400"
                    )}>
                      {selectedIterationId ? iterationSnapshots[selectedIterationId]?.explanation : aiOutput?.explanation}
                    </pre>
                  </div>
                ) : (
                  <p className="opacity-20 italic">Selecciona una tarea de la columna 'Done' para auditar el resultado.</p>
                )}
             </div>
          </div>
          <div className="glass rounded-[3rem] bg-[#050505] border border-accent/20 flex flex-col min-h-[350px] overflow-hidden">
             <div className="h-12 bg-black border-b border-accent/10 flex items-center justify-between px-6">
                <span className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Prompt Final</span>
                <Copy className="w-3.5 h-3.5 text-white/20 hover:text-white cursor-pointer" />
             </div>
             <div className="flex-1 p-6 font-mono text-[11px] text-white/60 overflow-y-auto custom-scrollbar leading-relaxed">
                {selectedIterationId ? iterationSnapshots[selectedIterationId]?.optimizedPrompt : aiOutput?.optimizedPrompt || <p className="opacity-20 italic">El prompt optimizado aparecerá aquí tras la ejecución.</p>}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
