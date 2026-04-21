import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { phaseId, phaseName, blocks } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key (GEMINI_API_KEY or GOOGLE_API_KEY) is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Phase-specific best practices injection
    let phaseContext = "";
    if (phaseName === "Modelado de Base de Datos") {
      phaseContext = "Considera normalización 3NF, uso de UUIDs como Primary Keys, e integridad referencial.";
    } else if (phaseName === "Implementación") {
      phaseContext = "Aplica principios Clean Code, manejo de errores robusto y tipado estricto con TypeScript.";
    } else if (phaseName === "Requerimientos") {
      phaseContext = "Enfoque en Criterios de Aceptación (Gherkin) y definición de actores claros.";
    }

    const fullPrompt = `
      ESTRUCTURA DE PROMPT RECIBIDA:
      1. ROL: ${blocks.rol}
      2. CONTEXTO: ${blocks.contexto}
      3. FRENO: ${blocks.freno}
      4. DIAGNÓSTICO: ${blocks.diagnostico}
      5. ACCIÓN (ANÁLISIS FUNCIONAL / LÓGICA): ${blocks.accion}
      6. ARQUITECTURA E INFO (UI/UX): ${blocks.arquitectura}
      7. IDENTIDAD VISUAL (DISEÑO): ${blocks.identidad}
      8. ESQUEMA Y RELACIONES (DATABASE): ${blocks.esquema}
      9. LÍMITES (ACCESIBILIDAD Y RENDIMIENTO): ${blocks.limites}
      10. ENTREGA: ${blocks.entrega}
      11. REQUERIMIENTOS NO FUNCIONALES: ${blocks.nfr}

      FASE DEL SDLC: ${phaseName}
      CONSEJO TÉCNICO DE FASE: ${phaseContext}

      TAREA:
      Como Principal AI Engineer, realiza:
      1. OPTIMIZA el prompt anterior usando la estructura de 10-11 pasos dependiendo de la fase. Inyecta el "CONSEJO TÉCNICO DE FASE" de forma orgánica.
      2. Si es fase de Diseño de Interfaz: Aplica estrictamente TAILWIND 4 y FRAMER MOTION para animaciones. Asegura el contraste según WCAG.
      3. EJECUTA el prompt optimizado y devuelve el resultado técnico.
      4. EXPLICA brevemente por qué realizaste cambios específicos (ej: "Se ajustó el contraste para cumplimiento A11y").

      IMPORTANTE: Responde ÚNICAMENTE en JSON plano:
      {
        "optimizedPrompt": "...",
        "result": "...",
        "explanation": "..."
      }
    `;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
    
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: "Error generatriz de IA", details: error.message },
      { status: 500 }
    );
  }
}
