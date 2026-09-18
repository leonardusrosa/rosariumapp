import { VisionModelConfig } from "./types.js";

/**
 * Standard registry of candidate vision models for benchmarking.
 * All models have explicit capabilities, pinned provider routes, and pricing snapshots.
 */
export const BENCHMARK_MODELS: VisionModelConfig[] = [
  // ── Deterministic Mock (CI / Smoke Tests) ──────────────────────────────────
  {
    id: "mock/deterministic-vision",
    label: "Mock Deterministic Vision Engine",
    gateway: "mock",
    model: "deterministic-vision-v1",
    enabled: true,
    capabilities: {
      vision: true,
      structuredOutput: "json_schema",
      usageReporting: true,
    },
    privacy: {
      provider: "local-mock",
      dataCollection: "deny",
      zeroDataRetention: true,
    },
    pricing: {
      inputPerMillion: 0,
      outputPerMillion: 0,
      currency: "USD",
      capturedAt: "2026-09-18",
      source: "local-execution",
    },
  },

  // ── OpenRouter Candidate 1: Qwen 2.5 VL 72B (Pinned to Together) ───────────
  {
    id: "openrouter/qwen-2.5-vl-72b-together",
    label: "Qwen 2.5 VL 72B (Together)",
    gateway: "openrouter",
    model: "qwen/qwen-2.5-vl-72b-instruct",
    providerRoute: {
      provider: "Together",
      allowFallbacks: false,
    },
    enabled: true,
    apiKeyEnv: "OPENROUTER_API_KEY",
    capabilities: {
      vision: true,
      structuredOutput: "json_object",
      usageReporting: true,
    },
    privacy: {
      provider: "Together",
      dataCollection: "deny",
      zeroDataRetention: true,
    },
    pricing: {
      inputPerMillion: 0.40,
      outputPerMillion: 0.40,
      currency: "USD",
      capturedAt: "2026-09-18",
      source: "https://openrouter.ai/models/qwen/qwen-2.5-vl-72b-instruct",
    },
  },

  // ── OpenRouter Candidate 2: Llama 3.2 11B Vision (Pinned to Fireworks) ──────
  {
    id: "openrouter/llama-3.2-11b-vision-fireworks",
    label: "Llama 3.2 11B Vision (Fireworks)",
    gateway: "openrouter",
    model: "meta-llama/llama-3.2-11b-vision-instruct",
    providerRoute: {
      provider: "Fireworks",
      allowFallbacks: false,
    },
    enabled: true,
    apiKeyEnv: "OPENROUTER_API_KEY",
    capabilities: {
      vision: true,
      structuredOutput: "json_object",
      usageReporting: true,
    },
    privacy: {
      provider: "Fireworks",
      dataCollection: "deny",
    },
    pricing: {
      inputPerMillion: 0.055,
      outputPerMillion: 0.055,
      currency: "USD",
      capturedAt: "2026-09-18",
      source: "https://openrouter.ai/models/meta-llama/llama-3.2-11b-vision-instruct",
    },
  },

  // ── NVIDIA NIM Candidate 1: Llama 3.2 11B Vision ───────────────────────────
  {
    id: "nvidia/llama-3.2-11b-vision",
    label: "NVIDIA NIM Llama 3.2 11B Vision",
    gateway: "nvidia",
    model: "meta/llama-3.2-11b-vision-instruct",
    enabled: true,
    apiKeyEnv: "NVIDIA_API_KEY",
    baseUrl: "https://integrate.api.nvidia.com/v1/chat/completions",
    capabilities: {
      vision: true,
      structuredOutput: "json_object",
      usageReporting: true,
    },
    privacy: {
      provider: "NVIDIA",
      dataCollection: "deny",
    },
    pricing: {
      inputPerMillion: 0,
      outputPerMillion: 0,
      currency: "USD",
      capturedAt: "2026-09-18",
      source: "https://build.nvidia.com/explore/discover",
    },
  },
];

export function getBenchmarkModels(options?: {
  mode?: "all" | "mock" | "live";
  modelId?: string;
}): VisionModelConfig[] {
  let models = BENCHMARK_MODELS.filter((m) => m.enabled);

  if (options?.mode === "mock") {
    models = models.filter((m) => m.gateway === "mock");
  } else if (options?.mode === "live") {
    models = models.filter((m) => m.gateway !== "mock");
  }

  if (options?.modelId) {
    models = models.filter((m) => m.id === options.modelId);
  }

  return models;
}
