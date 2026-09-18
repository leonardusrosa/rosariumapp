import fs from "fs";
import {
  VisionRecognitionProvider,
  VisionModelConfig,
  VisionImageInput,
  RecognitionOptions,
  CoverRecognitionResult,
  ShelfRecognitionResult,
  ProviderRecognitionMeta,
  VisionFailureType,
} from "../types.js";
import { getCoverPrompt, getShelfPrompt } from "../prompts.js";
import { parseAndValidateCover, parseAndValidateShelf } from "../schemas.js";

export class OpenAICompatibleVisionAdapter implements VisionRecognitionProvider {
  readonly id: string;
  private readonly config: VisionModelConfig;

  constructor(config: VisionModelConfig) {
    this.id = config.id;
    this.config = config;
  }

  async recognizeCover(
    input: VisionImageInput,
    options?: RecognitionOptions
  ): Promise<{ result: CoverRecognitionResult | null; meta: ProviderRecognitionMeta }> {
    const { systemPrompt, userPrompt, version } = getCoverPrompt(options?.promptVersion);
    return this.executeRecognition(
      input,
      systemPrompt,
      userPrompt,
      version,
      (raw) => parseAndValidateCover(raw),
      options
    );
  }

  async recognizeShelf(
    input: VisionImageInput,
    options?: RecognitionOptions
  ): Promise<{ result: ShelfRecognitionResult | null; meta: ProviderRecognitionMeta }> {
    const { systemPrompt, userPrompt, version } = getShelfPrompt(options?.promptVersion);
    return this.executeRecognition(
      input,
      systemPrompt,
      userPrompt,
      version,
      (raw) => parseAndValidateShelf(raw),
      options
    );
  }

  private async executeRecognition<T>(
    input: VisionImageInput,
    systemPrompt: string,
    userPrompt: string,
    promptVersion: string,
    validator: (raw: string) => { data: T; compliance: any },
    options?: RecognitionOptions
  ): Promise<{ result: T | null; meta: ProviderRecognitionMeta }> {
    const start = Date.now();
    const meta: ProviderRecognitionMeta = {
      gateway: this.config.gateway,
      model: this.config.model,
      promptVersion,
      latencyMs: 0,
      structuredOutputCompliance: "valid",
    };

    const apiKey = this.resolveApiKey();
    if (!apiKey && this.config.gateway !== "mock") {
      meta.error = "request_failed";
      meta.errorMessage = `Missing API key for environment variable ${this.config.apiKeyEnv || "API_KEY"}`;
      meta.latencyMs = Date.now() - start;
      return { result: null, meta };
    }

    let dataUrl: string;
    try {
      dataUrl = this.formatImageToDataUrl(input);
    } catch (err: any) {
      meta.error = "request_failed";
      meta.errorMessage = `Failed to process image input: ${err.message}`;
      meta.latencyMs = Date.now() - start;
      return { result: null, meta };
    }

    const endpoint = this.resolveEndpoint();
    const payload = this.buildRequestPayload(systemPrompt, userPrompt, dataUrl);

    try {
      const controller = new AbortController();
      const timeoutMs = options?.timeoutMs ?? 45000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...(this.config.gateway === "openrouter"
            ? {
                "HTTP-Referer": "https://bibliotheca.local",
                "X-Title": "Bibliotheca Vision Benchmark",
              }
            : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      meta.latencyMs = Date.now() - start;

      // Extract serving provider header where available
      const servingHeader =
        response.headers.get("x-openrouter-provider") ||
        response.headers.get("x-serving-provider");
      if (servingHeader) meta.servingProvider = servingHeader;

      if (response.status === 429) {
        meta.error = "rate_limited";
        meta.errorMessage = "Rate limit exceeded from provider gateway (HTTP 429)";
        return { result: null, meta };
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        meta.error = response.status >= 500 ? "model_unavailable" : "request_failed";
        meta.errorMessage = `Provider returned HTTP ${response.status}: ${errorText.slice(0, 200)}`;
        return { result: null, meta };
      }

      const resJson = (await response.json()) as any;
      if (resJson?.provider) meta.servingProvider = resJson.provider;

      // Token usage extraction
      if (resJson?.usage) {
        meta.tokensUsed = {
          prompt: resJson.usage.prompt_tokens,
          completion: resJson.usage.completion_tokens,
          total: resJson.usage.total_tokens,
        };
        meta.estimatedCostUsd = this.calculateCost(meta.tokensUsed);
      }

      const rawContent = resJson?.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        meta.error = "invalid_output";
        meta.errorMessage = "Response choice content was empty or non-string";
        meta.structuredOutputCompliance = "invalid_json";
        return { result: null, meta };
      }

      // Validate structured output (no LLM repair)
      try {
        const validated = validator(rawContent);
        meta.structuredOutputCompliance = validated.compliance;
        return { result: validated.data, meta };
      } catch (valErr: any) {
        meta.error = "invalid_output";
        meta.errorMessage = valErr.message;
        meta.structuredOutputCompliance = valErr.compliance || "schema_mismatch";
        return { result: null, meta };
      }
    } catch (err: any) {
      meta.latencyMs = Date.now() - start;
      if (err.name === "AbortError") {
        meta.error = "timeout";
        meta.errorMessage = "Request timed out awaiting model response";
      } else {
        meta.error = "request_failed";
        meta.errorMessage = err.message || "Network request failed";
      }
      return { result: null, meta };
    }
  }

