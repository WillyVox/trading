import type { ImportResult } from "./types";

export function printHeader(directory: string, fileCount: number, dryRun: boolean, environment: string) {
  console.log("Crypto Article Publisher");
  console.log("────────────────────────────────");
  console.log("");
  console.log(`Environment: ${environment}`);
  console.log(`Directory:   ${directory}`);
  if (dryRun) console.log("Mode:        DRY RUN — no database changes, no files moved");
  console.log("");
  console.log(`Found: ${fileCount} file${fileCount === 1 ? "" : "s"}`);
  console.log("");
}

export function printFileResult(index: number, total: number, result: ImportResult) {
  console.log(`[${index}/${total}] ${result.fileName}`);
  if (result.outcome === "FAILED") {
    console.log(`  ✗ FAILED`);
    console.log(`  Reason: ${result.error}`);
  } else {
    console.log(`  ✓ parsed`);
    console.log(`  ✓ validated`);
    for (const warning of result.warnings) {
      console.log(`  ⚠ ${warning}`);
    }
    console.log(`  ✓ ${result.outcome}`);
    if (result.movedTo) {
      console.log(`  ✓ moved → processed/${result.movedTo}`);
    } else if (result.dryRun) {
      console.log(`  (dry run — not moved)`);
    }
  }
  console.log("");
}

export function printSummary(results: ImportResult[], dryRun: boolean) {
  const created = results.filter((r) => r.outcome === "CREATED").length;
  const updated = results.filter((r) => r.outcome === "UPDATED").length;
  const skipped = results.filter((r) => r.outcome === "SKIPPED").length;
  const failed = results.filter((r) => r.outcome === "FAILED").length;
  const warnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  console.log("────────────────────────────────");
  console.log("");
  console.log("Summary");
  console.log("");
  console.log(`Created:   ${created}`);
  console.log(`Updated:   ${updated}`);
  if (skipped > 0) console.log(`Skipped:   ${skipped}`);
  console.log(`Warnings:  ${warnings}`);
  console.log(`Failed:    ${failed}`);
  if (!dryRun) console.log(`Processed: ${created + updated}`);
  console.log("");
  if (dryRun) console.log("No database changes were made.");
}