import { prisma } from "@devflow/core";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const phases = await prisma.sdlcPhase.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json(phases);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch phases" }, { status: 500 });
  }
}
