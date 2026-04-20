import { prisma } from "@devflow/core";
import React from "react";
import { 
  ArrowUpRight, 
  Layers, 
  Monitor, 
  Terminal, 
  Database as DbIcon,
  Search
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = {
  "Requerimientos": Search,
  "Análisis": Layers,
  "Modelado de Base de Datos": DbIcon,
  "Diseño de Interfaz": Monitor,
  "Implementación": Terminal,
  "Producción/Despliegue": Terminal,
};

export default async function DashboardPage(): Promise<React.ReactNode> {
  const phases = await prisma.sdlcPhase.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="space-y-10">
      <header>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white mb-2">
          Dashboard <span className="text-primary italic">Academy</span>
        </h2>
        <p className="text-[#D7D3C2] opacity-60 text-lg max-w-xl">
          Selecciona una fase del ciclo de vida para explorar plantillas de prompts optimizadas para IA.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase: any) => {
          const Icon = iconMap[phase.name] || Terminal;
          return (
            <Link
              key={phase.id}
              href={`/phase/${phase.id}`}
              className="group relative h-64 glass p-8 rounded-[2rem] flex flex-col justify-between transition-all duration-500 hover:border-primary/40 hover:scale-[1.02] overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[80px] group-hover:bg-primary/40 transition-all duration-700" />
              
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-[#D7D3C2]/30 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-2 leading-tight">
                  {phase.name}
                </h3>
                <p className="text-sm text-[#D7D3C2]/50 line-clamp-2 leading-relaxed">
                  {phase.description || "Explora las mejores prácticas de IA para esta fase del desarrollo."}
                </p>
              </div>

              {/* Step indicator */}
              <div className="absolute top-8 right-8 text-[60px] font-display font-black text-white/5 select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                {phase.orderIndex.toString().padStart(2, '0')}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
