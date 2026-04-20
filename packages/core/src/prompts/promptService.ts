import { prisma } from '../db';

interface CreatePromptInput {
  projectId: string;
  categoryId?: string;
  title: string;
  content: string;
  aiConfig: any;
  changeSummary?: string;
}

/**
 * Creates a new prompt template along with its initial version in an atomic transaction.
 */
export async function createPromptWithVersion(input: CreatePromptInput) {
  const { projectId, categoryId, title, content, aiConfig, changeSummary } = input;

  return await prisma.$transaction(async (tx) => {
    // 1. Create the template
    const template = await tx.promptTemplate.create({
      data: {
        projectId,
        categoryId,
        title,
        currentVersion: 1,
      },
    });

    // 2. Create the first version linked to the template
    const version = await tx.promptVersion.create({
      data: {
        promptId: template.id,
        versionNumber: 1,
        content,
        aiConfig,
        changeSummary: changeSummary || 'Initial version',
      },
    });

    return { template, version };
  });
}
