-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "forged_methodology" TEXT,
ADD COLUMN     "forged_pattern" TEXT DEFAULT 'AgentX',
ADD COLUMN     "forged_role" TEXT,
ADD COLUMN     "forged_stack" TEXT,
ADD COLUMN     "has_forged_identity" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "app_config" (
    "id" TEXT NOT NULL DEFAULT 'global_config',
    "is_global_paused" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "target_route" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
