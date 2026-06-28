-- AlterTable
ALTER TABLE "users" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorLastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "twoFactorOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "twoFactorOtpHash" TEXT;
