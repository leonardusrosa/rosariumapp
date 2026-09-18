import fs from "fs";
import path from "path";
import { BenchmarkReportBundle, ModelAggregatedSummary } from "./benchmarkRunner.js";

export function saveBenchmarkReports(
  bundle: BenchmarkReportBundle,
  outputDir = path.join(process.cwd(), "artifacts", "vision-benchmark")
): { jsonPath: string; mdPath: string } {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jsonPath = path.join(outputDir, "latest.json");
  const mdPath = path.join(outputDir, "latest.md");

  // 1. Write machine-readable JSON
  fs.writeFileSync(jsonPath, JSON.stringify(bundle, null, 2), "utf-8");

  // 2. Format human-readable Markdown (no automated winner declaration)
  const md = renderMarkdownReport(bundle);
  fs.writeFileSync(mdPath, md, "utf-8");

  return { jsonPath, mdPath };
}

function renderMarkdownReport(bundle: BenchmarkReportBundle): string {
  const lines: string[] = [];

  lines.push("# Bibliotheca Vision Recognition Benchmark Report");
  lines.push("");
  lines.push(`**Date & Time**: ${bundle.timestamp}`);
  lines.push(`**Dataset Type**: ${bundle.isPrivate ? "Real Physical Library (Private)" : "Deterministic Smoke Dataset (CI/Synthetic)"}`);
  lines.push(`**Total Test Runs**: ${bundle.runs.length}`);
  lines.push("");
  lines.push("> [!NOTE]");
  lines.push("> This report presents measured empirical results across candidate vision models without declaring an automated winner. Model selection remains an explicit product decision based on these tradeoffs.");
  lines.push("");

  // ── Cover Benchmark Table ──────────────────────────────────────────────────
  if (Object.keys(bundle.coverSummary).length > 0) {
    lines.push("## Single-Cover Recognition Leaderboard");
    lines.push("");
    lines.push("| Model / Candidate | Serving Provider | Work Acc | Title Match | Author Match | ISBN Acc | High-Conf Errors | Latency (Avg/p95) | Cost (Est) | Reliability |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |");

    for (const summary of Object.values(bundle.coverSummary)) {
      const workAcc = formatPercent(summary.workIdentificationRate);
      const titleMatch = formatPercent(summary.titleMatchRate);
      const authorMatch = formatPercent(summary.authorMatchRate);
      const isbnAcc = summary.isbnMatchRate !== undefined ? formatPercent(summary.isbnMatchRate) : "N/A";
      const latency = `${summary.avgLatencyMs}ms / ${summary.p95LatencyMs}ms`;
      const cost = summary.totalEstimatedCostUsd !== undefined ? `$${summary.totalEstimatedCostUsd.toFixed(5)}` : "unknown";
      const reliability = `${summary.successfulRuns}/${summary.totalRuns} ok` + (summary.rateLimitedRuns > 0 ? ` (${summary.rateLimitedRuns} 429)` : "") + (summary.invalidOutputRuns > 0 ? ` (${summary.invalidOutputRuns} invalid)` : "");

      lines.push(
        `| **${summary.label}** | \`${summary.servingProvider}\` | ${workAcc} | ${titleMatch} | ${authorMatch} | ${isbnAcc} | ${summary.totalHighConfidenceErrors} | ${latency} | ${cost} | ${reliability} |`
      );
    }
    lines.push("");
  }

  // ── Shelf Benchmark Table ──────────────────────────────────────────────────
  if (Object.keys(bundle.shelfSummary).length > 0) {
    lines.push("## Bookshelf Recognition Leaderboard");
    lines.push("");
    lines.push("| Model / Candidate | Serving Provider | Precision | Recall | F1 Score | TP | FP | FN | High-Conf Errors | Latency (Avg/p95) | Reliability |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |");

    for (const summary of Object.values(bundle.shelfSummary)) {
      const precision = formatPercent(summary.precision);
      const recall = formatPercent(summary.recall);
      const f1 = formatPercent(summary.f1Score);
      const tp = summary.totalTruePositives ?? 0;
      const fp = summary.totalFalsePositives ?? 0;
      const fn = summary.totalFalseNegatives ?? 0;
      const latency = `${summary.avgLatencyMs}ms / ${summary.p95LatencyMs}ms`;
      const reliability = `${summary.successfulRuns}/${summary.totalRuns} ok` + (summary.rateLimitedRuns > 0 ? ` (${summary.rateLimitedRuns} 429)` : "") + (summary.invalidOutputRuns > 0 ? ` (${summary.invalidOutputRuns} invalid)` : "");

      lines.push(
        `| **${summary.label}** | \`${summary.servingProvider}\` | ${precision} | ${recall} | **${f1}** | ${tp} | ${fp} | ${fn} | ${summary.totalHighConfidenceErrors} | ${latency} | ${reliability} |`
      );
    }
    lines.push("");
  }

  // ── Case-by-Case Breakdown ─────────────────────────────────────────────────
  lines.push("## Detailed Case Logs");
  lines.push("");

  const caseIds = Array.from(new Set(bundle.runs.map((r) => r.caseId)));
  for (const cId of caseIds) {
    const caseRuns = bundle.runs.filter((r) => r.caseId === cId);
    const caseType = caseRuns[0]?.caseType;
    lines.push(`### Case \`${cId}\` (${caseType})`);
    lines.push("");

    for (const run of caseRuns) {
      const errorNote = run.meta.error ? ` [ERROR: ${run.meta.error}]` : "";
      if (caseType === "cover" && run.coverScore) {
        lines.push(
          `- **${run.modelId}** (Run ${run.runIndex}): Work identified: ${run.coverScore.workIdentified ? "YES" : "NO"} | Title: ${run.coverScore.titleScore} | Author: ${run.coverScore.authorScore} | Latency: ${run.meta.latencyMs}ms${errorNote}`
        );
      } else if (caseType === "shelf" && run.shelfScore) {
        lines.push(
          `- **${run.modelId}** (Run ${run.runIndex}): Precision: ${run.shelfScore.precision} | Recall: ${run.shelfScore.recall} | F1: ${run.shelfScore.f1Score} (TP: ${run.shelfScore.truePositives}, FP: ${run.shelfScore.falsePositives}, FN: ${run.shelfScore.falseNegatives}) | Latency: ${run.meta.latencyMs}ms${errorNote}`
        );
      } else {
        lines.push(`- **${run.modelId}** (Run ${run.runIndex}): Failed with ${run.meta.error}: ${run.meta.errorMessage || "Unknown error"}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

function formatPercent(val?: number): string {
  if (val === undefined || isNaN(val)) return "N/A";
  return `${(val * 100).toFixed(1)}%`;
}
