"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Zap, Activity, Globe } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export default function SpecialGreeting() {
  const [show, setShow] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role === "ORIUNDO_ADMIN") {
      setIsAdmin(true);
      // Show greeting only once per session or after login
      const greeted = sessionStorage.getItem("admin_greeted");
      if (!greeted) {
        setShow(true);
        sessionStorage.setItem("admin_greeted", "true");
      }
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[500px]"
        >
          <div className="glass p-8 rounded-[2.5rem] border-amber-500/40 bg-black/95 shadow-[0_20px_50px_rgba(245,158,11,0.2)] relative overflow-hidden">
            {/* AMBIENT GLOW */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full" />
            
            <div className="flex items-start justify-between mb-6 relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Admin <span className="text-amber-500 underline decoration-2 underline-offset-4">Authenticated</span></h3>
                  <p className="text-[9px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">Estado: 🟢 SISTEMA DE ADMINISTRACIÓN ACTIVADO</p>
                </div>
              </div>
              <button onClick={() => setShow(false)} className="text-white/20 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 relative">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm text-[#D7D3C2] leading-relaxed">
                  "Bienvenido, Administrador de Oriundo. 🎩 El ecosistema de <span className="text-white font-bold">PromptCraft Academy</span> está bajo tu control. La comunidad de <span className="text-amber-500 font-bold">La Bendita IA</span> está operando dentro de los márgenes de seguridad. Todos los pilares del SDLC y la Fragua reportan sincronía total con AWS RDS."
                </p>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-green-500" />
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Global Sync: Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-amber-500" />
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Supervisor: Oriundo Startup Chile</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                   <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                   <span className="text-[10px] font-black text-amber-500">BYPASS ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
