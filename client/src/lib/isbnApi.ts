import {
  ExternalBookMetadata,
  IsbnApiResponse,
  normalizeIsbn,
} from "@shared/bookMetadataTypes";
import { IdentifiedBookCandidate } from "@/types/bibliotheca";

export class ProviderUnavailableError extends Error {
  constructor(message = "Provedor de metadados indisponível") {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}

export function buildCandidateFromMetadata(
  normalizedIsbn: string,
  meta: ExternalBookMetadata
): IdentifiedBookCandidate {
  return {
    id: `cand-${Date.now()}`,
    selected: true,
    confidence: "high",
    needsReview: false,
    title: meta.work.title,
    originalTitle: meta.work.originalTitle,
    author: meta.work.authors.join(", "),
    originalPublicationYear: meta.work.originalPublicationYear,
    possibleEdition: {
      isbn: meta.isbn13 || meta.isbn10 || normalizedIsbn,
      publisher: meta.edition.publisher,
      publicationYear: meta.edition.publicationYear,
      language: meta.edition.language,
      pages: meta.edition.pages,
      format: meta.edition.format,
      translator: meta.edition.translator,
    },
    remoteCoverUrl: meta.cover?.url,
    providerMeta: meta.providerMeta,
  };
}

export async function fetchIsbnMetadata(rawIsbn: string): Promise<ExternalBookMetadata | null> {
  const normalized = normalizeIsbn(rawIsbn);

  try {
    const res = await fetch(`/api/bibliotheca/isbn/${encodeURIComponent(normalized)}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (res.status === 503) {
      throw new ProviderUnavailableError("Serviço de metadados temporariamente indisponível.");
    }

    if (!res.ok) {
      throw new ProviderUnavailableError(`Falha na consulta (${res.status}).`);
    }

    const data = (await res.json()) as IsbnApiResponse;

    if ("error" in data && data.error === "provider_unavailable") {
      throw new ProviderUnavailableError("Serviço de metadados temporariamente indisponível.");
    }

    if ("found" in data && data.found) {
      return data.metadata;
    }

    return null;
  } catch (err) {
    if (err instanceof ProviderUnavailableError) {
      throw err;
    }
    // Network or AbortSignal timeout
    throw new ProviderUnavailableError(
      "Não foi possível conectar ao catálogo. Verifique sua conexão e tente novamente."
    );
  }
}
