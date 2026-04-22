"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Info, TriangleAlert, Stethoscope, PlayCircle, ShieldAlert, Send,
  Zap, Terminal as TerminalIcon, Copy, ChevronRight, Loader2, Sparkles,
  Briefcase, Code, Palette, Workflow, Cpu, Database, Terminal, BrainCircuit,
  Command, FileCode, Globe, Settings, ShieldCheck, CheckCircle2, LayoutTemplate,
  Layers, BugPlay, Activity, Award, Search, BookOpen, GitBranch, Wrench, ClipboardCheck,
  Rocket, ArrowDown
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import MethodologyBoard from "./MethodologyBoard";
import { SPECIALIZED_TEMPLATES } from "../lib/templates.config";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface PromptRefinerProps { phase: any; }

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

export default function PromptRefiner({ phase }: PromptRefinerProps) {
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
          template: activeTemplate // Pass the specialized template to the API
        }) 
      });
      const data = await res.json(); 
      setAiOutput(data);
      setIterationSnapshots(prev => ({ ...prev, [activeTaskId]: { ...data, style: activeTemplate?.panelA_style } }));
      setProjectTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, status: 'done' as const } : t));
      
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
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                <button onClick={() => setActiveTab('config')} className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all", activeTab === 'config' ? "bg-white/10 text-white" : "text-white/30")}>Agente</button>
                <button onClick={() => setActiveTab('build')} className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all", activeTab === 'build' ? "bg-primary/20 text-primary" : "text-white/30")}>Prompt</button>
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
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <textarea 
                      value={blocks[`${activeTaskId}-${PROMPT_PILLARS[currentPillar]?.id}`] || ""}
                      onChange={(e) => setBlocks(prev => ({ ...prev, [`${activeTaskId}-${PROMPT_PILLARS[currentPillar]?.id}`]: e.target.value }))}
                      className="relative w-full h-48 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-sm text-[#F3EFE0] resize-none focus:border-primary/40 focus:outline-none transition-all font-mono"
                      placeholder={`Escribe el ${PROMPT_PILLARS[currentPillar]?.label} para ${activeMilestoneLabel}...`}
                    />
                  </div>
                  <button onClick={executeAI} disabled={isGenerating} className="w-full bg-primary hover:bg-[#008f6d] py-6 rounded-3xl text-sm font-black text-black uppercase transition-all shadow-[0_0_40px_rgba(0,166,126,0.2)] flex items-center justify-center gap-4">
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                    {isGenerating ? "Procesando Iteración..." : "Finalizar y Mover a Done"}
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
                      "whitespace-pre-wrap break-words",
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
