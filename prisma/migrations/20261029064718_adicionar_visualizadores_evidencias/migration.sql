-- CreateEnum
CREATE TYPE "EvidenceViewer" AS ENUM ('DOCUMENT', 'EMAIL', 'TERMINAL', 'BROWSER', 'IMAGE', 'GENERIC');

-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "viewer" "EvidenceViewer" NOT NULL DEFAULT 'GENERIC';
