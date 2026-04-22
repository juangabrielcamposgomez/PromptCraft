import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { phaseId, phaseName, blocks, template } = await req.json();

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
      ${JSON.stringify(blocks, null, 2)}

      FASE DEL SDLC: ${phaseName}
      CONSEJO TÉCNICO DE FASE: ${phaseContext}
      
      INSTRUCCIÓN ESPECIALIZADA: ${template?.instruction || "Optimiza y consolida la información."}
      FORMATO REQUERIDO: ${template?.format || "Devuelve una explicación técnica detallada."}

      TAREA:
      Como Principal AI Engineer, realiza:
      1. OPTIMIZA el prompt anterior inyectando el "CONSEJO TÉCNICO DE FASE".
      2. EJECUTA el prompt optimizado siguiendo la "INSTRUCCIÓN ESPECIALIZADA" y el "FORMATO REQUERIDO".
      3. EXPLICA brevemente por qué realizaste cambios específicos.

      IMPORTANTE: Responde ÚNICAMENTE en JSON plano:
      {
        "optimizedPrompt": "...",
        "explanation": "aquí va el resultado formateado según el FORMATO REQUERIDO",
        "briefChangeLog": "..."
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
