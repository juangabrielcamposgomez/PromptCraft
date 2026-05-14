"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, Zap, Database, Activity, 
  AlertTriangle, ShieldCheck, Server, Globe, 
  ArrowUpRight, TrendingUp, Cpu
} from "lucide-react";
import { TOKENOMICS_CONFIG } from "../lib/tokenomics.config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState({
    totalConsumption: 1850000,
    serverCapacity: 2500000,
    activeUsers24h: 142,
    globalBurnRate: 12500,
    rdsLatency: 24,
    rdsSsl: true,
    communityEfficiency: 62.1
  });

  const consumptionPercent = (metrics.totalConsumption / metrics.serverCapacity) * 100;
  const isOverThreshold = consumptionPercent > 80;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Executive <span className="text-amber-500">Command Center</span></h2>
          </div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
            <Globe className="w-3 h-3" /> Technical Supervision: Oriundo Startup Chile
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">AWS RDS Status: Synchronized</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-500 text-black flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Usuarios Activos (24h)", value: metrics.activeUsers24h, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Quema Global (Credits/h)", value: metrics.globalBurnRate.toLocaleString(), icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Latencia RDS", value: `${metrics.rdsLatency}ms`, icon: Database, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Eficiencia AgentX", value: `${metrics.communityEfficiency}%`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" }
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[2rem] border-white/5 bg-white/2 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-3 rounded-2xl border border-white/5", m.bg)}>
                <m.icon className={cn("w-5 h-5", m.color)} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/20" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{m.label}</h4>
              <p className="text-2xl font-black text-white tracking-tighter">{m.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CONSUMPTION VS CAPACITY CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass p-10 rounded-[3rem] border-white/5 bg-white/2 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Consumo de Comunidad vs. Capacidad</h3>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Monitoreo de Infraestructura Escalable</p>
            </div>
            {isOverThreshold && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Alerta de Cuota: +80%</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-4xl font-black text-white">{Math.round(consumptionPercent)}%</span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-3">Utilización Total</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Capacidad Mensual Contratada</p>
                <p className="text-sm font-black text-white">{(metrics.serverCapacity / 1000000).toFixed(1)}M Tokens</p>
              </div>
            </div>

            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${consumptionPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full transition-colors duration-500",
                  isOverThreshold ? "bg-gradient-to-r from-red-600 to-orange-500" : "bg-gradient-to-r from-amber-600 to-amber-400"
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Gemini Pro 1.5</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "65%" }} />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Claude 3.5 Sonnet</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: "42%" }} />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">GPT-4o Mini</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "28%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SERVER HEALTH */}
        <div className="lg:col-span-4 glass p-8 rounded-[3rem] border-white/5 bg-white/2 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-500" /> Server Health
            </h3>
            
            <div className="space-y-4">
              {[
                { label: "SSL Certification", status: "Active", icon: ShieldCheck, color: "text-green-500" },
                { label: "RDS Connection", status: "Stable", icon: Database, color: "text-green-500" },
                { label: "AI Gateway", status: "Operational", icon: Cpu, color: "text-green-500" },
                { label: "Global Sync", status: "Synced", icon: Activity, color: "text-amber-500" }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <s.icon className={cn("w-4 h-4", s.color)} />
                    <span className="text-[10px] font-bold text-white/60 uppercase">{s.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-white uppercase">{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-[9px] text-[#D7D3C2]/60 leading-relaxed italic">
              "El ecosistema de PromptCraft Academy está operando dentro de los márgenes de seguridad. Sincronía total con AWS RDS."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
