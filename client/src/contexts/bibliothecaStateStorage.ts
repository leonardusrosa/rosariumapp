import { BibliothecaState } from "./bibliothecaTypes";
import { BookCoverDef } from "@/types/bibliotheca";
import {
  SAMPLE_WORKS,
  SAMPLE_EDITIONS,
  SAMPLE_LIBRARY_ITEMS,
  SAMPLE_READING_RECORDS,
  SAMPLE_QUEUE_ITEMS,
  SAMPLE_WISHLIST_ITEMS,
  SAMPLE_BOOK_NOTES,
} from "@/lib/bibliothecaData";

export const STORAGE_KEY = "bibliotheca_prototype_state_v1";

export const EMPTY_STATE: BibliothecaState = {
  works: [],
  editions: [],
  libraryItems: [],
  readingRecords: [],
  readingQueue: [],
  wishlistItems: [],
  notes: [],
  schemaVersion: 2,
};

export const DEMO_STATE: BibliothecaState = {
  works: SAMPLE_WORKS,
  editions: SAMPLE_EDITIONS,
  libraryItems: SAMPLE_LIBRARY_ITEMS,
  readingRecords: SAMPLE_READING_RECORDS,
  readingQueue: SAMPLE_QUEUE_ITEMS,
  wishlistItems: SAMPLE_WISHLIST_ITEMS,
  notes: SAMPLE_BOOK_NOTES,
  schemaVersion: 2,
};

export function getUserCloudCacheKey(userId: string): string {
  return `bibliotheca_cloud_cache_v1:${userId}`;
}

export function loadUserCloudCache(userId: string): BibliothecaState | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = localStorage.getItem(getUserCloudCacheKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.editions)) {
        parsed.editions = parsed.editions.map((ed: any) => ({
          ...ed,
          cover: migrateEditionCover(ed.cover),
        }));
      }
      parsed.schemaVersion = 2;
      return parsed as BibliothecaState;
    }
  } catch (e) {
    console.warn("Failed to load user cloud cache:", e);
  }
  return null;
}

export function saveUserCloudCache(userId: string, state: BibliothecaState): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(getUserCloudCacheKey(userId), JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save user cloud cache:", e);
  }
}

export function clearUserCloudCache(userId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.removeItem(getUserCloudCacheKey(userId));
  } catch (e) {
    console.warn("Failed to clear user cloud cache:", e);
  }
}

export function migrateEditionCover(cover: unknown): BookCoverDef {
  if (!cover || typeof cover !== "object") {
    return {
      type: "generated",
      style: "minimal",
      primaryColor: "#1c2024",
      accentColor: "#c9a35e",
      textColor: "#f3eee5",
    };
  }

  const c = cover as Record<string, unknown>;
  if (c.type === "remote" || c.type === "generated") {
    return cover as BookCoverDef;
  }

  // Legacy v1 shape (lacks .type discriminator)
  return {
    type: "generated",
    style: (c.style as any) || "minimal",
    primaryColor: (c.primaryColor as string) || "#1c2024",
    accentColor: (c.accentColor as string) || "#c9a35e",
    textColor: (c.textColor as string) || "#f3eee5",
    layoutVariant: c.layoutVariant as any,
    geometryShape: c.geometryShape as any,
    subtitle: c.subtitle as string | undefined,
  };
}

export function loadInitialState(): BibliothecaState {
  if (typeof window === "undefined") {
    return EMPTY_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.editions)) {
        parsed.editions = parsed.editions.map((ed: any) => ({
          ...ed,
          cover: migrateEditionCover(ed.cover),
        }));
      }
      parsed.schemaVersion = 2;
      return parsed as BibliothecaState;
    }
  } catch (e) {
    console.error("Failed to read Bibliotheca state from localStorage:", e);
  }

  // Fresh browser in production starts empty
  return EMPTY_STATE;
}

export function saveStateToStorage(state: BibliothecaState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save Bibliotheca state:", e);
  }
}

const SAMPLE_WORK_ID_SET = new Set(SAMPLE_WORKS.map((w) => w.id));

export function hasMeaningfulLocalData(state: BibliothecaState): boolean {
  if (!state || state.works.length === 0) return false;

  // Check if any work is user-created (not from static sample set)
  const hasCustomWorks = state.works.some((w) => !SAMPLE_WORK_ID_SET.has(w.id));
  if (hasCustomWorks) return true;

  // Check if user has added personal notes
  if (state.notes && state.notes.length > SAMPLE_BOOK_NOTES.length) return true;

  // Check if user has created non-sample editions or reading records
  const sampleEdIds = new Set(SAMPLE_EDITIONS.map((e) => e.id));
  const hasCustomEditions = state.editions.some((e) => !sampleEdIds.has(e.id));
  if (hasCustomEditions) return true;

  // If only pristine static demo data is present, do not offer import
  return false;
}
