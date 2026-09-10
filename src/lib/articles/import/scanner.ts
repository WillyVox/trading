import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedFile } from "./types";

const SUPPORTED_EXTENSIONS = new Set([".md", ".txt"]);
const IGNORED_DIR_NAMES = new Set(["processed", "failed"]);

/**
 * Lists importable files directly inside `dir` — per spec §3, this does NOT
 * recurse: subdirectories (processed/, failed/, or anything else), hidden
 * files (dotfiles like .DS_Store/.gitkeep), and unsupported extensions are
 * all ignored.
 */
export async function scanArticleDirectory(dir: string): Promise<ParsedFile[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const files: ParsedFile[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      // Never recurse. Flag anything unexpected (e.g. a typo'd "Processed/")
      // rather than silently ignoring it — processed/ and failed/ are the
      // only directories this job should ever see here.
      if (!IGNORED_DIR_NAMES.has(entry.name.toLowerCase())) {
        console.warn(`⚠ Unexpected directory in publish_article/, ignoring: ${entry.name}`);
      }
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    files.push({ filePath: path.join(dir, entry.name), fileName: entry.name });
  }

  return files.sort((a, b) => a.fileName.localeCompare(b.fileName));
}

/** Ensures publish_article/processed and publish_article/failed exist. */
export async function ensureImportDirectories(baseDir: string): Promise<void> {
  await fs.mkdir(path.join(baseDir, "processed"), { recursive: true });
  await fs.mkdir(path.join(baseDir, "failed"), { recursive: true });
}