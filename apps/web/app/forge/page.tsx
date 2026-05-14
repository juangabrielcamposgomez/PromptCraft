"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, Hammer, Sparkles, User, Cpu, Workflow, Terminal, BookOpen,
  Settings, BrainCircuit, Rocket, LayoutGrid, Activity,
  ArrowUpRight, ShieldCheck, Zap
} from "lucide-react";
import Link from "next/link";

const FORGE_CARDS = [
  { id: "stack", name: "Stack Personal", desc: "Define tus herramientas y modelos de IA (Gemini vs GPT-4).", icon: Cpu, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "flow", name: "Flujo Agéntico", desc: "Diseña patrones AgentX y optimiza el consumo de tokens.", icon: Workflow, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "mcp", name: "Conectividad MCP", desc: "Conecta APIs y bases de datos con funciones FaaS.", icon: Terminal, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "methodology", name: "Metodología", desc: "Crea tu propio Scrum personal de aprendizaje.", icon: BookOpen, color: "text-red-500", bg: "bg-red-500/10" },
];

export default function ForgeDashboard() {
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem('forge_welcome_seen')) {
      setShowTooltip(true);
    }
  }, []);

  const dismissTooltip = () => {
    localStorage.setItem('forge_welcome_seen', 'true');
    setShowTooltip(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute top-40 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm"
          >
            <div className="glass p-6 rounded-[2rem] border-amber-500 bg-black/90 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center space-y-4">
               <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 mx-auto">
                  <Sparkles className="w-6 h-6 text-amber-500" />
               </div>
               <h4 className="text-lg font-black text-white uppercase tracking-tighter">¡Aquí empieza todo!</h4>
               <p className="text-xs text-[#D7D3C2]/70 leading-relaxed">Forja tu identidad primero para que la IA te reconozca en todas las fases del SDLC.</p>
               <button 
                 onClick={dismissTooltip}
                 className="w-full py-3 rounded-xl bg-amber-500 text-black text-[10px] font-black uppercase hover:bg-amber-400 transition-all"
               >
                 Entendido, Smith
               </button>
            </div>
            <div className="w-4 h-4 bg-black border-r border-b border-amber-500 rotate-45 mx-auto -mt-2" />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative p-12 glass rounded-[3rem] overflow-hidden border-amber-500/20 bg-amber-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] -z-10" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500/10 blur-[100px] -z-10" />

        <div className="flex items-center gap-4 mb-6">
          <div className="px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Hammer className="w-3 h-3" /> The Forge Laboratory
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <h1 className="font-display text-6xl font-black text-white mb-6 tracking-tighter">
          The <span className="text-amber-500">Forge</span>
        </h1>
        <p className="text-xl text-[#D7D3C2]/70 max-w-2xl leading-relaxed">
          Construye tu identidad profesional agéntica. Define tu stack, diseña tus flujos de trabajo y conecta tu ecosistema personal de IA.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FORGE_CARDS.map((card) => (
          <Link
            key={card.id}
            href={`/forge/${card.id}`}
            className="group relative h-64 glass p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between transition-all duration-500 hover:border-amber-500/40 hover:scale-[1.02] overflow-hidden bg-black/20"
          >
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${card.bg} blur-[80px] group-hover:opacity-100 opacity-50 transition-all duration-700`} />
            
            <div className="flex justify-between items-start">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-amber-500/20 transition-all duration-300`}>
                <card.icon className={`w-7 h-7 ${card.color} group-hover:scale-110 transition-transform`} />
              </div>
              <ArrowUpRight className="w-6 h-6 text-[#D7D3C2]/30 group-hover:text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
                {card.name}
              </h3>
              <p className="text-sm text-[#D7D3C2]/50 leading-relaxed">
                {card.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-8 rounded-[3rem] bg-amber-500/5 border border-amber-500/10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 rounded-[2rem] bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
          <Zap className="w-10 h-10 text-amber-500 animate-pulse" />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h4 className="text-lg font-bold text-white">¿Listo para forjar tu Socio Agéntico?</h4>
          <p className="text-sm text-[#D7D3C2]/60">Cada hito completado en The Forge te acerca a un ecosistema personal automatizado y eficiente.</p>
        </div>
        <button className="px-8 py-4 rounded-2xl bg-amber-500 text-black font-black uppercase text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">Empezar Construcción</button>
      </div>
    </div>
  );
}
