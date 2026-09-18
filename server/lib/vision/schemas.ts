import { z } from "zod";
import {
  CoverRecognitionResult,
  ShelfRecognitionResult,
  StructuredOutputCompliance,
} from "./types.js";

// ─── Single Cover Schemas ───────────────────────────────────────────────────

export const CoverCandidateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().nullable().optional().transform((v) => v || undefined),
  isbn10: z.string().nullable().optional().transform((v) => v || undefined),
  isbn13: z.string().nullable().optional().transform((v) => v || undefined),
  publisher: z.string().nullable().optional().transform((v) => v || undefined),
  publicationYear: z.number().int().positive().nullable().optional().transform((v) => v || undefined),
  confidence: z.enum(["high", "medium", "low"]).default("medium"),
  evidence: z.array(z.string()).optional(),
});

export const CoverRecognitionSchema = z.object({
  candidates: z.array(CoverCandidateSchema).min(1, "At least one candidate is required"),
  warnings: z.array(z.string()).optional(),
});

// ─── Shelf Schemas ──────────────────────────────────────────────────────────

export const ShelfBookSchema = z.object({
  position: z.number().int().positive().optional(),
  title: z.string().nullable().optional().transform((v) => v || undefined),
  author: z.string().nullable().optional().transform((v) => v || undefined),
  visibleText: z.array(z.string()).optional(),
  isbn10: z.string().nullable().optional().transform((v) => v || undefined),
  isbn13: z.string().nullable().optional().transform((v) => v || undefined),
  confidence: z.enum(["high", "medium", "low"]).default("medium"),
  needsReview: z.boolean().default(true),
});

export const ShelfRecognitionSchema = z.object({
  books: z.array(ShelfBookSchema),
  unreadableRegions: z.number().int().nonnegative().optional(),
  warnings: z.array(z.string()).optional(),
});

// ─── Text Cleaning & Code Fence Extraction ───────────────────────────────────

export interface CleanedJsonResult {
  cleanedText: string;
  hadCodeFence: boolean;
}

export function cleanJsonText(raw: string): CleanedJsonResult {
  let text = raw.trim();
  let hadCodeFence = false;

  // Match ```json ... ``` or ``` ... ```
  const codeFenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (codeFenceMatch) {
    text = codeFenceMatch[1].trim();
    hadCodeFence = true;
  } else if (text.startsWith("```") && text.endsWith("```")) {
    text = text.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
    hadCodeFence = true;
  }

  return { cleanedText: text, hadCodeFence };
}

// ─── Parse & Validate Helpers ───────────────────────────────────────────────

export function parseAndValidateCover(rawText: string): {
  data: CoverRecognitionResult;
  compliance: StructuredOutputCompliance;
} {
  const { cleanedText, hadCodeFence } = cleanJsonText(rawText);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (err: any) {
    const error = new Error(`Invalid JSON syntax: ${err.message}`);
    (error as any).compliance = "invalid_json";
    throw error;
  }

  const result = CoverRecognitionSchema.safeParse(parsed);
  if (!result.success) {
    const error = new Error(`Cover schema mismatch: ${result.error.message}`);
    (error as any).compliance = "schema_mismatch";
    throw error;
  }

  return {
    data: result.data,
    compliance: hadCodeFence ? "repaired_code_fence" : "valid",
  };
}

export function parseAndValidateShelf(rawText: string): {
  data: ShelfRecognitionResult;
  compliance: StructuredOutputCompliance;
} {
  const { cleanedText, hadCodeFence } = cleanJsonText(rawText);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (err: any) {
    const error = new Error(`Invalid JSON syntax: ${err.message}`);
    (error as any).compliance = "invalid_json";
    throw error;
  }

  const result = ShelfRecognitionSchema.safeParse(parsed);
  if (!result.success) {
    const error = new Error(`Shelf schema mismatch: ${result.error.message}`);
    (error as any).compliance = "schema_mismatch";
    throw error;
  }

  return {
    data: result.data,
    compliance: hadCodeFence ? "repaired_code_fence" : "valid",
  };
}
