"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Info, Sparkles, BrainCircuit, 
  ChevronRight, X, UserCheck, ShieldCheck, Target
} from "lucide-react";
import { useTutorial } from "../context/TutorialContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export default function TutorialSystem() {
  const { isTutorialMode, hasForgedIdentity, unlockedPhaseIndex, skipTutorial } = useTutorial();
  const [showChecklist, setShowChecklist] = useState(true);

  if (!isTutorialMode) return null;

  const steps = [
    { label: "Forjar Identidad", completed: hasForgedIdentity, current: !hasForgedIdentity },
    { label: "Definir Requerimientos", completed: unlockedPhaseIndex > 0, current: hasForgedIdentity && unlockedPhaseIndex === 0 },
    { label: "Análisis de Viabilidad", completed: unlockedPhaseIndex > 1, current: unlockedPhaseIndex === 1 },
    { label: "Modelado de Datos", completed: unlockedPhaseIndex > 2, current: unlockedPhaseIndex === 2 },
  ];

  return (
    <>
      {/* FOCUS OVERLAY (Optional - only when needed) */}
      {!hasForgedIdentity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 pointer-events-none" />
      )}

      {/* FLOATING CHECKLIST */}
      <AnimatePresence>
        {showChecklist && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-24 right-8 z-[60] w-64 glass rounded-[2.5rem] border-amber-500/20 bg-black/90 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Plan de Aprendiz</span>
              </div>
              <button onClick={() => setShowChecklist(false)} className="text-white/20 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className={cn(
                  "flex items-center gap-3 transition-all duration-500",
                  step.completed ? "opacity-100" : step.current ? "opacity-100 scale-105" : "opacity-30"
                )}>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  ) : step.current ? (
                    <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/20" />
                  )}
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tight",
                    step.completed ? "text-amber-500/60 line-through" : step.current ? "text-white" : "text-white/40"
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* FELIPE PACHECO GUIDANCE */}
            <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <BrainCircuit className="w-12 h-12 text-amber-500" />
               </div>
               <p className="text-[9px] font-medium text-amber-500/80 mb-2 uppercase tracking-widest">Felipe Pacheco dice:</p>
               <p className="text-[10px] text-[#D7D3C2]/80 leading-relaxed italic">
                 {!hasForgedIdentity 
                   ? "¡Un buen ingeniero empieza aquí! Elige tu patrón AgentX en la Fragua." 
                   : "Excelente. Ahora vamos a los Requerimientos para asentar las bases."}
               </p>
            </div>

            <button 
              onClick={skipTutorial}
              className="w-full mt-6 py-2 rounded-xl border border-white/5 text-[8px] font-black uppercase text-white/20 hover:text-white hover:bg-white/5 transition-all"
            >
              Saltar Tutorial
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RE-OPEN TRIGGER */}
      {!showChecklist && (
        <button 
          onClick={() => setShowChecklist(true)}
          className="fixed top-24 right-8 z-[60] w-10 h-10 rounded-full glass border-amber-500/20 bg-black/90 flex items-center justify-center text-amber-500 shadow-xl"
        >
          <Target className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
