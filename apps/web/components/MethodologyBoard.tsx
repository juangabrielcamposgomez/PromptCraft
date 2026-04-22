"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Clock, PlayCircle, History, Info, Zap, Target, 
  ArrowRight, MoreVertical, Trophy, Calendar, Activity, Sparkles,
  BarChart3, Layout, ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

type Method = "kanban" | "scrum";

interface Task {
  id: string;
  label: string;
  status: "backlog" | "doing" | "done";
  points?: number;
  timestamp?: string;
}

interface MethodologyBoardProps {
  currentPhase: string;
  projectTasks: Task[];
  activeTaskId: string;
  onSelectIteration: (taskId: string) => void;
  userProfile: "aprendiz" | "profesional";
}

export default function MethodologyBoard({ 
  currentPhase, 
  projectTasks, 
  activeTaskId,
  onSelectIteration,
  userProfile
}: MethodologyBoardProps) {
  const [method, setMethod] = useState<Method>(userProfile === "aprendiz" ? "scrum" : "kanban");

  const stats = useMemo(() => {
    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.status === 'done').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const pointsDone = projectTasks.filter(t => t.status === 'done').length * 5;
    const pointsTotal = total * 5;
    return { total, completed, percent, pointsDone, pointsTotal };
  }, [projectTasks]);

  const columns = {
    backlog: projectTasks.filter(t => t.status === 'backlog' && t.id !== activeTaskId),
    doing: projectTasks.filter(t => t.id === activeTaskId),
    done: projectTasks.filter(t => t.status === 'done')
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1. METHODOLOGY SELECTOR & HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className={cn(
            "px-5 py-2 rounded-2xl border flex items-center gap-3 transition-all",
            method === "scrum" ? "bg-primary/10 border-primary/30" : "bg-accent/10 border-accent/30"
          )}>
            {method === "scrum" ? <Calendar className="w-4 h-4 text-primary" /> : <Layout className="w-4 h-4 text-accent" />}
            <div>
              <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">{method === "scrum" ? "Active Sprint" : "Continuous Flow"}</p>
              <h4 className="text-xs font-black text-white uppercase tracking-tighter">
                {method === "scrum" ? `Sprint 1: ${currentPhase}` : `${currentPhase} Workflow`}
              </h4>
            </div>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            <button onClick={() => setMethod('kanban')} className={cn("px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all", method === 'kanban' ? "bg-accent text-black shadow-lg" : "text-white/30")}>Kanban</button>
            <button onClick={() => setMethod('scrum')} className={cn("px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all", method === 'scrum' ? "bg-primary text-black shadow-lg" : "text-white/30")}>Scrum</button>
          </div>
        </div>

        {method === "scrum" && (
          <div className="flex items-center gap-6 bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
            <div className="text-center">
               <p className="text-[14px] font-black text-primary">{stats.pointsDone}/{stats.pointsTotal}</p>
               <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Story Points</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
               <p className="text-[14px] font-black text-white">{stats.percent}%</p>
               <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Velocity</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. SPRINT GOAL / KANBAN INFO */}
      <AnimatePresence mode="wait">
        {method === "scrum" && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="glass p-4 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-center justify-between mx-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] font-black text-primary uppercase">Sprint Goal</p>
                <p className="text-xs text-white/80 font-medium italic">"Completar la iteración de ingeniería para {currentPhase} con éxito técnico."</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end">
               <p className="text-[9px] font-black text-white/20 uppercase">Daily Stand-up</p>
               <p className="text-[10px] text-primary/60 font-bold">Asistente listo para reporte</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HORIZONTAL BOARD */}
      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-4 md:pb-0 snap-x snap-mandatory scroll-p-2">
        
        {/* COLUMN 1: SPRINT BACKLOG / TODO */}
        <div className="flex-none w-[85vw] md:w-auto snap-center glass rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-white/20" />
              <h5 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{method === "scrum" ? "Sprint Backlog" : "Backlog"}</h5>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/5 text-white/30">{columns.backlog.length}</span>
          </div>
          <div className="space-y-3">
            {columns.backlog.map(task => (
              <div key={task.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 opacity-40 grayscale flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/60">{task.label}</span>
                {method === "scrum" && <span className="text-[8px] font-black text-white/20">5 SP</span>}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS (ACTIVE) */}
        <div className={cn(
          "flex-none w-[85vw] md:w-auto snap-center glass rounded-[2.5rem] p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-500",
          method === "scrum" ? "bg-primary/5 border-2 border-primary/20" : "bg-accent/5 border-2 border-accent/20"
        )}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -z-10" />
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Activity className={cn("w-4 h-4 animate-pulse", method === "scrum" ? "text-primary" : "text-accent")} />
              <h5 className={cn("text-[11px] font-black uppercase tracking-[0.2em]", method === "scrum" ? "text-primary" : "text-accent")}>In Progress</h5>
            </div>
          </div>
          <div className="space-y-4">
            {columns.doing.map(task => (
              <motion.div 
                key={task.id} 
                layoutId="active-task"
                className="p-5 rounded-[2rem] bg-black/60 border border-white/10 shadow-2xl relative group"
              >
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <div className={cn("w-1.5 h-1.5 rounded-full animate-ping", method === "scrum" ? "bg-primary" : "bg-accent")} />
                     <span className="text-[9px] font-black text-white/40 uppercase">Active Task</span>
                   </div>
                   {method === "scrum" && <span className="text-[9px] font-black text-primary tracking-widest">5 STORY POINTS</span>}
                </div>
                <span className="text-sm font-black text-white block mb-2">{task.label}</span>
                <p className="text-[10px] text-white/40 leading-relaxed">Trabajando en el incremento técnico de {currentPhase}.</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Zap className={cn("w-4 h-4", method === "scrum" ? "text-primary" : "text-accent")} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: DONE (INCREMENTS) */}
        <div className="flex-none w-[85vw] md:w-auto snap-center glass rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h5 className="text-[11px] font-black text-amber-400 uppercase tracking-[0.2em]">{method === "scrum" ? "Done / Increment" : "History"}</h5>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400">{columns.done.length}</span>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            {columns.done.map(task => (
              <motion.button 
                key={task.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectIteration(task.id)}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center justify-between group transition-all hover:bg-white/10"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-white/90 group-hover:text-primary transition-colors">{task.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-white/20 uppercase font-black tracking-tighter">Sprint Artifact</span>
                    <ChevronRight className="w-2 h-2 text-white/10" />
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-primary opacity-40 group-hover:opacity-100 transition-all" />
              </motion.button>
            ))}
            {columns.done.length === 0 && (
               <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-20">
                 <Sparkles className="w-8 h-8 mb-2" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Ready to build the sprint increment</p>
               </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. SCRUM DAILY COACH (BOTTM BAR) */}
      <div className="p-6 rounded-[2.5rem] bg-black/40 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] -z-10" />
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
            <BarChart3 className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Sprint Assistant Reporting</p>
            <p className="text-xs text-[#D7D3C2]/80 leading-relaxed font-medium">
               {stats.percent === 0 
                 ? `Bienvenido al Sprint de ${currentPhase}. Tu objetivo es completar los ${stats.pointsTotal} puntos de historia. Empieza con la primera tarea del Backlog.`
                 : stats.percent >= 100
                   ? `¡Sprint Goal alcanzado! Has entregado el incremento completo. Prepara la Review para la siguiente fase.`
                   : `Progreso estable. Llevas ${stats.pointsDone} SP completados. Según tu ritmo, el incremento de ${currentPhase} estará listo pronto.`}
            </p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">Daily Report</button>
        </div>
      </div>

    </div>
  );
}
