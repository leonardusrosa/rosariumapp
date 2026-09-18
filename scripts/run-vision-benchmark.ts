import { getBenchmarkModels } from "../server/lib/vision/modelRegistry.js";
import { loadBenchmarkCases } from "../server/lib/vision/fixtureLoader.js";
import { runVisionBenchmark } from "../server/lib/vision/benchmarkRunner.js";
import { saveBenchmarkReports } from "../server/lib/vision/reportGenerator.js";

// Load .env variables if present
try {
  process.loadEnvFile();
} catch {}

async function main() {
  const args = process.argv.slice(2);

  const isMock = args.includes("--mock") || args.includes("--dry-run");
  const isPrivate = args.includes("--private");

  let task: "cover" | "shelf" | "all" = "all";
  const taskIdx = args.indexOf("--task");
  if (taskIdx !== -1 && args[taskIdx + 1]) {
    task = args[taskIdx + 1] as any;
  }

  let modelId: string | undefined;
  const modelIdx = args.indexOf("--model");
  if (modelIdx !== -1 && args[modelIdx + 1]) {
    modelId = args[modelIdx + 1];
  }

  let caseId: string | undefined;
  const caseIdx = args.indexOf("--case");
  if (caseIdx !== -1 && args[caseIdx + 1]) {
    caseId = args[caseIdx + 1];
  }

  let runsPerCase = 1;
  const runsIdx = args.indexOf("--runs-per-case");
  if (runsIdx !== -1 && args[runsIdx + 1]) {
    runsPerCase = parseInt(args[runsIdx + 1], 10) || 1;
  }

  console.log("=== BIBLIOTHECA VISION RECOGNITION BENCHMARK ===");
  console.log(`Task filter: ${task}`);
  console.log(`Dataset: ${isPrivate ? "Real Physical Library (benchmarks-private/)" : "Smoke Dataset (benchmarks/smoke/)"}`);
  console.log(`Provider Mode: ${isMock ? "Mock / Deterministic CI" : "Live Gateway / Configured Models"}`);
  console.log(`Runs per case: ${runsPerCase}`);
  if (modelId) console.log(`Model filter: ${modelId}`);
  if (caseId) console.log(`Case filter: ${caseId}`);
  console.log("------------------------------------------------");

  // 1. Load models
  const models = getBenchmarkModels({
    mode: isMock ? "mock" : undefined,
    modelId,
  });

  if (models.length === 0) {
    console.error("No enabled models found matching criteria.");
    process.exit(1);
  }

  // 2. Load benchmark cases
  const cases = loadBenchmarkCases({
    usePrivate: isPrivate,
    task,
    caseId,
  });

  if (cases.length === 0) {
    console.error(`No benchmark cases found in ${isPrivate ? "benchmarks-private/" : "benchmarks/smoke/"}`);
    if (isPrivate) {
      console.log("See benchmarks-private/README.md on how to add real book cover and shelf photographs.");
    }
    process.exit(1);
  }

  console.log(`Loaded ${models.length} model(s) and ${cases.length} case(s). Total runs: ${models.length * cases.length * runsPerCase}\n`);

  // 3. Execute runner
  const bundle = await runVisionBenchmark({
    models,
    cases,
    runsPerCase,
    onProgress: (cur, tot, msg) => {
      console.log(`[${cur}/${tot}] ${msg}`);
    },
  });

  // 4. Save reports
  const { jsonPath, mdPath } = saveBenchmarkReports(bundle);

  console.log("\n================================================");
  console.log("Benchmark execution completed!");
  console.log(`JSON Report: ${jsonPath}`);
  console.log(`Markdown Report: ${mdPath}`);
  console.log("================================================\n");
}

main().catch((err) => {
  console.error("Fatal benchmark runner error:", err);
  process.exit(1);
});
