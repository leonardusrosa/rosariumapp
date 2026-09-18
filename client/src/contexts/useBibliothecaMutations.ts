import { useCallback } from "react";
import {
  ReadingRecord,
  ReadingStatus,
  BookNote,
} from "@/types/bibliotheca";
import { findExistingWork, findExistingEditionByIsbn } from "@/lib/bibliothecaIngestion";
import {
  BibliothecaState,
  AddBookParams,
  AddBookResult,
} from "./bibliothecaTypes";
import { executeAddBook, executeAddBooks } from "./bibliothecaIngestionMutations";
import { bibliothecaCloudRepo } from "@/services/bibliothecaCloudRepository";

export function useBibliothecaMutations(
  state: BibliothecaState,
  setState: React.Dispatch<React.SetStateAction<BibliothecaState>>,
  isAuthenticated: boolean,
  setCloudSyncError: (err: string | null) => void
) {
  const setReadingStatus = useCallback(
    (libraryItemId: string, nextStatus: ReadingStatus) => {
      const prevState = state;
      const currentItem = prevState.libraryItems.find((i) => i.id === libraryItemId);
      if (!currentItem || currentItem.readingStatus === nextStatus) return;

      const prevStatus = currentItem.readingStatus;
      const edition = prevState.editions.find((e) => e.id === currentItem.editionId);
      const workId = edition?.workId || "";

      setState((prev) => {
        const updatedItems = prev.libraryItems.map((item) =>
          item.id === libraryItemId ? { ...item, readingStatus: nextStatus } : item
        );

        let updatedRecords = prev.readingRecords;
        if (nextStatus === "read" && prevStatus !== "read") {
          const newRecord: ReadingRecord = {
            id: `rr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            workId,
            editionId: currentItem.editionId,
            finishedAt: new Date().toISOString(),
          };
          updatedRecords = [newRecord, ...prev.readingRecords];
        }

        return {
          ...prev,
          libraryItems: updatedItems,
          readingRecords: updatedRecords,
        };
      });

      if (isAuthenticated) {
        bibliothecaCloudRepo
          .updateReadingStatusInCloud(libraryItemId, nextStatus, prevStatus, currentItem.editionId, workId)
          .catch((err: any) => {
            console.error("Cloud reading status update failed:", err);
            setState(prevState);
            setCloudSyncError(err?.message || "Falha ao salvar status na nuvem");
          });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const isWorkInQueue = useCallback(
    (workId: string) => state.readingQueue.some((q) => q.workId === workId),
    [state.readingQueue]
  );

  const toggleQueue = useCallback(
    (workId: string, libraryItemId?: string) => {
      const prevState = state;
      const existing = prevState.readingQueue.find((q) => q.workId === workId);

      setState((prev) => {
        if (existing) {
          const filtered = prev.readingQueue
            .filter((q) => q.workId !== workId)
            .map((q, idx) => ({ ...q, position: idx + 1 }));
          return { ...prev, readingQueue: filtered };
        }
        const newItem = {
          id: `rq-${Date.now()}`,
          workId,
          libraryItemId,
          position: prev.readingQueue.length + 1,
          addedAt: new Date().toISOString(),
        };
        return { ...prev, readingQueue: [...prev.readingQueue, newItem] };
      });

      if (isAuthenticated) {
        bibliothecaCloudRepo
          .toggleQueueInCloud(
            workId,
            libraryItemId,
            existing?.id,
            existing ? undefined : prevState.readingQueue.length + 1
          )
          .catch((err: any) => {
            console.error("Cloud queue toggle failed:", err);
            setState(prevState);
            setCloudSyncError(err?.message || "Falha ao alterar fila na nuvem");
          });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const removeFromQueue = useCallback(
    (queueItemId: string) => {
      const prevState = state;
      setState((prev) => ({
        ...prev,
        readingQueue: prev.readingQueue
          .filter((q) => q.id !== queueItemId)
          .map((q, idx) => ({ ...q, position: idx + 1 })),
      }));

      if (isAuthenticated) {
        bibliothecaCloudRepo.removeFromQueueInCloud(queueItemId).catch((err: any) => {
          console.error("Cloud remove from queue failed:", err);
          setState(prevState);
          setCloudSyncError(err?.message || "Falha ao remover da fila na nuvem");
        });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const moveQueueItem = useCallback(
    (queueItemId: string, direction: "up" | "down") => {
      const prevState = state;
      const idx = prevState.readingQueue.findIndex((q) => q.id === queueItemId);
      if (idx === -1) return;
      if (direction === "up" && idx === 0) return;
      if (direction === "down" && idx === prevState.readingQueue.length - 1) return;

      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      const copy = [...prevState.readingQueue];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      const nextQueue = copy.map((q, i) => ({ ...q, position: i + 1 }));

      setState((prev) => ({ ...prev, readingQueue: nextQueue }));

      if (isAuthenticated) {
        bibliothecaCloudRepo
          .reorderQueueInCloud(nextQueue.map((q) => q.id))
          .catch((err: any) => {
            console.error("Cloud reorder queue failed:", err);
            setState(prevState);
            setCloudSyncError(err?.message || "Falha ao reordenar fila na nuvem");
          });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const isWorkInWishlist = useCallback(
    (workId: string) => state.wishlistItems.some((w) => w.workId === workId),
    [state.wishlistItems]
  );

  const toggleWishlist = useCallback(
    (workId: string, editionId?: string) => {
      const prevState = state;
      const existing = prevState.wishlistItems.find((w) => w.workId === workId);

      setState((prev) => {
        if (existing) {
          return {
            ...prev,
            wishlistItems: prev.wishlistItems.filter((w) => w.workId !== workId),
          };
        }
        const newItem = {
          id: `wl-${Date.now()}`,
          workId,
          editionId,
          addedAt: new Date().toISOString(),
        };
        return { ...prev, wishlistItems: [newItem, ...prev.wishlistItems] };
      });

      if (isAuthenticated) {
        bibliothecaCloudRepo
          .toggleWishlistInCloud(workId, editionId, existing?.id)
          .catch((err: any) => {
            console.error("Cloud toggle wishlist failed:", err);
            setState(prevState);
            setCloudSyncError(err?.message || "Falha ao atualizar lista de desejos");
          });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const removeFromWishlist = useCallback(
    (wishlistItemId: string) => {
      const prevState = state;
      setState((prev) => ({
        ...prev,
        wishlistItems: prev.wishlistItems.filter((w) => w.id !== wishlistItemId),
      }));

      if (isAuthenticated) {
        bibliothecaCloudRepo.removeFromWishlistInCloud(wishlistItemId).catch((err: any) => {
          console.error("Cloud remove wishlist failed:", err);
          setState(prevState);
          setCloudSyncError(err?.message || "Falha ao remover item da lista");
        });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const addNote = useCallback(
    (data: { workId: string; libraryItemId?: string; content: string; page?: number; chapter?: string }) => {
      const prevState = state;
      const newNote: BookNote = {
        id: `note-${Date.now()}`,
        workId: data.workId,
        libraryItemId: data.libraryItemId,
        content: data.content,
        page: data.page,
        chapter: data.chapter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState((prev) => ({ ...prev, notes: [newNote, ...prev.notes] }));

      if (isAuthenticated) {
        bibliothecaCloudRepo.addNoteToCloud(newNote).catch((err: any) => {
          console.error("Cloud add note failed:", err);
          setState(prevState);
          setCloudSyncError(err?.message || "Falha ao salvar nota na nuvem");
        });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const updateNote = useCallback(
    (id: string, content: string, page?: number, chapter?: string) => {
      const prevState = state;
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === id ? { ...n, content, page, chapter, updatedAt: new Date().toISOString() } : n
        ),
      }));

      if (isAuthenticated) {
        bibliothecaCloudRepo.updateNoteInCloud(id, content, page, chapter).catch((err: any) => {
          console.error("Cloud update note failed:", err);
          setState(prevState);
          setCloudSyncError(err?.message || "Falha ao atualizar nota");
        });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const deleteNote = useCallback(
    (id: string) => {
      const prevState = state;
      setState((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n.id !== id),
      }));

      if (isAuthenticated) {
        bibliothecaCloudRepo.deleteNoteInCloud(id).catch((err: any) => {
          console.error("Cloud delete note failed:", err);
          setState(prevState);
          setCloudSyncError(err?.message || "Falha ao excluir nota");
        });
      }
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const checkDuplicate = useCallback(
    (
      isbn: string | undefined,
      title: string,
      author: string | undefined
    ): "exact-edition" | "same-work" | "none" => {
      if (isbn) {
        const existingEd = findExistingEditionByIsbn(isbn, state.editions);
        if (existingEd) {
          const owned = state.libraryItems.some((i) => i.editionId === existingEd.id);
          if (owned) return "exact-edition";
        }
      }
      const existingWork = findExistingWork(title, author, state.works);
      if (existingWork) return "same-work";
      return "none";
    },
    [state.editions, state.libraryItems, state.works]
  );

  const addBook = useCallback(
    (params: AddBookParams): AddBookResult => {
      const prevState = state;
      const { nextState, result } = executeAddBook(prevState, params);
      setState(nextState);

      if (isAuthenticated) {
        bibliothecaCloudRepo.addBookToCloud(params).catch((err: any) => {
          console.error("Cloud add book failed:", err);
          setState(prevState);
          setCloudSyncError(err?.message || "Falha ao salvar livro na nuvem");
        });
      }

      return result;
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  const addBooks = useCallback(
    (paramsList: AddBookParams[]): AddBookResult[] => {
      const prevState = state;
      const { nextState, results } = executeAddBooks(prevState, paramsList);
      setState(nextState);

      if (isAuthenticated) {
        bibliothecaCloudRepo.addBooksToCloud(paramsList).catch((err: any) => {
          console.error("Cloud add books batch failed:", err);
          setState(prevState);
          setCloudSyncError(err?.message || "Falha ao salvar lote na nuvem");
        });
      }

      return results;
    },
    [state, setState, isAuthenticated, setCloudSyncError]
  );

  return {
    setReadingStatus,
    toggleQueue,
    removeFromQueue,
    moveQueueItem,
    isWorkInQueue,
    toggleWishlist,
    removeFromWishlist,
    isWorkInWishlist,
    addNote,
    updateNote,
    deleteNote,
    checkDuplicate,
    addBook,
    addBooks,
  };
}
