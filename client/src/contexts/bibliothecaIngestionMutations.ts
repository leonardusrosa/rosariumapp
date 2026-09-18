import {
  Work,
  Edition,
  LibraryItem,
  ReadingRecord,
  ReadingQueueItem,
  GeneratedCoverDef,
} from "@/types/bibliotheca";
import { findExistingWork, findMatchingWishlist } from "@/lib/bibliothecaIngestion";
import { BibliothecaState, AddBookParams, AddBookResult } from "./bibliothecaTypes";

const DEFAULT_COVER: GeneratedCoverDef = {
  type: "generated",
  style: "minimal",
  primaryColor: "#1c2024",
  accentColor: "#c9a35e",
  textColor: "#f3eee5",
};

export function executeAddBook(
  prev: BibliothecaState,
  params: AddBookParams,
  ts: number = Date.now()
): { nextState: BibliothecaState; result: AddBookResult } {
  // Resolve Work
  let workId = params.existingWorkId || "";
  let newWorks = prev.works;
  if (!workId) {
    const existing = findExistingWork(
      params.workDraft.title,
      params.workDraft.author,
      prev.works
    );
    if (existing) {
      workId = existing.id;
    } else {
      workId = `w-new-${ts}-${Math.random().toString(36).substr(2, 4)}`;
      newWorks = [...prev.works, { ...params.workDraft, id: workId }];
    }
  }

  // Create Edition
  const editionId = `ed-new-${ts}-${Math.random().toString(36).substr(2, 4)}`;
  const newEdition: Edition = {
    ...params.editionDraft,
    id: editionId,
    workId,
    cover: params.editionDraft.cover || DEFAULT_COVER,
    providerMeta: params.editionDraft.providerMeta,
  };

  // Create LibraryItem
  const itemId = `item-new-${ts}-${Math.random().toString(36).substr(2, 4)}`;
  const newItem: LibraryItem = {
    id: itemId,
    editionId,
    readingStatus: params.readingStatus,
    addedAt: new Date().toISOString(),
  };

  // Create ReadingRecord if starting as 'read'
  let newRecords = prev.readingRecords;
  if (params.readingStatus === "read") {
    const record: ReadingRecord = {
      id: `rr-new-${ts}-${Math.random().toString(36).substr(2, 4)}`,
      workId,
      editionId,
      finishedAt: new Date().toISOString(),
    };
    newRecords = [record, ...prev.readingRecords];
  }

  // Enqueue if requested
  let newQueue = prev.readingQueue;
  if (params.addToQueue) {
    const queueItem: ReadingQueueItem = {
      id: `rq-new-${ts}-${Math.random().toString(36).substr(2, 4)}`,
      workId,
      libraryItemId: itemId,
      position: prev.readingQueue.length + 1,
      addedAt: new Date().toISOString(),
    };
    newQueue = [...prev.readingQueue, queueItem];
  }

  // Remove matching wishlist item
  const wishMatch = findMatchingWishlist(workId, prev.wishlistItems);
  const newWishlist = wishMatch
    ? prev.wishlistItems.filter((w) => w.id !== wishMatch.id)
    : prev.wishlistItems;

  const nextState: BibliothecaState = {
    ...prev,
    works: newWorks,
    editions: [...prev.editions, newEdition],
    libraryItems: [...prev.libraryItems, newItem],
    readingRecords: newRecords,
    readingQueue: newQueue,
    wishlistItems: newWishlist,
  };

  return { nextState, result: { workId, libraryItemId: itemId } };
}

export function executeAddBooks(
  prev: BibliothecaState,
  paramsList: AddBookParams[]
): { nextState: BibliothecaState; results: AddBookResult[] } {
  let currentState = prev;
  const results: AddBookResult[] = [];
  const ts = Date.now();

  paramsList.forEach((params, idx) => {
    const step = executeAddBook(currentState, params, ts + idx);
    currentState = step.nextState;
    results.push(step.result);
  });

  return { nextState: currentState, results };
}
