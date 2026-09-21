import { prisma } from "@/lib/prisma";
import type { RateLimitStore } from "./rate-limit";

/**
 * Postgres-backed store, so limits hold across serverless instances (an
 * in-memory counter would reset on every cold start and differ per
 * instance). Only used for low-volume, security-sensitive endpoints (login,
 * register) -- not for high-traffic paths like /go, where an extra write per
 * request would defeat the purpose.
 */
export const prismaRateLimitStore: RateLimitStore = {
  async record(key, at) {
    await prisma.rateLimitHit.create({ data: { key, createdAt: at } });
  },
  count(key, since) {
    return prisma.rateLimitHit.count({
      where: { key, createdAt: { gt: since } },
    });
  },
  async clear(key) {
    await prisma.rateLimitHit.deleteMany({ where: { key } });
  },
  async prune(before) {
    await prisma.rateLimitHit.deleteMany({
      where: { createdAt: { lt: before } },
    });
  },
};
