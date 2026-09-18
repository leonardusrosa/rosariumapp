import { ShelfRecognitionResult, ShelfBook } from "../types.js";
import { isTitleMatch, isAuthorMatch, isIsbnMatch } from "../normalizers.js";
import { maxWeightBipartiteMatching } from "./bipartiteMatcher.js";

export interface ExpectedShelfBook {
  position?: number;
  title: string;
  acceptedTitles?: string[];
  author?: string;
  isbn13?: string;
}

export interface ExpectedShelfFixture {
  books: ExpectedShelfBook[];
  unreadableCount?: number;
  notes?: string;
}

export interface ShelfScoreResult {
  expectedCount: number;
  detectedCount: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  partialMatches: number;
  precision: number;
  recall: number;
  f1Score: number;
  highConfidenceWrongCount: number;
  confidenceWeightedScore: number;
  invalidOutput: boolean;
  matchedPairs: Array<{
    detectedTitle?: string;
    expectedTitle: string;
    weight: number;
    isPartial: boolean;
  }>;
}

export function scoreShelfRecognition(
  result: ShelfRecognitionResult | null,
  expected: ExpectedShelfFixture,
  isInvalidOutput = false
): ShelfScoreResult {
  const expectedCount = expected.books.length;

  if (isInvalidOutput || !result || !Array.isArray(result.books)) {
    return {
      expectedCount,
      detectedCount: 0,
      truePositives: 0,
      falsePositives: 0,
      falseNegatives: expectedCount,
      partialMatches: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      highConfidenceWrongCount: 0,
      confidenceWeightedScore: 0,
      invalidOutput: true,
      matchedPairs: [],
    };
  }

  const detectedBooks = result.books;
  const detectedCount = detectedBooks.length;

  if (detectedCount === 0 || expectedCount === 0) {
    const fn = expectedCount;
    return {
      expectedCount,
      detectedCount,
      truePositives: 0,
      falsePositives: 0,
      falseNegatives: fn,
      partialMatches: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      highConfidenceWrongCount: 0,
      confidenceWeightedScore: 0,
      invalidOutput: false,
      matchedPairs: [],
    };
  }

  // 1. Build N x M weight matrix for global maximum-weight bipartite matching
  const weights: number[][] = [];
  for (let i = 0; i < detectedCount; i++) {
    const det = detectedBooks[i];
    const row: number[] = [];

    for (let j = 0; j < expectedCount; j++) {
      const exp = expected.books[j];
      let w = 0;

      // Exact ISBN match dominates completely
      if (exp.isbn13 && det.isbn13 && isIsbnMatch(det.isbn13, exp.isbn13)) {
        w += 15.0;
      }

      const tMatch = isTitleMatch(det.title, exp.title, exp.acceptedTitles, 0.65);
      const aMatch = isAuthorMatch(det.author, exp.author, 0.70);

      w += tMatch.score * 7.0;
      w += aMatch.score * 3.0;

      row.push(w);
    }
    weights.push(row);
  }

  // 2. Compute globally optimal assignment
  const assignments = maxWeightBipartiteMatching(weights);

  // 3. Classify matches, partials, and false detections
  const assignedDetectedIndices = new Set<number>();
  const assignedExpectedIndices = new Set<number>();
  const matchedPairs: ShelfScoreResult["matchedPairs"] = [];

  let truePositives = 0;
  let partialMatches = 0;
  let calibrationPoints = 0;

  for (const match of assignments) {
    // A pair requires minimum weight of 4.5 (e.g. good title match)
    if (match.weight >= 4.5) {
      assignedDetectedIndices.add(match.detectedIndex);
      assignedExpectedIndices.add(match.expectedIndex);

      const det = detectedBooks[match.detectedIndex];
      const exp = expected.books[match.expectedIndex];

      const tMatch = isTitleMatch(det.title, exp.title, exp.acceptedTitles, 0.85);
      const aMatch = isAuthorMatch(det.author, exp.author, 0.75);

      const isFullMatch = tMatch.matched && (aMatch.matched || !exp.author);

      if (isFullMatch) {
        truePositives++;
        calibrationPoints += det.confidence === "high" ? 3.0 : 2.0;
      } else {
        partialMatches++;
        calibrationPoints += 1.0;
      }

      matchedPairs.push({
        detectedTitle: det.title,
        expectedTitle: exp.title,
        weight: Number(match.weight.toFixed(2)),
        isPartial: !isFullMatch,
      });
    }
  }

  const falsePositives = detectedCount - (truePositives + partialMatches);
  const falseNegatives = expectedCount - (truePositives + partialMatches);

  // Check for high-confidence false positives (hallucinations)
  let highConfidenceWrongCount = 0;
  for (let i = 0; i < detectedCount; i++) {
    if (!assignedDetectedIndices.has(i)) {
      const det = detectedBooks[i];
      if (det.confidence === "high") {
        highConfidenceWrongCount++;
        calibrationPoints -= 3.0;
      } else {
        calibrationPoints -= 1.0;
      }
    }
  }

  // Precision, Recall, and F1 based on true + partial detections
  const effectiveHits = truePositives + 0.5 * partialMatches;
  const precision = detectedCount > 0 ? effectiveHits / detectedCount : 0;
  const recall = expectedCount > 0 ? effectiveHits / expectedCount : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    expectedCount,
    detectedCount,
    truePositives,
    falsePositives: Math.max(0, falsePositives),
    falseNegatives: Math.max(0, falseNegatives),
    partialMatches,
    precision: Number(precision.toFixed(3)),
    recall: Number(recall.toFixed(3)),
    f1Score: Number(f1Score.toFixed(3)),
    highConfidenceWrongCount,
    confidenceWeightedScore: Number(calibrationPoints.toFixed(2)),
    invalidOutput: false,
    matchedPairs,
  };
}
