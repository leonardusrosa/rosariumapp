import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BibliothecaState } from "./bibliothecaTypes";
import {
  loadInitialState,
  saveStateToStorage,
  loadUserCloudCache,
  saveUserCloudCache,
  hasMeaningfulLocalData,
} from "./bibliothecaStateStorage";
import { bibliothecaCloudRepo } from "@/services/bibliothecaCloudRepository";

export function useBibliothecaCloudSync(
  state: BibliothecaState,
  setState: React.Dispatch<React.SetStateAction<BibliothecaState>>
) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isCloudLoading, setIsCloudLoading] = useState(false);
  const [showImportPrompt, setShowImportPrompt] = useState(false);
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  const prevUserIdRef = useRef<string | null>(null);
  const guestStateRef = useRef<BibliothecaState>(loadInitialState());
  const stateRef = useRef<BibliothecaState>(state);
  stateRef.current = state;

  // Persist changes based on auth mode
  useEffect(() => {
    if (isAuthLoading) return;
    if (user?.id) {
      saveUserCloudCache(user.id, state);
    } else if (prevUserIdRef.current === null) {
      // Only save to guest storage when strictly in guest mode, not during logout transitions
      guestStateRef.current = state;
      saveStateToStorage(state);
    }
  }, [state, user?.id, isAuthLoading]);

  // Handle user authentication transitions
  useEffect(() => {
    if (isAuthLoading) return;

    const currentUserId = user?.id || null;
    const prevUserId = prevUserIdRef.current;

    if (currentUserId === prevUserId) return;
    prevUserIdRef.current = currentUserId;

    if (!currentUserId) {
      // User signed out -> cleanly switch back to separate guest state
      setShowImportPrompt(false);
      setCloudSyncError(null);
      setState(guestStateRef.current);
      saveStateToStorage(guestStateRef.current);
      return;
    }

    // User signed in -> capture current guest state snapshot
    guestStateRef.current = loadInitialState();

    // User signed in (or switched user)
    // 1. Immediately render cached state for this user if available
    const cachedState = loadUserCloudCache(currentUserId);
    if (cachedState) {
      setState(cachedState);
    }

    // 2. Fetch authoritative cloud state
    setIsCloudLoading(true);
    setCloudSyncError(null);

    bibliothecaCloudRepo
      .fetchCloudLibrary()
      .then((cloudState) => {
        setState(cloudState);
        saveUserCloudCache(currentUserId, cloudState);

        // Check if cloud library is empty
        const isCloudEmpty = cloudState.libraryItems.length === 0;
        if (isCloudEmpty) {
          const localState = loadInitialState();
          if (hasMeaningfulLocalData(localState)) {
            setShowImportPrompt(true);
          } else {
            setShowImportPrompt(false);
          }
        } else {
          setShowImportPrompt(false);
        }
      })
      .catch((err: any) => {
        console.error("Failed to sync cloud library:", err);
        setCloudSyncError(err?.message || "Erro ao conectar à nuvem");
      })
      .finally(() => {
        setIsCloudLoading(false);
      });
  }, [user?.id, isAuthLoading, setState]);

  const refreshFromCloud = useCallback(async () => {
    if (!user?.id) return;
    setIsCloudLoading(true);
    try {
      const cloudState = await bibliothecaCloudRepo.fetchCloudLibrary();
      setState(cloudState);
      saveUserCloudCache(user.id, cloudState);
      setCloudSyncError(null);
    } catch (err: any) {
      console.error("Failed to refresh cloud library:", err);
      setCloudSyncError(err?.message || "Erro ao atualizar da nuvem");
    } finally {
      setIsCloudLoading(false);
    }
  }, [user?.id, setState]);

  const dismissImportPrompt = useCallback(() => {
    setShowImportPrompt(false);
  }, []);

  const importLocalLibrary = useCallback(async () => {
    if (!user?.id) return;
    const localState = loadInitialState();
    if (!hasMeaningfulLocalData(localState)) {
      setShowImportPrompt(false);
      return;
    }

    setIsCloudLoading(true);
    setCloudSyncError(null);

    try {
      await bibliothecaCloudRepo.importLocalToCloud(localState);
      const freshCloudState = await bibliothecaCloudRepo.fetchCloudLibrary();
      setState(freshCloudState);
      saveUserCloudCache(user.id, freshCloudState);
      setShowImportPrompt(false);
    } catch (err: any) {
      console.error("Local library cloud import failed:", err);
      if (err?.message?.includes("cloud_not_empty")) {
        setCloudSyncError("A biblioteca na nuvem já possui livros. Importação não permitida.");
      } else {
        setCloudSyncError(err?.message || "Erro ao importar acervo para a nuvem");
      }
      // Re-fetch to ensure clean state
      try {
        const fresh = await bibliothecaCloudRepo.fetchCloudLibrary();
        setState(fresh);
      } catch {}
    } finally {
      setIsCloudLoading(false);
    }
  }, [user?.id, setState]);

  const clearCloudSyncError = useCallback(() => {
    setCloudSyncError(null);
  }, []);

  return {
    isAuthenticated: !!user,
    userId: user?.id,
    isCloudLoading,
    showImportPrompt,
    cloudSyncError,
    setCloudSyncError,
    dismissImportPrompt,
    importLocalLibrary,
    clearCloudSyncError,
    refreshFromCloud,
  };
}
