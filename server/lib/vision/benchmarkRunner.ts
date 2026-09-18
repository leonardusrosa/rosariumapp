import {
  VisionModelConfig,
  VisionRecognitionProvider,
  ProviderRecognitionMeta,
} from "./types.js";
import { BenchmarkCase } from "./fixtureLoader.js";
import { OpenAICompatibleVisionAdapter } from "./adapters/OpenAICompatibleVisionAdapter.js";
import { MockVisionProvider } from "./adapters/MockVisionProvider.js";
import { scoreCoverRecognition, CoverScoreResult, ExpectedCoverFixture } from "./scoring/coverScorer.js";
import { scoreShelfRecognition, ShelfScoreResult, ExpectedShelfFixture } from "./scoring/shelfScorer.js";

export interface BenchmarkRunnerOptions {
  models: VisionModelConfig[];
  cases: BenchmarkCase[];
  runsPerCase?: number;
  requestDelayMs?: number;
  maxConcurrency?: number;
  onProgress?: (current: number, total: number, message: string) => void;
}

export interface BenchmarkRunRecord {
  caseId: string;
  caseType: "cover" | "shelf";
  modelId: string;
  runIndex: number;
  timestamp: string;
  meta: ProviderRecognitionMeta;
  coverScore?: CoverScoreResult;
  shelfScore?: ShelfScoreResult;
  rawResult?: any;
}

export interface ModelAggregatedSummary {
  modelId: string;
  label: string;
  gateway: string;
  servingProvider?: string;
  task: "cover" | "shelf";
  totalRuns: number;
  successfulRuns: number;
  rateLimitedRuns: number;
  invalidOutputRuns: number;
  failedRuns: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  totalTokensUsed: number;
  totalEstimatedCostUsd?: number;
  // Cover specific
  workIdentificationRate?: number;
  titleMatchRate?: number;
  authorMatchRate?: number;
  isbnMatchRate?: number;
  // Shelf specific
  precision?: number;
  recall?: number;
  f1Score?: number;
  totalTruePositives?: number;
  totalFalsePositives?: number;
  totalFalseNegatives?: number;
  totalHighConfidenceErrors: number;
  avgConfidenceScore: number;
}

export interface BenchmarkReportBundle {
  timestamp: string;
  isPrivate: boolean;
  models: VisionModelConfig[];
  runs: BenchmarkRunRecord[];
  coverSummary: Record<string, ModelAggregatedSummary>;
  shelfSummary: Record<string, ModelAggregatedSummary>;
}

export async function runVisionBenchmark(
  options: BenchmarkRunnerOptions
): Promise<BenchmarkReportBundle> {
  const runsPerCase = Math.max(1, options.runsPerCase || 1);
  const delayMs = options.requestDelayMs ?? 400;
  const records: BenchmarkRunRecord[] = [];

  const providers = new Map<string, VisionRecognitionProvider>();
  for (const config of options.models) {
    if (config.gateway === "mock") {
      providers.set(config.id, new MockVisionProvider(config.id));
    } else {
      providers.set(config.id, new OpenAICompatibleVisionAdapter(config));
    }
  }

  const totalSteps = options.cases.length * options.models.length * runsPerCase;
  let currentStep = 0;

  for (const bCase of options.cases) {
    for (const modelConfig of options.models) {
      const provider = providers.get(modelConfig.id);
      if (!provider) continue;

      for (let r = 0; r < runsPerCase; r++) {
        currentStep++;
        options.onProgress?.(
          currentStep,
          totalSteps,
          `[${modelConfig.label}] ${bCase.type} case: ${bCase.id} (run ${r + 1}/${runsPerCase})`
        );

        if (delayMs > 0 && modelConfig.gateway !== "mock") {
          await new Promise((res) => setTimeout(res, delayMs));
        }

        const input = {
          type: "file_path" as const,
          data: bCase.imagePath,
          filename: bCase.id,
        };

        const timestamp = new Date().toISOString();

        if (bCase.type === "cover") {
          const { result, meta } = await provider.recognizeCover(input);
          const coverScore = scoreCoverRecognition(
            result,
            bCase.expected as ExpectedCoverFixture,
            meta.error === "invalid_output"
          );

          records.push({
            caseId: bCase.id,
            caseType: "cover",
            modelId: modelConfig.id,
            runIndex: r + 1,
            timestamp,
            meta,
            coverScore,
            rawResult: result,
          });
        } else {
          const { result, meta } = await provider.recognizeShelf(input);
          const shelfScore = scoreShelfRecognition(
            result,
            bCase.expected as ExpectedShelfFixture,
            meta.error === "invalid_output"
          );

          records.push({
            caseId: bCase.id,
            caseType: "shelf",
            modelId: modelConfig.id,
            runIndex: r + 1,
            timestamp,
            meta,
            shelfScore,
            rawResult: result,
          });
        }
      }
    }
  }

  const isPrivate = options.cases.some((c) => c.isPrivate);
  const coverSummary = aggregateModelMetrics(records.filter((r) => r.caseType === "cover"), options.models, "cover");
  const shelfSummary = aggregateModelMetrics(records.filter((r) => r.caseType === "shelf"), options.models, "shelf");

  return {
    timestamp: new Date().toISOString(),
    isPrivate,
    models: options.models,
    runs: records,
    coverSummary,
    shelfSummary,
  };
}

