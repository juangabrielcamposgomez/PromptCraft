import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPromptWithVersion } from './promptService';
import { prisma } from '../db';

// Mock the entire db module
vi.mock('../db', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

describe('promptService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPromptWithVersion', () => {
    it('should create a template and a version in an atomic transaction', async () => {
      const mockInput = {
        projectId: 'project-123',
        title: 'New Prompt',
        content: 'System: Hello',
        aiConfig: { temp: 0.7 },
      };

      const mockTemplate = { id: 'temp-1', ...mockInput, currentVersion: 1 };
      const mockVersion = { id: 'ver-1', promptId: 'temp-1', versionNumber: 1, content: 'System: Hello' };

      // Mock transaction behavior
      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          promptTemplate: { create: vi.fn().mockResolvedValue(mockTemplate) },
          promptVersion: { create: vi.fn().mockResolvedValue(mockVersion) },
        };
        return callback(tx);
      });

      const result = await createPromptWithVersion(mockInput);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.template).toEqual(mockTemplate);
      expect(result.version).toEqual(mockVersion);
    });

    it('should propagate errors if the transaction fails', async () => {
      const mockInput = {
        projectId: 'project-123',
        title: 'New Prompt',
        content: 'System: Hello',
        aiConfig: { temp: 0.7 },
      };

      (prisma.$transaction as any).mockRejectedValue(new Error('Transaction Failed'));

      await expect(createPromptWithVersion(mockInput)).rejects.toThrow('Transaction Failed');
    });
  });
});
