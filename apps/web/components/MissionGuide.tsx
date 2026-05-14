"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, X, ChevronDown, Hammer, Wrench, Rocket, 
  ShieldCheck, Kanban, Sparkles, BrainCircuit, Target, Info
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const GUIDE_SECTIONS = [
  {
    id: "forge",
    title: "Fase 1: La Fragua (The Forge)",
    icon: Hammer,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    content: [
      "Define tu Rol: Arquitecto, Desarrollador o Auditor.",
      "Configura tu Stack: Elige tus herramientas y modelos de IA.",
      "Elige tu Patrón: Selecciona AgentX para ahorrar un 62% de tokens.",
      "Forja: Crea tu Identidad Persistente que te seguirá al SDLC.",
      "Tip Pro: Exporta tu prompt a ChatGPT/Gemini con un clic."
    ]
  },
  {
    id: "sdlc",
    title: "Fase 2: Ciclo de Vida (SDLC)",
    icon: Rocket,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    content: [
      "14 Pilares: Desde Requerimientos hasta Seguridad Snyk.",
      "Modelado IA: Genera esquemas ER y diccionarios validados.",
      "Sinergia Forjada: Si creaste un perfil, verás 'Forged Identity Active'.",
      "Seguridad: Pasa el scanner OWASP antes del despliegue final."
    ]
  },
  {
    id: "agile",
    title: "Fase 3: Gestión Ágil",
    icon: Kanban,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    content: [
      "Kanban: Las tarjetas se mueven a 'Hecho' automáticamente.",
      "Scrum: Trabaja por objetivos y usa el Daily Coach.",
      "Snapshot History: Audita cada versión de tus prompts."
    ]
  }
];

export default function MissionGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("forge");

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center hover:scale-110 transition-all z-[60] group"
      >
        <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-12 right-0 bg-black/80 backdrop-blur-md text-amber-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-amber-500/20 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
          GUÍA DE MISIÓN
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-[#0A0A0A] border-l border-amber-500/20 shadow-[ -20px_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden rounded-[2.5rem] md:rounded-r-none"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 bg-amber-500/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <Target className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-black text-white uppercase tracking-tighter">Guía de <span className="text-amber-500">Misión</span></h2>
                    <p className="text-[10px] font-bold text-amber-500/40 uppercase tracking-[0.2em]">Onboarding Interactivo</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 mb-4">
                  <Sparkles className="w-8 h-8 text-amber-500 shrink-0" />
                  <p className="text-xs text-[#D7D3C2]/80 leading-relaxed italic">
                    "Bienvenido, Ingeniero. Tu viaje comienza en la Fragua y culmina en un software blindado. Sigue estos pasos para dominar el ecosistema."
                  </p>
                </div>

                {GUIDE_SECTIONS.map((section) => (
                  <div 
                    key={section.id}
                    className={cn(
                      "rounded-[2rem] border transition-all duration-300 overflow-hidden",
                      openSection === section.id ? "bg-white/5 border-white/10" : "bg-black border-white/5 hover:border-white/10"
                    )}
                  >
                    <button 
                      onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                      className="w-full p-6 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-white/5", section.bg)}>
                          <section.icon className={cn("w-5 h-5", section.color)} />
                        </div>
                        <h3 className="font-bold text-white text-sm uppercase tracking-tight">{section.title}</h3>
                      </div>
                      <ChevronDown className={cn("w-5 h-5 text-white/20 transition-transform duration-300", openSection === section.id && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {openSection === section.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="space-y-3 pl-14">
                            {section.content.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <p className="text-xs text-[#D7D3C2]/60 leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/5 bg-black/40">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                   <BrainCircuit className="w-6 h-6 text-amber-500" />
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-white uppercase mb-1">Status de Sistema</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full w-2/3 bg-amber-500" />
                        </div>
                        <span className="text-[8px] font-bold text-amber-500">62% Optimized</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
