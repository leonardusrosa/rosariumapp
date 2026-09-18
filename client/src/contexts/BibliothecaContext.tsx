import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { BookCardViewModel } from "@/types/bibliotheca";
import {
  BibliothecaState,
  BibliothecaContextType,
  AddBookParams,
  AddBookResult,
} from "./bibliothecaTypes";
import { loadInitialState } from "./bibliothecaStateStorage";
import { buildLibraryCards, buildLectioCards } from "./bibliothecaCardHelpers";
import { useBibliothecaCloudSync } from "./useBibliothecaCloudSync";
import { useBibliothecaMutations } from "./useBibliothecaMutations";

export type { AddBookParams, AddBookResult, BibliothecaState };

const BibliothecaContext = createContext<BibliothecaContextType | null>(null);

export function BibliothecaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BibliothecaState>(loadInitialState);

  const cloudSync = useBibliothecaCloudSync(state, setState);
  const mutations = useBibliothecaMutations(
    state,
    setState,
    cloudSync.isAuthenticated,
    cloudSync.setCloudSyncError
  );

  const getLibraryCards = (): BookCardViewModel[] => {
    return buildLibraryCards(state);
  };

  const getLectioCards = (): BookCardViewModel[] => {
    return buildLectioCards(getLibraryCards());
  };

  const value = useMemo(
    () => ({
      ...state,
      ...cloudSync,
      ...mutations,
      getLibraryCards,
      getLectioCards,
    }),
    [state, cloudSync, mutations]
  );

  return <BibliothecaContext.Provider value={value}>{children}</BibliothecaContext.Provider>;
}

export function useBibliotheca() {
  const context = useContext(BibliothecaContext);
  if (!context) {
    throw new Error("useBibliotheca must be used within a BibliothecaProvider");
  }
  return context;
}
