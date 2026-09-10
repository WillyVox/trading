-- AlterTable
-- Adds a nullable password hash column for the new email/password
-- (Credentials) login + register flow. Nullable because any future
-- OAuth-only users would not have one.
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
