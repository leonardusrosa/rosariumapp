/**
 * Provider-neutral types and interfaces for the Vision recognition & benchmark layer.
 */

export interface VisionImageInput {
  type: "file_path" | "buffer" | "base64";
  data: string | Buffer;
  mimeType?: string;
  filename?: string;
}

export interface VisionCapabilities {
  vision: boolean;
  structuredOutput: "json_schema" | "json_object" | "prompt_only";
  usageReporting: boolean;
}

export interface VisionPrivacyConfig {
  provider?: string;
  dataCollection?: "allow" | "deny" | "unknown";
  zeroDataRetention?: boolean;
}

export interface VisionPricingSnapshot {
  inputPerMillion?: number;
  outputPerMillion?: number;
  currency: "USD";
  capturedAt: string;
  source?: string;
}

export interface VisionModelConfig {
  id: string;
  label: string;
  gateway: "openrouter" | "nvidia" | "openai" | "mock" | string;
  model: string;
  providerRoute?: {
    provider?: string;
    allowFallbacks: boolean;
  };
  enabled: boolean;
  baseUrl?: string;
  apiKeyEnv?: string;
  capabilities: VisionCapabilities;
  privacy?: VisionPrivacyConfig;
  pricing?: VisionPricingSnapshot;
}

export interface CoverCandidate {
  title: string;
  author?: string;
  isbn10?: string;
  isbn13?: string;
  publisher?: string;
  publicationYear?: number;
  confidence: "high" | "medium" | "low";
  evidence?: string[];
}

export interface CoverRecognitionResult {
  candidates: CoverCandidate[];
  warnings?: string[];
}

export interface ShelfBook {
  position?: number;
  title?: string;
  author?: string;
  visibleText?: string[];
  isbn10?: string;
  isbn13?: string;
  confidence: "high" | "medium" | "low";
  needsReview: boolean;
}

export interface ShelfRecognitionResult {
  books: ShelfBook[];
  unreadableRegions?: number;
  warnings?: string[];
}

export type StructuredOutputCompliance =
  | "valid"
  | "invalid_json"
  | "schema_mismatch"
  | "repaired_code_fence";

export type VisionFailureType =
  | "rate_limited"
  | "timeout"
  | "invalid_output"
  | "request_failed"
  | "model_unavailable";

export interface ProviderRecognitionMeta {
  gateway: string;
  model: string;
  servingProvider?: string;
  promptVersion: string;
  latencyMs: number;
  tokensUsed?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
  estimatedCostUsd?: number;
  structuredOutputCompliance: StructuredOutputCompliance;
  error?: VisionFailureType;
  errorMessage?: string;
}

export interface RecognitionOptions {
  promptVersion?: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface VisionRecognitionProvider {
  readonly id: string;
  recognizeCover(
    input: VisionImageInput,
    options?: RecognitionOptions
  ): Promise<{ result: CoverRecognitionResult | null; meta: ProviderRecognitionMeta }>;

  recognizeShelf(
    input: VisionImageInput,
    options?: RecognitionOptions
  ): Promise<{ result: ShelfRecognitionResult | null; meta: ProviderRecognitionMeta }>;
}
