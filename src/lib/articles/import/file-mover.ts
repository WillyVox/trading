import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Moves a successfully-imported file into processed/, prefixing with an
 * ISO timestamp if a file of the same name is already there (spec §22).
 * Never called for FAILED files — per spec §23, the stated preference is to
 * leave those in place untouched so they're easy to fix and re-run.
 */
export async function moveToProcessed(filePath: string, publishDir: string): Promise<string> {
  const processedDir = path.join(publishDir, "processed");
  const fileName = path.basename(filePath);
  let destination = path.join(processedDir, fileName);

  try {
    await fs.access(destination);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    destination = path.join(processedDir, `${timestamp}-${fileName}`);
  } catch {
    // destination doesn't exist yet — use the plain name
  }

  await fs.rename(filePath, destination);
  return destination;
}