import { CoverRecognitionResult, CoverCandidate } from "../types.js";
import { isTitleMatch, isAuthorMatch, isIsbnMatch, normalizeText } from "../normalizers.js";

export interface ExpectedCoverFixture {
  work: {
    title: string;
    acceptedTitles?: string[];
    author?: string;
  };
  edition?: {
    isbn13?: string;
    isbn10?: string;
    publisher?: string;
    publicationYear?: number;
  };
  notes?: string;
}

export interface CoverScoreResult {
  titleMatched: boolean;
  titleScore: number;
  authorMatched: boolean;
  authorScore: number;
  isbnMatched?: boolean;
  publisherMatched?: boolean;
  yearMatched?: boolean;
  workIdentified: boolean;
  falseCandidatesCount: number;
  highConfidenceWrongCount: number;
  confidenceWeightedScore: number;
  invalidOutput: boolean;
}

export function scoreCoverRecognition(
  result: CoverRecognitionResult | null,
  expected: ExpectedCoverFixture,
  isInvalidOutput = false
): CoverScoreResult {
  if (isInvalidOutput || !result || !result.candidates || result.candidates.length === 0) {
    return {
      titleMatched: false,
      titleScore: 0,
      authorMatched: false,
      authorScore: 0,
      workIdentified: false,
      falseCandidatesCount: 0,
      highConfidenceWrongCount: 0,
      confidenceWeightedScore: 0,
      invalidOutput: true,
    };
  }

  // Primary candidate is the first or highest-confidence candidate
  const primary = result.candidates[0];

  const titleMatch = isTitleMatch(
    primary.title,
    expected.work.title,
    expected.work.acceptedTitles || [],
    0.85
  );

  const authorMatch = isAuthorMatch(
    primary.author,
    expected.work.author,
    0.8
  );

  // ISBN matching
  let isbnMatched: boolean | undefined = undefined;
  if (expected.edition?.isbn13 || expected.edition?.isbn10) {
    const expIsbn = expected.edition.isbn13 || expected.edition.isbn10;
    const detIsbn = primary.isbn13 || primary.isbn10;
    isbnMatched = isIsbnMatch(detIsbn, expIsbn);
  }

  // Publisher & Year
  let publisherMatched: boolean | undefined = undefined;
  if (expected.edition?.publisher) {
    const normDetPub = normalizeText(primary.publisher);
    const normExpPub = normalizeText(expected.edition.publisher);
    publisherMatched = normDetPub.length > 0 && (normDetPub.includes(normExpPub) || normExpPub.includes(normDetPub));
  }

  let yearMatched: boolean | undefined = undefined;
  if (expected.edition?.publicationYear) {
    yearMatched = primary.publicationYear === expected.edition.publicationYear;
  }

  const workIdentified = titleMatch.matched && (authorMatch.matched || !expected.work.author);

  // False candidate penalty (hallucinated extra candidates)
  const falseCandidatesCount = Math.max(0, result.candidates.length - 1);

  // Calibration: Wrong high-confidence penalty
  let highConfidenceWrongCount = 0;
  let calibrationPoints = 0;

  if (workIdentified) {
    if (primary.confidence === "high") calibrationPoints += 3.0;
    else if (primary.confidence === "medium") calibrationPoints += 2.0;
    else calibrationPoints += 1.0;
  } else {
    if (primary.confidence === "high") {
      highConfidenceWrongCount++;
      calibrationPoints -= 3.0; // severe penalty for confident hallucination
    } else if (primary.confidence === "medium") {
      calibrationPoints -= 1.0;
    } else {
      calibrationPoints -= 0.5;
    }
  }

  return {
    titleMatched: titleMatch.matched,
    titleScore: Number(titleMatch.score.toFixed(3)),
    authorMatched: authorMatch.matched,
    authorScore: Number(authorMatch.score.toFixed(3)),
    isbnMatched,
    publisherMatched,
    yearMatched,
    workIdentified,
    falseCandidatesCount,
    highConfidenceWrongCount,
    confidenceWeightedScore: Number(calibrationPoints.toFixed(2)),
    invalidOutput: false,
  };
}