function aggregateModelMetrics(
  records: BenchmarkRunRecord[],
  models: VisionModelConfig[],
  task: "cover" | "shelf"
): Record<string, ModelAggregatedSummary> {
  const summaries: Record<string, ModelAggregatedSummary> = {};

  for (const model of models) {
    const modelRuns = records.filter((r) => r.modelId === model.id);
    if (modelRuns.length === 0) continue;

    const latencies = modelRuns.map((r) => r.meta.latencyMs).sort((a, b) => a - b);
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const p95Latency = latencies[Math.floor(latencies.length * 0.95)] || latencies[latencies.length - 1];

    const rateLimited = modelRuns.filter((r) => r.meta.error === "rate_limited").length;
    const invalidOutput = modelRuns.filter((r) => r.meta.error === "invalid_output").length;
    const failed = modelRuns.filter((r) => r.meta.error && r.meta.error !== "rate_limited" && r.meta.error !== "invalid_output").length;
    const successful = modelRuns.filter((r) => !r.meta.error).length;

    const totalTokens = modelRuns.reduce((sum, r) => sum + (r.meta.tokensUsed?.total || 0), 0);
    const totalCost = modelRuns.reduce((sum, r) => sum + (r.meta.estimatedCostUsd || 0), 0);

    const servingProviders = Array.from(new Set(modelRuns.map((r) => r.meta.servingProvider).filter(Boolean)));

    const summary: ModelAggregatedSummary = {
      modelId: model.id,
      label: model.label,
      gateway: model.gateway,
      servingProvider: servingProviders.join(", ") || model.providerRoute?.provider || "default",
      task,
      totalRuns: modelRuns.length,
      successfulRuns: successful,
      rateLimitedRuns: rateLimited,
      invalidOutputRuns: invalidOutput,
      failedRuns: failed,
      avgLatencyMs: Math.round(avgLatency),
      p95LatencyMs: Math.round(p95Latency),
      totalTokensUsed: totalTokens,
      totalEstimatedCostUsd: totalCost > 0 ? Number(totalCost.toFixed(5)) : undefined,
      totalHighConfidenceErrors: 0,
      avgConfidenceScore: 0,
    };

    if (task === "cover") {
      const validCovers = modelRuns.map((r) => r.coverScore).filter(Boolean) as CoverScoreResult[];
      const identified = validCovers.filter((c) => c.workIdentified).length;
      const titleMatches = validCovers.filter((c) => c.titleMatched).length;
      const authorMatches = validCovers.filter((c) => c.authorMatched).length;
      const isbnMatches = validCovers.filter((c) => c.isbnMatched === true).length;
      const isbnCases = validCovers.filter((c) => c.isbnMatched !== undefined).length;

      summary.workIdentificationRate = Number((identified / validCovers.length).toFixed(3));
      summary.titleMatchRate = Number((titleMatches / validCovers.length).toFixed(3));
      summary.authorMatchRate = Number((authorMatches / validCovers.length).toFixed(3));
      summary.isbnMatchRate = isbnCases > 0 ? Number((isbnMatches / isbnCases).toFixed(3)) : undefined;
      summary.totalHighConfidenceErrors = validCovers.reduce((s, c) => s + c.highConfidenceWrongCount, 0);
      summary.avgConfidenceScore = Number((validCovers.reduce((s, c) => s + c.confidenceWeightedScore, 0) / validCovers.length).toFixed(2));
    } else {
      const validShelves = modelRuns.map((r) => r.shelfScore).filter(Boolean) as ShelfScoreResult[];
      const totalTP = validShelves.reduce((s, sh) => s + sh.truePositives, 0);
      const totalFP = validShelves.reduce((s, sh) => s + sh.falsePositives, 0);
      const totalFN = validShelves.reduce((s, sh) => s + sh.falseNegatives, 0);
      const totalPartials = validShelves.reduce((s, sh) => s + sh.partialMatches, 0);

      const precisions = validShelves.map((sh) => sh.precision);
      const recalls = validShelves.map((sh) => sh.recall);
      const f1s = validShelves.map((sh) => sh.f1Score);

      summary.precision = Number((precisions.reduce((a, b) => a + b, 0) / precisions.length).toFixed(3));
      summary.recall = Number((recalls.reduce((a, b) => a + b, 0) / recalls.length).toFixed(3));
      summary.f1Score = Number((f1s.reduce((a, b) => a + b, 0) / f1s.length).toFixed(3));
      summary.totalTruePositives = totalTP;
      summary.totalFalsePositives = totalFP;
      summary.totalFalseNegatives = totalFN;
      summary.totalHighConfidenceErrors = validShelves.reduce((s, sh) => s + sh.highConfidenceWrongCount, 0);
      summary.avgConfidenceScore = Number((validShelves.reduce((s, sh) => s + sh.confidenceWeightedScore, 0) / validShelves.length).toFixed(2));
    }

    summaries[model.id] = summary;
  }

  return summaries;
}
