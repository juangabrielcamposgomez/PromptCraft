import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando limpieza de PromptTemplates duplicados o vacíos...');

  const allTemplates = await prisma.promptTemplate.findMany({
    include: { versions: true }
  });

  const uniqueTitles = new Set();
  const toDelete = [];

  for (const template of allTemplates) {
    const hasEmptyContent = template.versions.length === 0 || template.versions.some(v => !v.content || v.content.trim() === '');
    
    if (uniqueTitles.has(template.title)) {
      toDelete.push(template.id);
    } else if (hasEmptyContent) {
      toDelete.push(template.id);
    } else {
      uniqueTitles.add(template.title);
    }
  }

  if (toDelete.length > 0) {
    await prisma.promptTemplate.deleteMany({
      where: { id: { in: toDelete } }
    });
    console.log(`Se eliminaron ${toDelete.length} plantillas duplicadas o vacías.`);
  } else {
    console.log('No se encontraron plantillas para eliminar. Todo en orden.');
  }
}

main()
  .catch(e => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
