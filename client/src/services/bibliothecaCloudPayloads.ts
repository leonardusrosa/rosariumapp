import { AddBookParams } from "@/contexts/bibliothecaTypes";
import { GeneratedCoverDef } from "@/types/bibliotheca";
import { normalizeIsbn } from "@shared/bookMetadataTypes";

const DEFAULT_COVER: GeneratedCoverDef = {
  type: "generated",
  style: "minimal",
  primaryColor: "#1c2024",
  accentColor: "#c9a35e",
  textColor: "#f3eee5",
};

export function buildAddBookRpcPayload(params: AddBookParams) {
  const ts = Date.now();
  const workId = params.existingWorkId || `w-cloud-${ts}-${Math.random().toString(36).substr(2, 4)}`;
  const editionId = `ed-cloud-${ts}-${Math.random().toString(36).substr(2, 4)}`;
  const libraryItemId = `item-cloud-${ts}-${Math.random().toString(36).substr(2, 4)}`;

  return {
    workId,
    libraryItemId,
    p_work: {
      id: workId,
      title: params.workDraft.title,
      originalTitle: params.workDraft.originalTitle || null,
      author: params.workDraft.author,
      originalPublicationYear: params.workDraft.originalPublicationYear || null,
    },
    p_edition: {
      id: editionId,
      isbn: params.editionDraft.isbn ? normalizeIsbn(params.editionDraft.isbn) : null,
      publisher: params.editionDraft.publisher || null,
      publicationYear: params.editionDraft.publicationYear || null,
      translator: params.editionDraft.translator || null,
      language: params.editionDraft.language || null,
      pages: params.editionDraft.pages || null,
      format: params.editionDraft.format || null,
      cover: params.editionDraft.cover || DEFAULT_COVER,
      providerMeta: params.editionDraft.providerMeta || null,
    },
    p_library_item: {
      id: libraryItemId,
      readingStatus: params.readingStatus,
    },
    p_reading_record: params.readingStatus === "read"
      ? { id: `rr-cloud-${ts}`, startedAt: null, finishedAt: new Date().toISOString() }
      : null,
    p_queue_item: params.addToQueue
      ? { id: `rq-cloud-${ts}`, position: 999 }
      : null,
  };
}

export function buildAddBooksBatchRpcPayload(paramsList: AddBookParams[]) {
  const ts = Date.now();

  return paramsList.map((params, idx) => {
    const itemTs = ts + idx;
    const workId = params.existingWorkId || `w-cloud-${itemTs}-${Math.random().toString(36).substr(2, 4)}`;
    const editionId = `ed-cloud-${itemTs}-${Math.random().toString(36).substr(2, 4)}`;
    const libraryItemId = `item-cloud-${itemTs}-${Math.random().toString(36).substr(2, 4)}`;

    return {
      work: {
        id: workId,
        title: params.workDraft.title,
        originalTitle: params.workDraft.originalTitle || null,
        author: params.workDraft.author,
        originalPublicationYear: params.workDraft.originalPublicationYear || null,
      },
      edition: {
        id: editionId,
        isbn: params.editionDraft.isbn ? normalizeIsbn(params.editionDraft.isbn) : null,
        publisher: params.editionDraft.publisher || null,
        publicationYear: params.editionDraft.publicationYear || null,
        translator: params.editionDraft.translator || null,
        language: params.editionDraft.language || null,
        pages: params.editionDraft.pages || null,
        format: params.editionDraft.format || null,
        cover: params.editionDraft.cover || DEFAULT_COVER,
        providerMeta: params.editionDraft.providerMeta || null,
      },
      libraryItem: {
        id: libraryItemId,
        readingStatus: params.readingStatus,
      },
      readingRecord: params.readingStatus === "read"
        ? { id: `rr-cloud-${itemTs}`, startedAt: null, finishedAt: new Date().toISOString() }
        : null,
      queueItem: params.addToQueue
        ? { id: `rq-cloud-${itemTs}`, position: idx + 1 }
        : null,
    };
  });
}
