-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "currentHash" TEXT,
ADD COLUMN     "previousHash" TEXT;
