import { normalizeIsbn } from "../../../shared/bookMetadataTypes.js";

/**
 * Deterministic text normalization for scoring model outputs against ground truth.
 */

export function normalizeText(text?: string | null): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Strip diacritics
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation, replace with space
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

/**
 * Normalizes author names, reordering "Last, First" to "First Last".
 */
export function normalizeAuthor(author?: string | null): string {
  if (!author) return "";
  let clean = author.trim();
  if (clean.includes(",")) {
    const parts = clean.split(",").map((p) => p.trim());
    if (parts.length === 2) {
      clean = `${parts[1]} ${parts[0]}`;
    }
  }
  return normalizeText(clean);
}

/**
 * Computes token-level Sørensen–Dice coefficient between two strings.
 */
export function tokenDiceSimilarity(a: string, b: string): number {
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  if (!normA || !normB) return 0;
  if (normA === normB) return 1;

  const wordsA = new Set(normA.split(" ").filter((w) => w.length > 1));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length > 1));

  if (wordsA.size === 0 || wordsB.size === 0) {
    return normA === normB ? 1 : 0;
  }

  let intersection = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) intersection++;
  });

  return (2 * intersection) / (wordsA.size + wordsB.size);
}

/**
 * Checks if a detected title matches an expected title or any accepted title alias.
 */
export function isTitleMatch(
  detected?: string | null,
  expected?: string | null,
  acceptedTitles: string[] = [],
  threshold = 0.85
): { matched: boolean; score: number; matchedTitle?: string } {
  if (!detected || !expected) {
    return { matched: false, score: 0 };
  }

  const targets = [expected, ...acceptedTitles];
  let bestScore = 0;
  let bestTarget: string | undefined;

  for (const target of targets) {
    const normDetected = normalizeText(detected);
    const normTarget = normalizeText(target);

    if (normDetected === normTarget) {
      return { matched: true, score: 1.0, matchedTitle: target };
    }

    const dice = tokenDiceSimilarity(normDetected, normTarget);
    if (dice > bestScore) {
      bestScore = dice;
      bestTarget = target;
    }
  }

  return {
    matched: bestScore >= threshold,
    score: bestScore,
    matchedTitle: bestScore >= threshold ? bestTarget : undefined,
  };
}

/**
 * Checks if a detected author matches the expected author.
 */
export function isAuthorMatch(
  detected?: string | null,
  expected?: string | null,
  threshold = 0.8
): { matched: boolean; score: number } {
  if (!detected && !expected) return { matched: true, score: 1.0 };
  if (!detected || !expected) return { matched: false, score: 0 };

  const normDetected = normalizeAuthor(detected);
  const normExpected = normalizeAuthor(expected);

  if (normDetected === normExpected) return { matched: true, score: 1.0 };

  const dice = tokenDiceSimilarity(normDetected, normExpected);
  return {
    matched: dice >= threshold,
    score: dice,
  };
}

/**
 * Checks if detected ISBN matches expected ISBN.
 */
export function isIsbnMatch(detected?: string | null, expected?: string | null): boolean {
  if (!detected || !expected) return false;
  return normalizeIsbn(detected) === normalizeIsbn(expected);
}
