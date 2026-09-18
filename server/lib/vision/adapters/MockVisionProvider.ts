import {
  VisionRecognitionProvider,
  VisionImageInput,
  RecognitionOptions,
  CoverRecognitionResult,
  ShelfRecognitionResult,
  ProviderRecognitionMeta,
} from "../types.js";
import { COVER_PROMPT_VERSION, SHELF_PROMPT_VERSION } from "../prompts.js";

/**
 * Truly deterministic mock provider for CI testing and benchmark infrastructure verification.
 * Produces byte-for-byte stable results without randomness.
 */
export class MockVisionProvider implements VisionRecognitionProvider {
  readonly id: string;

  constructor(id = "mock/deterministic-vision-v1") {
    this.id = id;
  }

  async recognizeCover(
    input: VisionImageInput,
    options?: RecognitionOptions
  ): Promise<{ result: CoverRecognitionResult | null; meta: ProviderRecognitionMeta }> {
    const meta: ProviderRecognitionMeta = {
      gateway: "mock",
      model: "deterministic-vision-v1",
      servingProvider: "mock-engine",
      promptVersion: options?.promptVersion || COVER_PROMPT_VERSION,
      latencyMs: 145,
      tokensUsed: { prompt: 820, completion: 120, total: 940 },
      estimatedCostUsd: 0.00015,
      structuredOutputCompliance: "valid",
    };

    // Predefined deterministic responses mapped to smoke cases
    const filename = String(input.filename || input.data || "").toLowerCase();

    if (filename.includes("cover-001") || filename.includes("case-001") || filename.includes("crime")) {
      return {
        result: {
          candidates: [
            {
              title: "Crime and Punishment",
              author: "Fyodor Dostoyevsky",
              isbn13: "9780140449136",
              publisher: "Penguin Classics",
              publicationYear: 2003,
              confidence: "high",
              evidence: ["Clearly legible serif title on front cover", "Penguin logo bottom left"],
            },
          ],
          warnings: [],
        },
        meta,
      };
    }

    if (filename.includes("case-002") || filename.includes("dom-casmurro")) {
      return {
        result: {
          candidates: [
            {
              title: "Dom Casmurro",
              author: "Machado de Assis",
              isbn13: "9788535902778",
              publisher: "Companhia das Letras",
              publicationYear: 2019,
              confidence: "high",
              evidence: ["Title typography centered", "Publisher logo visible"],
            },
          ],
        },
        meta,
      };
    }

    // Default deterministic fallback
    return {
      result: {
        candidates: [
          {
            title: "The Republic",
            author: "Plato",
            confidence: "medium",
            evidence: ["Classical title layout"],
          },
        ],
      },
      meta,
    };
  }

  async recognizeShelf(
    input: VisionImageInput,
    options?: RecognitionOptions
  ): Promise<{ result: ShelfRecognitionResult | null; meta: ProviderRecognitionMeta }> {
    const meta: ProviderRecognitionMeta = {
      gateway: "mock",
      model: "deterministic-vision-v1",
      servingProvider: "mock-engine",
      promptVersion: options?.promptVersion || SHELF_PROMPT_VERSION,
      latencyMs: 310,
      tokensUsed: { prompt: 1450, completion: 280, total: 1730 },
      estimatedCostUsd: 0.00035,
      structuredOutputCompliance: "valid",
    };

    // Deterministic shelf candidates
    return {
      result: {
        books: [
          {
            position: 1,
            title: "O Senhor dos Anéis",
            author: "J.R.R. Tolkien",
            confidence: "high",
            needsReview: false,
          },
          {
            position: 2,
            title: "Middlemarch",
            author: "George Eliot",
            confidence: "high",
            needsReview: false,
          },
          {
            position: 3,
            title: "Moby Dick",
            author: "Herman Melville",
            confidence: "high",
            needsReview: false,
          },
          {
            position: 4,
            title: "O Nome da Rosa",
            author: "Umberto Eco",
            confidence: "medium",
            needsReview: true,
          },
          {
            position: 5,
            title: "Ensaio sobre a Cegueira",
            author: "José Saramago",
            confidence: "medium",
            needsReview: true,
          },
        ],
        unreadableRegions: 1,
        warnings: ["One thin spine on far right was partially shadowed"],
      },
      meta,
    };
  }
}
