import fs from "fs";
import path from "path";
import { ExpectedCoverFixture } from "./scoring/coverScorer.js";
import { ExpectedShelfFixture } from "./scoring/shelfScorer.js";

export interface BenchmarkCase<T = ExpectedCoverFixture | ExpectedShelfFixture> {
  id: string;
  type: "cover" | "shelf";
  directory: string;
  imagePath: string;
  expected: T;
  isPrivate: boolean;
}

const SUPPORTED_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

export function loadBenchmarkCases(options?: {
  usePrivate?: boolean;
  task?: "cover" | "shelf" | "all";
  caseId?: string;
  rootDir?: string;
}): BenchmarkCase[] {
  const root = options?.rootDir || process.cwd();
  const cases: BenchmarkCase[] = [];

  const baseDirs: Array<{ dirName: string; isPrivate: boolean }> = [];

  if (options?.usePrivate) {
    const privateDir = path.join(root, "benchmarks-private");
    if (fs.existsSync(privateDir)) {
      baseDirs.push({ dirName: privateDir, isPrivate: true });
    }
  } else {
    const smokeDir = path.join(root, "benchmarks", "smoke");
    if (fs.existsSync(smokeDir)) {
      baseDirs.push({ dirName: smokeDir, isPrivate: false });
    }
  }

  const tasksToLoad =
    !options?.task || options.task === "all" ? ["cover", "shelf"] : [options.task];

  for (const { dirName, isPrivate } of baseDirs) {
    for (const task of tasksToLoad) {
      const taskDir = path.join(dirName, task);
      if (!fs.existsSync(taskDir)) continue;

      const subEntries = fs.readdirSync(taskDir, { withFileTypes: true });
      for (const entry of subEntries) {
        if (!entry.isDirectory()) continue;
        const caseDir = path.join(taskDir, entry.name);

        const expectedPath = path.join(caseDir, "expected.json");
        if (!fs.existsSync(expectedPath)) continue;

        // Find image file
        let foundImage: string | undefined;
        for (const ext of SUPPORTED_IMAGE_EXTS) {
          const candPath = path.join(caseDir, `image${ext}`);
          if (fs.existsSync(candPath)) {
            foundImage = candPath;
            break;
          }
        }

        if (!foundImage) continue;

        try {
          const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));
          const id = expected.id || `${task}-${entry.name}`;

          if (options?.caseId && options.caseId !== id && options.caseId !== entry.name) {
            continue;
          }

          cases.push({
            id,
            type: task as "cover" | "shelf",
            directory: caseDir,
            imagePath: foundImage,
            expected,
            isPrivate,
          });
        } catch (err) {
          console.warn(`Failed to parse benchmark fixture at ${expectedPath}:`, err);
        }
      }
    }
  }

  return cases;
}
