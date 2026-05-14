"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Cpu, Workflow, Terminal, BookOpen, 
  Zap, BrainCircuit, Rocket, ShieldCheck, Microscope,
  Loader2, Send, Copy, Database, Sparkles, ArrowDown,
  Hammer, Wrench, Briefcase, Code, Terminal as TerminalIcon
} from "lucide-react";
import { useTutorial } from "../context/TutorialContext";
import { useTokenomics } from "../context/TokenomicsContext";
import { TOKENOMICS_CONFIG } from "../lib/tokenomics.config";
import { BatteryMedium, BatteryWarning, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FORGE_PILLARS, FORGE_TEMPLATES, FORGE_AGENTS } from "../lib/forge.config";
import MethodologyBoard from "./MethodologyBoard";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface ForgeWorkspaceProps { 
  activePhaseId: string;
}

export default function ForgeWorkspace({ activePhaseId }: ForgeWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'build'>('config');
  const [currentPillar, setCurrentPillar] = useState(0);
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [selectedIterationId, setSelectedIterationId] = useState<string | null>(null);
  const [iterationSnapshots, setIterationSnapshots] = useState<Record<string, any>>({});
  const { isTutorialMode, skipTutorial, setHasForgedIdentity } = useTutorial();
  const { credits, deductCredits } = useTokenomics();

  const forgeTasks = useMemo(() => [
    { id: "stack", label: "Definición de Stack Personal", status: "backlog" as const },
    { id: "flow", label: "Diseño de Flujo Agéntico", status: "backlog" as const },
    { id: "mcp", label: "Conectividad MCP (External Tools)", status: "backlog" as const },
    { id: "methodology", label: "Configuración de Metodología de Aprendizaje", status: "backlog" as const },
  ], []);

  const activeTask = useMemo(() => forgeTasks.find(t => t.id === activePhaseId) || forgeTasks[0], [activePhaseId]);

  if (!activeTask) return null;

  const executeAI = async () => {
    setIsGenerating(true); setAiOutput(null);
    const activeTemplate = FORGE_TEMPLATES[activeTask.label] || null;
    
    try {
      // Mocking AI response for demonstration - in real app, call /api/ai/generate
      const mockResponse = {
        explanation: `Sintesis Técnica para ${activeTask.label}:\n\n` + 
                    `- Recomendación: Gemini 1.5 Pro (2M context window)\n` +
                    `- Patrón AgentX: Nivel Etapa -> Plan -> Ejecución\n` +
                    `- Eficiencia: 62.1% reducción de tokens proyectada.\n` +
                    `- Riesgos: Baja latencia requerida para funciones FaaS.`,
        optimizedPrompt: `Actúa como un ${selectedAgent || 'Experto'}. Mi perfil es [PERFIL]. Mi stack es [STACK]. Configura mi ecosistema siguiendo el flujo agéntico [PATRON]...`,
        style: activeTemplate?.panelA_style || 'table'
      };

      setTimeout(() => {
        setAiOutput(mockResponse);
        setIterationSnapshots(prev => ({ ...prev, [activeTask.id]: mockResponse }));
        setIsGenerating(false);
        
        // PERSISTENCE & TUTORIAL UNLOCK
        localStorage.setItem('forge_identity_prompt', mockResponse.optimizedPrompt);
        localStorage.setItem('forge_identity_role', selectedAgent || 'Agentic Architect');
        setHasForgedIdentity(true);
      }, 2000);

    } catch (err) { console.error(err); setIsGenerating(false); }
  };

  return (
    <div className="w-full space-y-12 pb-20">
      
      {/* 1. TOP SECTION: METHODOLOGY (Adapted for Forge) */}
      <section className="animate-in fade-in slide-in-from-top duration-700">
        <MethodologyBoard 
          currentPhase="The Forge" 
          projectTasks={forgeTasks.map(t => t.id === activeTask.id ? { ...t, status: 'doing' } : (iterationSnapshots[t.id] ? { ...t, status: 'done' } : t))}
          activeTaskId={activeTask.id}
          onSelectIteration={(taskId) => {
            setSelectedIterationId(taskId);
          }}
          userProfile="profesional" 
        />
      </section>

      <div className="flex flex-col items-center gap-4 opacity-20">
        <ArrowDown className="w-6 h-6 animate-bounce text-amber-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Identity Synthesis Flow</span>
      </div>

      {/* 2. MIDDLE SECTION: REFINER & BUILDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* REFINER AREA */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-8 rounded-[3rem] border-amber-500/20 bg-amber-500/5 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <Hammer className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Forge: <span className="text-amber-500">{activeTask.label}</span></h3>
                  <p className="text-[10px] text-amber-500/40 font-bold uppercase tracking-widest px-1">Laboratorio de Identidad Agéntica</p>
                </div>
              </div>
              <div className="flex gap-2">
                {isTutorialMode && (
                  <button 
                    onClick={skipTutorial}
                    className="px-4 py-2 text-[8px] font-black uppercase rounded-lg border border-white/5 text-white/20 hover:text-amber-500 hover:border-amber-500/20 transition-all"
                  >
                    Saltar Tutorial (Seniors)
                  </button>
                )}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                  <button onClick={() => setActiveTab('config')} className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all", activeTab === 'config' ? "bg-amber-500/20 text-amber-500" : "text-white/30")}>Agente</button>
                  <button onClick={() => setActiveTab('build')} className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all", activeTab === 'build' ? "bg-amber-500/40 text-white" : "text-white/30")}>Perfil</button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'config' ? (
                <motion.div key="config" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FORGE_AGENTS.map(agent => (
                    <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={cn("p-5 rounded-3xl border-2 text-left transition-all", selectedAgent === agent.id ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10" : "bg-black/20 border-white/5 hover:border-white/10")}>
                      <div className="flex items-center gap-3 mb-2">
                        <agent.icon className={cn("w-5 h-5", selectedAgent === agent.id ? "text-amber-500" : "text-white/40")} />
                        <span className="text-sm font-black text-white uppercase">{agent.label}</span>
                      </div>
                      <p className="text-[10px] text-white/40 leading-relaxed">{agent.desc}</p>
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="build" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 w-full overflow-x-auto custom-scrollbar-hide">
                    {FORGE_PILLARS.map((p, idx) => (
                      <button key={p.id} onClick={() => setCurrentPillar(idx)} className={cn("flex-none flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", currentPillar === idx ? "bg-amber-500 text-black" : "text-white/40 hover:text-white/60")}>
                        <p.icon className="w-3.5 h-3.5" /> {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <textarea 
                      value={blocks[`${activeTask.id}-${FORGE_PILLARS[currentPillar]?.id}`] || ""}
                      onChange={(e) => setBlocks(prev => ({ ...prev, [`${activeTask.id}-${FORGE_PILLARS[currentPillar]?.id}`]: e.target.value }))}
                      className="relative w-full h-48 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-sm text-[#F3EFE0] resize-none focus:border-amber-500/40 focus:outline-none transition-all font-mono"
                      placeholder={`Define tu ${FORGE_PILLARS[currentPillar]?.label} para forjar tu perfil...`}
                    />
                  </div>
                  <button onClick={executeAI} disabled={isGenerating} className="w-full bg-amber-500 hover:bg-amber-600 py-6 rounded-3xl text-sm font-black text-black uppercase transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] flex items-center justify-center gap-4">
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Hammer className="w-5 h-5 fill-current" />}
                    {isGenerating ? "Forjando Identidad..." : "Finalizar y Generar Ecosistema"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TOKEN EFFICIENCY & ENERGY DASHBOARD WIDGET */}
          <div className="space-y-6">
            <AnimatePresence>
              {aiOutput && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-[3rem] bg-black/40 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-4 border-amber-500/10 border-t-amber-500 flex items-center justify-center relative">
                       <span className="text-2xl font-black text-amber-500 italic">62%</span>
                       <div className="absolute -top-1 -right-1 bg-amber-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce">SAVED</div>
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-white uppercase tracking-tighter">Eficiencia AgentX</h4>
                       <p className="text-xs text-white/40 leading-relaxed max-w-xs">Tu flujo agéntico ha sido optimizado. Estás ahorrando un <span className="text-amber-500 font-bold">62.1% en consumo de tokens</span> frente a flujos lineales.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-48">
                     <div className="flex justify-between text-[8px] font-black text-white/30 uppercase tracking-widest">
                        <span>Token Usage</span>
                        <span>Optimized</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: "100%" }} 
                          animate={{ width: "37.9%" }} 
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                        />
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NEW ENERGY DASHBOARD WIDGET */}
            <div className="p-8 rounded-[3rem] glass border-amber-500/10 bg-amber-500/5 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <BatteryMedium className="w-5 h-5 text-amber-500" />
                     </div>
                     <div>
                        <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Energía de la Fragua</h5>
                        <p className="text-[14px] font-black text-amber-500">{credits.toLocaleString()} / {TOKENOMICS_CONFIG.FREE_TIER_QUOTA.toLocaleString()}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">Capacidad Actual</span>
                     <span className="text-[10px] font-black text-white uppercase">{Math.round((credits / TOKENOMICS_CONFIG.FREE_TIER_QUOTA) * 100)}%</span>
                  </div>
               </div>

               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(credits / TOKENOMICS_CONFIG.FREE_TIER_QUOTA) * 100}%` }}
                    className="h-full bg-amber-500"
                  />
               </div>

               <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-4">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-[#D7D3C2]/60 leading-relaxed">
                    Estás usando la capa gratuita. Para obtener la capacidad total de 50,000 tokens de Gemini, vincula tu cuenta de <span className="text-amber-500 font-bold">La Bendita IA</span>.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[3rem] bg-[#050505] border border-amber-500/20 flex flex-col min-h-[350px] overflow-hidden">
             <div className="h-12 bg-black border-b border-amber-500/10 flex items-center px-6">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Mapa de Ecosistema</span>
             </div>
             <div className="flex-1 p-6 font-mono text-[11px] text-white/60 overflow-y-auto custom-scrollbar leading-relaxed">
                {selectedIterationId || aiOutput ? (
                  <div className={cn(
                    "h-full w-full p-6 rounded-lg",
                    (aiOutput?.style || 'table') === 'table' ? "bg-amber-500/5 border border-amber-500/20 text-amber-100" : ""
                  )}>
                    <pre className="whitespace-pre-wrap break-words text-amber-500/90">
                      {selectedIterationId ? iterationSnapshots[selectedIterationId]?.explanation : aiOutput?.explanation}
                    </pre>
                  </div>
                ) : (
                  <p className="opacity-20 italic">Forja un perfil para visualizar el mapa de habilidades agénticas.</p>
                )}
             </div>
          </div>
          <div className="glass rounded-[3rem] bg-[#050505] border border-orange-500/20 flex flex-col min-h-[350px] overflow-hidden relative">
             <div className="h-12 bg-black border-b border-orange-500/10 flex items-center justify-between px-6">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Prompt de Identidad</span>
                <button 
                  onClick={() => {
                    const text = selectedIterationId ? iterationSnapshots[selectedIterationId]?.optimizedPrompt : aiOutput?.optimizedPrompt;
                    if (text) navigator.clipboard.writeText(text);
                  }}
                  className="flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/40 px-3 py-1 rounded-lg text-[8px] font-black uppercase text-orange-500 transition-all border border-orange-500/30"
                >
                  <Copy className="w-3 h-3" /> Export to System
                </button>
             </div>
             <div className="flex-1 p-6 font-mono text-[11px] text-white/40 overflow-y-auto custom-scrollbar leading-relaxed italic">
                {selectedIterationId ? iterationSnapshots[selectedIterationId]?.optimizedPrompt : aiOutput?.optimizedPrompt || <p className="opacity-20">El prompt de sistema de tu socio agéntico aparecerá aquí.</p>}
             </div>
             {aiOutput && (
               <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                     <Rocket className="w-5 h-5 text-orange-500" />
                     <p className="text-[9px] font-medium text-orange-400">Listo para Custom Instructions en ChatGPT/Gemini.</p>
                  </div>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
