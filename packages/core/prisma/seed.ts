import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const sdlcPhases = [
    {
      name: 'Requerimientos',
      description: 'Identificación y recolección de necesidades del negocio y del usuario.',
      orderIndex: 1,
      categories: ['Historias de Usuario', 'Criterios de Aceptación'],
    },
    {
      name: 'Análisis',
      description: 'Evaluación técnica de la viabilidad y definición del stack tecnológico.',
      orderIndex: 2,
      categories: ['Análisis de Viabilidad', 'Definición de Stack'],
    },
    {
      name: 'Modelado de Base de Datos',
      description: 'Arquitectura y diseño relacional de la información.',
      orderIndex: 3,
      categories: ['Esquema ER', 'Diccionario de Datos'],
    },
    {
      name: 'Diseño de Interfaz',
      description: 'Creación visual y prototipado de la experiencia de usuario.',
      orderIndex: 4,
      categories: ['Wireframes', 'Prototipo de Alta Fidelidad'],
    },
    {
      name: 'Implementación',
      description: 'Escritura de código y creación de la lógica del sistema.',
      orderIndex: 5,
      categories: ['Setup del Proyecto', 'Desarrollo de Features'],
    },
    {
      name: 'Producción/Despliegue',
      description: 'Lanzamiento, escalado y monitoreo de la aplicación.',
      orderIndex: 6,
      categories: ['Configuración de CI/CD', 'Monitoreo y Alertas'],
    },
    {
      name: 'QA & Testing',
      description: 'Validación de calidad comercial, casos de uso transaccionales y auditoría de seguridad.',
      orderIndex: 7,
      categories: ['Automatización de Pruebas', 'Planes E2E'],
    },
    {
      name: 'OWASP / Seguridad',
      description: 'Auditoría estática, Pentesting y validación Zero Trust del Top 10 vulnerabilidades.',
      orderIndex: 8,
      categories: ['Pentesting ZAP', 'Análisis Snyk', 'Defensa en Profundidad'],
    },
  ];

  for (const phaseData of sdlcPhases) {
    const { categories, ...phaseInfo } = phaseData;
    
    const phase = await prisma.sdlcPhase.upsert({
      where: { name: phaseInfo.name },
      update: {
        description: phaseInfo.description,
        orderIndex: phaseInfo.orderIndex,
      },
      create: phaseInfo,
    });

    console.log(`✅ Phase created/updated: ${phase.name}`);

    for (const categoryName of categories) {
      await prisma.category.upsert({
        where: { 
          // Note: In real life we'd likely need a unique compound index on [name, phaseId]
          // For the seed we'll search by name within the phase if we had a more complex setup,
          // but here we'll just check if it exists (assuming unique names for simplicity in this seed).
          id: 'placeholder', // Upsert requires a unique identifier, see below
        },
        update: {},
        create: {
          name: categoryName,
          phaseId: phase.id,
        },
      }).catch(async (e: any) => {
        // Fallback for categories since they don't have a unique constraint on 'name' in our current schema.
        // We manually check or create to avoid duplicates in seed.
        const existing = await prisma.category.findFirst({
          where: { name: categoryName, phaseId: phase.id }
        });
        if (!existing) {
          await prisma.category.create({
            data: { name: categoryName, phaseId: phase.id }
          });
          console.log(`   - Category created: ${categoryName}`);
        }
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e: any) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