  private buildRequestPayload(systemPrompt: string, userPrompt: string, dataUrl: string): any {
    const payload: any = {
      model: this.config.model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      temperature: 0.1,
    };

    // Pinned routing for OpenRouter
    if (this.config.gateway === "openrouter" && this.config.providerRoute?.provider) {
      payload.provider = {
        order: [this.config.providerRoute.provider],
        allow_fallbacks: this.config.providerRoute.allowFallbacks ?? false,
      };
    }

    // Structured output mode
    if (this.config.capabilities.structuredOutput === "json_object") {
      payload.response_format = { type: "json_object" };
    }

    return payload;
  }

  private formatImageToDataUrl(input: VisionImageInput): string {
    let buffer: Buffer;
    let mime = input.mimeType || "image/jpeg";

    if (input.type === "file_path") {
      const filePath = String(input.data);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Benchmark image file not found: ${filePath}`);
      }
      buffer = fs.readFileSync(filePath);
      if (filePath.endsWith(".png")) mime = "image/png";
      else if (filePath.endsWith(".webp")) mime = "image/webp";
    } else if (input.type === "buffer") {
      buffer = input.data as Buffer;
    } else if (input.type === "base64") {
      return `data:${mime};base64,${input.data}`;
    } else {
      throw new Error(`Unsupported VisionImageInput type: ${(input as any).type}`);
    }

    return `data:${mime};base64,${buffer.toString("base64")}`;
  }

  private resolveApiKey(): string {
    const envVar = this.config.apiKeyEnv || (this.config.gateway === "openrouter" ? "OPENROUTER_API_KEY" : "NVIDIA_API_KEY");
    return process.env[envVar] || "";
  }

  private resolveEndpoint(): string {
    if (this.config.baseUrl) return this.config.baseUrl;
    if (this.config.gateway === "openrouter") return "https://openrouter.ai/api/v1/chat/completions";
    if (this.config.gateway === "nvidia") return "https://integrate.api.nvidia.com/v1/chat/completions";
    return "https://api.openai.com/v1/chat/completions";
  }

  private calculateCost(tokens?: { prompt?: number; completion?: number }): number | undefined {
    if (!tokens || !this.config.pricing) return undefined;
    const { inputPerMillion, outputPerMillion } = this.config.pricing;
    if (inputPerMillion === undefined || outputPerMillion === undefined) return undefined;

    const inputCost = ((tokens.prompt ?? 0) / 1_000_000) * inputPerMillion;
    const outputCost = ((tokens.completion ?? 0) / 1_000_000) * outputPerMillion;
    return Number((inputCost + outputCost).toFixed(6));
  }
}
