import React from "react";
import { ArrowLeft, Hammer, Wrench } from "lucide-react";
import Link from "next/link";
import ForgeWorkspace from "@/components/ForgeWorkspace";

interface ForgePageProps {
  params: Promise<{ id: string }>;
}

export default async function ForgePage({ params }: ForgePageProps) {
  const { id } = await params;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Link 
        href="/forge" 
        className="inline-flex items-center gap-2 text-sm text-[#D7D3C2]/50 hover:text-amber-500 transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Laboratorio
      </Link>

      <header className="relative p-12 glass rounded-[3rem] overflow-hidden border-amber-500/20 bg-amber-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] -z-10" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Wrench className="w-3 h-3" /> Area de Forja Activa
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <h1 className="font-display text-5xl font-black text-white mb-6 tracking-tighter uppercase">
          Configuración <span className="text-amber-500">Agéntica</span>
        </h1>
        <p className="text-xl text-[#D7D3C2]/70 max-w-2xl leading-relaxed">
          Estás en el área de construcción técnica. Refina tu perfil, selecciona tus herramientas y genera el prompt maestro de tu ecosistema personal.
        </p>
      </header>

      <section className="pt-10 border-t border-white/5">
        <ForgeWorkspace activePhaseId={id} />
      </section>
    </div>
  );
}
