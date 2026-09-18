import { maxWeightBipartiteMatching } from "../server/lib/vision/scoring/bipartiteMatcher.js";
import { isTitleMatch, isAuthorMatch, normalizeText } from "../server/lib/vision/normalizers.js";
import { parseAndValidateCover, parseAndValidateShelf, cleanJsonText } from "../server/lib/vision/schemas.js";
import { scoreCoverRecognition } from "../server/lib/vision/scoring/coverScorer.js";
import { scoreShelfRecognition } from "../server/lib/vision/scoring/shelfScorer.js";
import { MockVisionProvider } from "../server/lib/vision/adapters/MockVisionProvider.js";

let passed = 0;
let failed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    console.log(`[PASS] ${description}`);
    passed++;
  } else {
    console.error(`[FAIL] ${description}`);
    failed++;
    process.exitCode = 1;
  }
}

console.log("=== BIBLIOTHECA PASS 7 VISION LAYER & SCORING VERIFICATION ===\n");

// ── 1. Text Normalization & Conservative Title Matching ──────────────────────
console.log("--- 1. Text Normalization & Accepted Aliases ---");

assert(normalizeText("Fiódor Dostoiévski") === "fiodor dostoievski", "Strips accents & diacritics");
assert(normalizeText("O Senhor dos Anéis: As Duas Torres!") === "o senhor dos aneis as duas torres", "Removes punctuation");

const aliasMatch = isTitleMatch(
  "Crime and Punishment",
  "Crime e Castigo",
  ["Crime and Punishment", "Prestuplyeniye i nakazaniye"]
);
assert(aliasMatch.matched === true && aliasMatch.score === 1.0, "Matches human-verified acceptedTitle alias with score 1.0");

const nonMatch = isTitleMatch("The Brothers Karamazov", "Crime e Castigo", ["Crime and Punishment"]);
assert(!nonMatch.matched, "Rejects semantically different title");

// ── 2. Maximum-Weight Bipartite Shelf Matching ───────────────────────────────
console.log("\n--- 2. Globally Optimal Bipartite Shelf Matching ---");

// Case: Two detected books, one exact match and one partial match for similar titles
// Expected: [Book A: "The Lord of the Rings 1", Book B: "The Lord of the Rings 2"]
// Detected: [Det 0: "The Lord of the Rings", Det 1: "The Lord of the Rings 1"]
// A greedy matcher might match Det 0 to Book A, leaving Det 1 to fail or partially match Book B.
// Kuhn-Munkres should globally match Det 1 -> Book A (exact) and Det 0 -> Book B.
const weights = [
  [8.0, 7.0], // Det 0 has similarity 8 to A, 7 to B
  [10.0, 6.0], // Det 1 has similarity 10 to A, 6 to B
];
const matching = maxWeightBipartiteMatching(weights);

// Optimal assignment: Det 1 -> Exp 0 (weight 10), Det 0 -> Exp 1 (weight 7). Total = 17.
// Greedy might pick Det 0 -> Exp 0 (8) then Det 1 -> Exp 1 (6) = 14 (suboptimal).
const det1Match = matching.find((m) => m.detectedIndex === 1);
const det0Match = matching.find((m) => m.detectedIndex === 0);

assert(det1Match?.expectedIndex === 0, "Globally optimal assignment assigned Det 1 to Exp 0");
assert(det0Match?.expectedIndex === 1, "Globally optimal assignment assigned Det 0 to Exp 1");

// ── 3. Structured Output & Code Fence Stripping ──────────────────────────────
console.log("\n--- 3. Structured Output & Code Fence Stripping ---");

const rawFenced = "```json\n{\n  \"candidates\": [{\n    \"title\": \"Test Book\",\n    \"confidence\": \"high\"\n  }]\n}\n```";
const parsedFenced = parseAndValidateCover(rawFenced);
assert(parsedFenced.compliance === "repaired_code_fence", "Detects and strips markdown code fence as repaired_code_fence");
assert(parsedFenced.data.candidates[0].title === "Test Book", "Extracted valid title from code-fenced output");

let invalidSyntaxCaught = false;
try {
  parseAndValidateCover("{ title: unquoted_json }");
} catch (e: any) {
  invalidSyntaxCaught = e.compliance === "invalid_json";
}
assert(invalidSyntaxCaught, "Malformed JSON syntax recorded as invalid_json (no LLM silent repair)");

// ── 4. Precision, Recall & Shelf Scoring ─────────────────────────────────────
console.log("\n--- 4. Shelf Scoring (Precision, Recall, F1) ---");

const expectedShelf = {
  books: [
    { title: "Book A", author: "Author A" },
    { title: "Book B", author: "Author B" },
    { title: "Book C", author: "Author C" },
  ],
};

const detectedShelf = {
  books: [
    { title: "Book A", author: "Author A", confidence: "high" as const, needsReview: false },
    { title: "Book B", author: "Author B", confidence: "high" as const, needsReview: false },
    { title: "Completely Hallucinated Book", author: "Fake", confidence: "high" as const, needsReview: false },
  ],
};

const shelfScore = scoreShelfRecognition(detectedShelf, expectedShelf);
assert(shelfScore.truePositives === 2, "Accurately counted 2 True Positives");
assert(shelfScore.falsePositives === 1, "Accurately counted 1 False Positive (hallucination)");
assert(shelfScore.falseNegatives === 1, "Accurately counted 1 False Negative (missed Book C)");
assert(shelfScore.highConfidenceWrongCount === 1, "Flagged 1 high-confidence false positive error");
assert(shelfScore.precision === 0.667, `Precision matches expected (0.667): ${shelfScore.precision}`);
assert(shelfScore.recall === 0.667, `Recall matches expected (0.667): ${shelfScore.recall}`);
assert(shelfScore.f1Score === 0.667, `F1 score matches expected (0.667): ${shelfScore.f1Score}`);

// ── 5. Rate Limit vs Failure Distinction ─────────────────────────────────────
console.log("\n--- 5. Rate Limit vs Recognition Failure Distinction ---");

const rateLimitedCover = scoreCoverRecognition(null, { work: { title: "Any" } }, true);
assert(rateLimitedCover.invalidOutput === true, "Invalid/failed output flagged");
assert(rateLimitedCover.highConfidenceWrongCount === 0, "Rate-limited/failed request is NEVER counted as hallucination");

// ── 6. Deterministic Mock Provider Stability ─────────────────────────────────
console.log("\n--- 6. Mock Provider Stability ---");

const mockProvider = new MockVisionProvider();
const run1 = await mockProvider.recognizeCover({ type: "buffer", data: Buffer.from("test"), filename: "case-001" });
const run2 = await mockProvider.recognizeCover({ type: "buffer", data: Buffer.from("test"), filename: "case-001" });

assert(JSON.stringify(run1) === JSON.stringify(run2), "MockVisionProvider yields byte-for-byte identical output across calls");

console.log(`\n=================================================`);
console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`=================================================`);
