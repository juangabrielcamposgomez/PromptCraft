import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL?.startsWith("postgresql") 
  ? process.env.DATABASE_URL 
  : "postgresql://postgres:Salvador2024DB@promptcraft-db.cavgs6iey2uo.us-east-1.rds.amazonaws.com:5432/postgres";

// Use Pool with SSL for AWS RDS compatibility
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
      const existing = await prisma.category.findFirst({
        where: { name: categoryName, phaseId: phase.id }
      });
      if (!existing) {
        await prisma.category.create({
          data: { name: categoryName, phaseId: phase.id }
        });
        console.log(`   - Category created: ${categoryName}`);
      }
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
    await pool.end();
  });
