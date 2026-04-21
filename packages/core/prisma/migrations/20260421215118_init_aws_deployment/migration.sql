/*
  Warnings:

  - The `role` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "execution_logs" ALTER COLUMN "input_data" SET DATA TYPE TEXT,
ALTER COLUMN "token_usage" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'APODERADO',
ALTER COLUMN "ui_preferences" SET DEFAULT '{"theme": "dark", "dashboard_view": "summary", "glassmorphism": false}',
ALTER COLUMN "ui_preferences" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "prompt_versions" ALTER COLUMN "ai_config" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "UserRole";
