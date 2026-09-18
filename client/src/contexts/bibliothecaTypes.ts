import {
  Work,
  Edition,
  LibraryItem,
  ReadingRecord,
  ReadingQueueItem,
  WishlistItem,
  BookNote,
  ReadingStatus,
  BookCardViewModel,
} from "@/types/bibliotheca";

export interface BibliothecaState {
  works: Work[];
  editions: Edition[];
  libraryItems: LibraryItem[];
  readingRecords: ReadingRecord[];
  readingQueue: ReadingQueueItem[];
  wishlistItems: WishlistItem[];
  notes: BookNote[];
  schemaVersion?: number;
}

export interface AddBookParams {
  workDraft: Omit<Work, "id">;
  editionDraft: Omit<Edition, "id" | "workId">;
  existingWorkId?: string;
  readingStatus: ReadingStatus;
  addToQueue: boolean;
}

export interface AddBookResult {
  workId: string;
  libraryItemId: string;
}

export interface BibliothecaContextType extends BibliothecaState {
  // Authentication & Cloud Sync
  isAuthenticated: boolean;
  isCloudLoading: boolean;
  showImportPrompt: boolean;
  cloudSyncError: string | null;
  dismissImportPrompt: () => void;
  importLocalLibrary: () => Promise<void>;
  clearCloudSyncError: () => void;
  refreshFromCloud: () => Promise<void>;

  // Domain actions
  setReadingStatus: (libraryItemId: string, nextStatus: ReadingStatus) => void;
  toggleQueue: (workId: string, libraryItemId?: string) => void;
  removeFromQueue: (queueItemId: string) => void;
  moveQueueItem: (queueItemId: string, direction: "up" | "down") => void;
  isWorkInQueue: (workId: string) => boolean;
  toggleWishlist: (workId: string, editionId?: string) => void;
  removeFromWishlist: (wishlistItemId: string) => void;
  isWorkInWishlist: (workId: string) => boolean;
  addNote: (data: { workId: string; libraryItemId?: string; content: string; page?: number; chapter?: string }) => void;
  updateNote: (id: string, content: string, page?: number, chapter?: string) => void;
  deleteNote: (id: string) => void;
  getLibraryCards: () => BookCardViewModel[];
  getLectioCards: () => BookCardViewModel[];
  addBook: (params: AddBookParams) => AddBookResult;
  addBooks: (paramsList: AddBookParams[]) => AddBookResult[];
  checkDuplicate: (isbn: string | undefined, title: string, author: string | undefined) => 'exact-edition' | 'same-work' | 'none';
}
