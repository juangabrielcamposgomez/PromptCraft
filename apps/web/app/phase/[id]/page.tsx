import { prisma } from "@devflow/core";
import { 
  ArrowLeft, 
  ChevronRight, 
  Box, 
  Zap, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import PromptRefiner from "@/components/PromptRefiner";

interface PhasePageProps {
  params: Promise<{ id: string }>;
}

export default async function PhaseDetailPage({ params }: PhasePageProps): Promise<React.ReactNode> {
  const { id } = await params;

  const phase = await prisma.sdlcPhase.findUnique({
    where: { id },
    include: {
      categories: {
        orderBy: { name: 'asc' }
      }
    }
  });

  if (!phase) {
    notFound();
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-[#D7D3C2]/50 hover:text-primary transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Dashboard
      </Link>

      <header className="relative p-12 glass rounded-[3rem] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 blur-[100px] -z-10" />

        <div className="flex items-center gap-4 mb-6">
          <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            Fase {phase.orderIndex}
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <h1 className="font-display text-5xl font-black text-white mb-6 tracking-tighter">
          {phase.name}
        </h1>
        <p className="text-xl text-[#D7D3C2]/70 max-w-2xl leading-relaxed">
          {phase.description}
        </p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
            <Box className="w-6 h-6 text-accent" />
            Categorías Disponibles
          </h2>
          <span className="text-xs text-[#D7D3C2]/30 font-medium uppercase tracking-widest">
            {phase.categories.length} Resultados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phase.categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`}
              className="group p-6 glass rounded-2xl flex items-center justify-between transition-all duration-300 hover:bg-white/5 hover:border-white/20 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <Zap className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#D7D3C2]/40 mt-0.5">
                    Plantillas de prompts especializadas
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </Link>
          ))}

          {phase.categories.length === 0 && (
            <div className="col-span-full py-20 glass rounded-[2rem] flex flex-col items-center justify-center text-center">
              <Sparkles className="w-12 h-12 text-accent/20 mb-4" />
              <p className="text-[#D7D3C2]/40 font-medium">No hay categorías asignadas a esta fase todavía.</p>
            </div>
          )}
        </div>
      </section>

      <section className="pt-10 border-t border-white/5">
        <div className="mb-8 px-4">
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            PromptRefiner: Professional AI Optimizer
          </h2>
          <p className="text-sm text-[#D7D3C2]/50 mt-1">
            Optimiza tu prompt con ingeniería de 7 pasos y recibe una explicación técnica experta.
          </p>
        </div>
        <PromptRefiner phase={phase} />
      </section>
    </div>
  );
}
