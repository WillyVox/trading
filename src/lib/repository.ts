import { prisma } from "@/lib/prisma";

/**
 * Shared, generic data-access layer. Domain services (articles, providers,
 * affiliates) build on this rather than calling prisma directly, so query
 * patterns (pagination, slug lookup, soft filters) stay consistent.
 */
export function createRepository<
  Delegate extends {
    findMany: (...args: any[]) => any;
    findFirst?: (...args: any[]) => any; // Add optional findFirst
    findUnique: (...args: any[]) => any;
    count: (...args: any[]) => any;
    create: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
  }
>(delegate: Delegate) {
  return {
    findMany: (args?: Parameters<Delegate["findMany"]>[0]) => delegate.findMany(args),
    findFirst: (args?: any) => delegate.findFirst?.(args),
    findUnique: (args: Parameters<Delegate["findUnique"]>[0]) => delegate.findUnique(args),
    findBySlug: (slug: string, extra?: Record<string, unknown>) =>
      delegate.findUnique({ where: { slug }, ...extra }),
    count: (args?: Parameters<Delegate["count"]>[0]) => delegate.count(args),
    create: (args: Parameters<Delegate["create"]>[0]) => delegate.create(args),
    update: (args: Parameters<Delegate["update"]>[0]) => delegate.update(args),
    remove: (args: Parameters<Delegate["delete"]>[0]) => delegate.delete(args),
    async paginate(args: {
      where?: Record<string, unknown>;
      orderBy?: Record<string, unknown>;
      page?: number;
      pageSize?: number;
      include?: Record<string, unknown>;
    }) {
      const page = args.page ?? 1;
      const pageSize = args.pageSize ?? 20;
      const [items, total] = await Promise.all([
        delegate.findMany({
          where: args.where,
          orderBy: args.orderBy,
          include: args.include,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        delegate.count({ where: args.where }),
      ]);
      return { items, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
    },
  };
}

export const articleRepository = createRepository(prisma.article);
export const providerRepository = createRepository(prisma.provider);
export const affiliateLinkRepository = createRepository(prisma.affiliateLink);
export const affiliateClickRepository = createRepository(prisma.affiliateClick);
