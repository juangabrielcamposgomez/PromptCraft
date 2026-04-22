import { prisma } from "@devflow/core";
import React from "react";
import { 
  ClipboardList, 
  Search, 
  Database, 
  Layout as LayoutIcon, 
  Code2, 
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Rocket
} from "lucide-react";
import Link from "next/link";

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

export const dynamic = "force-dynamic";

export default async function Sidebar(): Promise<React.ReactNode> {
  const phases = await prisma.sdlcPhase.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 glass border-r border-white/5 hidden lg:flex flex-col p-6 z-50">
      <div className="mb-10 px-2">
        <h1 className="font-display text-2xl font-bold text-primary tracking-tighter">
          PromptCraft
        </h1>
        <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest mt-1">
          Academy SDLC
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {phases.map((phase: any) => {
          const Icon = iconMap[phase.name] || ClipboardList;
          return (
            <Link
              key={phase.id}
              href={`/phase/${phase.id}`}
              className="group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 hover:bg-white/5 text-[#D7D3C2] hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium tracking-tight tracking-tight">{phase.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate">Oriundo Startup</span>
            <span className="text-[10px] opacity-70 font-display uppercase tracking-wider text-primary">Profesor</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
