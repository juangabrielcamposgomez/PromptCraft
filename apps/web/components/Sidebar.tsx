"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Briefcase, Code, Palette, Workflow, Cpu, Database, Terminal as TerminalIcon, 
  BrainCircuit, LayoutGrid, Settings, HelpCircle, LogOut, LucideIcon, 
  Sparkles, ShieldCheck, Lock, ChevronRight, ClipboardList, Search, 
  Layout as LayoutIcon, Code2, ShieldAlert, Rocket, Wrench, User, BookOpen,
  Zap, Battery, BatteryMedium, BatteryFull, BatteryWarning
} from "lucide-react";
import { useTutorial } from "../context/TutorialContext";
import { useTokenomics } from "../context/TokenomicsContext";
import { TOKENOMICS_CONFIG } from "../lib/tokenomics.config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const iconMap: Record<string, any> = {
  "Requerimientos": ClipboardList,
  "Análisis": Search,
  "Modelado de Base de Datos": Database,
  "Diseño de Interfaz": LayoutIcon,
  "Implementación": Code2,
  "Producción/Despliegue": Rocket,
  "QA & Testing": ShieldCheck,
  "OWASP / Seguridad": ShieldAlert,
};

const FORGE_PHASES = [
  { id: "stack", name: "Stack Personal", icon: Cpu },
  { id: "flow", name: "Flujo Agéntico", icon: Workflow },
  { id: "mcp", name: "Conectividad MCP", icon: TerminalIcon },
  { id: "methodology", name: "Metodología", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [phases, setPhases] = useState<any[]>([]);
  const isForge = pathname.startsWith("/forge");
  const isAdminView = pathname.startsWith("/admin");
  const { isTutorialMode, unlockedPhaseIndex, hasForgedIdentity } = useTutorial();
  const { credits } = useTokenomics();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("user_role") === "ORIUNDO_ADMIN");
    if (!isForge && !isAdminView) {
      fetch("/api/phases")
        .then(res => res.json())
        .then(data => setPhases(data))
        .catch(() => {
          setPhases([
            { id: "1", name: "Requerimientos" },
            { id: "2", name: "Análisis" },
            { id: "3", name: "Modelado de Base de Datos" },
            { id: "4", name: "Diseño de Interfaz" },
            { id: "5", name: "Implementación" },
            { id: "6", name: "Producción/Despliegue" },
            { id: "7", name: "QA & Testing" },
            { id: "8", name: "OWASP / Seguridad" },
          ]);
        });
    }
  }, [isForge]);

  const creditPercent = (credits / TOKENOMICS_CONFIG.FREE_TIER_QUOTA) * 100;
  const isLowEnergy = creditPercent < 20;

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-72 glass border-r flex flex-col p-6 z-50 transition-all duration-500",
      isForge ? "border-amber-500/20 shadow-[4px_0_24px_rgba(245,158,11,0.05)]" : "border-white/5"
    )}>
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
            isForge ? "bg-amber-500 text-black rotate-12" : "bg-primary text-black"
          )}>
            {isForge ? <Wrench className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tighter">
            Prompt<span className={isForge ? "text-amber-500" : "text-primary"}>Craft</span>
          </h1>
        </div>
        <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest px-1">
          {isForge ? "The Forge Laboratory" : "Academy SDLC"}
        </p>
      </div>

      {/* MODE SWITCHER */}
      <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-8">
        <Link href="/" className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase rounded-xl transition-all", !isForge ? "bg-primary text-black shadow-lg" : "text-white/30 hover:text-white/60")}>
          <Briefcase className="w-3 h-3" /> SDLC
        </Link>
        <Link href="/forge" className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase rounded-xl transition-all", isForge ? "bg-amber-500 text-black shadow-lg" : "text-white/30 hover:text-white/60")}>
          <Wrench className="w-3 h-3" /> The Forge
        </Link>
      </div>

      {/* ENERGY BAR (Tokenomics) */}
      <div className="mb-8 px-2 space-y-3">
        <div className="flex justify-between items-end px-1">
          <div className="flex items-center gap-2">
            {isLowEnergy ? <BatteryWarning className="w-3 h-3 text-red-500 animate-pulse" /> : <BatteryMedium className="w-3 h-3 text-amber-500" />}
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Energía Fragua</span>
          </div>
          <span className={cn("text-[10px] font-black", isLowEnergy ? "text-red-500" : "text-amber-500")}>
            {credits.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px] relative">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: `${creditPercent}%` }}
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isLowEnergy ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            )} 
          />
        </div>
        {isLowEnergy && (
          <p className="text-[8px] font-bold text-red-500/60 uppercase animate-pulse px-1">
            ⚠️ Energía Crítica. Optimiza con AgentX.
          </p>
        )}
      </div>

      {/* GLOBAL PROGRESS BAR */}
      <div className="mb-8 px-2 space-y-3">
        <div className="flex justify-between items-end px-1">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Estado de Misión</span>
          <span className={cn("text-xs font-black", isForge ? "text-amber-500" : "text-primary")}>14 Pilares</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000", isForge ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-primary shadow-[0_0_10px_rgba(0,166,126,0.5)]")} 
            style={{ width: "45%" }} 
          />
        </div>
        <div className="flex justify-between px-1">
          <span className="text-[8px] font-bold text-white/20 uppercase italic">Engineering Mastery</span>
          <span className="text-[8px] font-black text-white/40">45%</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
        {isForge ? (
          FORGE_PHASES.map((phase) => (
            <Link 
              key={phase.id} 
              href={`/forge/${phase.id}`} 
              className={cn(
                "group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300", 
                pathname === `/forge/${phase.id}` ? "bg-amber-500/10 text-amber-500" : "hover:bg-white/5 text-[#D7D3C2] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <phase.icon className={cn("w-5 h-5 transition-transform duration-300", pathname === `/forge/${phase.id}` ? "text-amber-500" : "text-amber-500/40 group-hover:scale-110")} />
                <span className="text-sm font-medium tracking-tight">{phase.name}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-all duration-300", pathname === `/forge/${phase.id}` ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2")} />
            </Link>
          ))
        ) : (
          phases.map((phase: any, index: number) => {
            const Icon = iconMap[phase.name] || ClipboardList;
            const isLocked = isTutorialMode && !hasForgedIdentity;
            const isPhaseLocked = isTutorialMode && index > unlockedPhaseIndex;
            const href = `/phase/${phase.id}`;
            const isActive = pathname === href;

            return (
              <div key={phase.id} className="relative group">
                <Link 
                  href={isLocked || isPhaseLocked ? "#" : href} 
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300", 
                    isActive ? "bg-primary/10 text-primary" : (isLocked || isPhaseLocked) ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-white/5 text-[#D7D3C2] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "text-primary" : "text-accent group-hover:scale-110")} />
                    <span className="text-sm font-medium tracking-tight">{phase.name}</span>
                  </div>
                  {isLocked || isPhaseLocked ? (
                    <Lock className="w-4 h-4 opacity-50" />
                  ) : (
                    <ChevronRight className={cn("w-4 h-4 transition-all duration-300", isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2")} />
                  )}
                </Link>
              </div>
            );
          })
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-500", 
          isForge ? "bg-amber-500/5 border-amber-500/20" : "bg-primary/5 border-primary/10"
        )}>
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg", 
            isForge ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-black shadow-primary/20"
          )}>
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate">Oriundo Startup</span>
            <span className={cn(
              "text-[10px] font-display uppercase tracking-wider", 
              isForge ? "text-amber-500" : "text-primary"
            )}>
              {isForge ? "The Master Smith" : "Profesor"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
