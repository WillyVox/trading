import path from "node:path";
import { promises as fs } from "node:fs";
import { prisma } from "@/lib/prisma";
import { scanArticleDirectory, ensureImportDirectories } from "@/lib/articles/import/scanner";
import { parseArticleFile } from "@/lib/articles/import/parser";
import { upsertArticleCore, previewOutcome } from "@/lib/articles/import/importer";
import { resolveRelationships, previewRelationshipWarnings } from "@/lib/articles/import/relationships";
import { moveToProcessed } from "@/lib/articles/import/file-mover";
import { printHeader, printFileResult, printSummary } from "@/lib/articles/import/reporter";
import type { ArticleImportPayload, ImportResult } from "@/lib/articles/import/types";

const PUBLISH_DIR = path.resolve(process.cwd(), "publish_article");

interface CliArgs {
  dryRun: boolean;
  file?: string;
  verbose: boolean;
  allowProduction: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  return {
    dryRun: argv.includes("--dry-run"),
    verbose: argv.includes("--verbose"),
    allowProduction: argv.includes("--allow-production"),
    file: (() => {
      const idx = argv.indexOf("--file");
      return idx !== -1 ? argv[idx + 1] : undefined;
    })(),
  };
}

interface PendingFile {
  fileName: string;
  filePath: string;
  payload: ArticleImportPayload;
  warnings: string[];
  id?: string;
  outcome: "CREATED" | "UPDATED";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const environment = process.env.NODE_ENV ?? "development";

  if (environment === "production" && !args.dryRun && !args.allowProduction) {
    console.error(
      `Refusing to write to a production database without --allow-production.\n` +
        `Run with --dry-run first, or re-run with --allow-production once you're sure.`
    );
    process.exitCode = 1;
    return;
  }

  await ensureImportDirectories(PUBLISH_DIR);

  const allFiles = await scanArticleDirectory(PUBLISH_DIR);
  const files = args.file ? allFiles.filter((f) => f.fileName === args.file) : allFiles;

  if (args.file && files.length === 0) {
    console.error(`File "${args.file}" not found in ${PUBLISH_DIR} (or it has an unsupported extension).`);
    process.exitCode = 1;
    return;
  }

  printHeader(PUBLISH_DIR, files.length, args.dryRun, environment);

  const results: ImportResult[] = [];
  const pending: PendingFile[] = [];

  for (const file of files) {
    try {
      const rawText = await fs.readFile(file.filePath, "utf8");
      const parsed = parseArticleFile(rawText);

      if (!parsed.ok) {
        results.push({
          fileName: file.fileName,
          outcome: "FAILED",
          warnings: parsed.warnings,
          error: parsed.errors.join("; "),
          dryRun: args.dryRun,
        });
        continue;
      }

      if (args.verbose) {
        console.log(
          `  [${file.fileName}] metadata: ${JSON.stringify(
            { ...parsed.payload, content: `<${parsed.payload.content.length} chars of HTML>` },
            null,
            2
          )}`
        );
      }

      if (args.dryRun) {
        const outcome = await previewOutcome(parsed.payload.slug);
        pending.push({
          fileName: file.fileName,
          filePath: file.filePath,
          payload: parsed.payload,
          warnings: [...parsed.warnings],
          outcome,
        });
      } else {
        const { id, outcome } = await upsertArticleCore(parsed.payload);
        pending.push({
          fileName: file.fileName,
          filePath: file.filePath,
          payload: parsed.payload,
          warnings: [...parsed.warnings],
          id,
          outcome,
        });
      }
    } catch (err) {
      results.push({
        fileName: file.fileName,
        outcome: "FAILED",
        warnings: [],
        error: (err as Error).message,
        dryRun: args.dryRun,
      });
    }
  }

  for (const entry of pending) {
    let relationshipWarnings: string[] = [];
    let relationshipError: string | undefined;

    if (args.dryRun) {
      relationshipWarnings = await previewRelationshipWarnings(entry.payload);
    } else if (entry.id) {
      try {
        const result = await resolveRelationships(entry.id, entry.payload);
        relationshipWarnings = result.warnings;
      } catch (err) {
        relationshipError = (err as Error).message;
      }
    }

    let movedTo: string | undefined;
    if (!args.dryRun) {
      try {
        const destination = await moveToProcessed(entry.filePath, PUBLISH_DIR);
        movedTo = path.basename(destination);
      } catch (err) {
        relationshipWarnings.push(`article was imported but the file could not be moved: ${(err as Error).message}`);
      }
    }

    results.push({
      fileName: entry.fileName,
      slug: entry.payload.slug,
      outcome: entry.outcome,
      warnings: [
        ...entry.warnings,
        ...relationshipWarnings,
        ...(relationshipError ? [`relationship resolution failed: ${relationshipError}`] : []),
      ],
      dryRun: args.dryRun,
      movedTo,
    });
  }

  const orderIndex = new Map(files.map((f, i) => [f.fileName, i]));
  results.sort((a, b) => (orderIndex.get(a.fileName) ?? 0) - (orderIndex.get(b.fileName) ?? 0));

  results.forEach((result, i) => printFileResult(i + 1, results.length, result));
  printSummary(results, args.dryRun);

  const hasFailures = results.some((r) => r.outcome === "FAILED");
  if (hasFailures) process.exitCode = 1;

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Import job crashed:", err);
  await prisma.$disconnect();
  process.exitCode = 1;
});
