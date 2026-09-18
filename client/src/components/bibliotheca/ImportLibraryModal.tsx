import React, { useState } from "react";
import { CloudUpload, BookOpen, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { loadInitialState } from "@/contexts/bibliothecaStateStorage";

export function ImportLibraryModal() {
  const {
    showImportPrompt,
    dismissImportPrompt,
    importLocalLibrary,
    isCloudLoading,
    cloudSyncError,
    clearCloudSyncError,
  } = useBibliotheca();

  const [localStats] = useState(() => {
    const local = loadInitialState();
    return {
      worksCount: local.works.length,
      libraryCount: local.libraryItems.length,
      notesCount: local.notes.length,
    };
  });

  if (!showImportPrompt) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={dismissImportPrompt} />

      <div className="relative z-10 w-full sm:max-w-md sm:mx-4 bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] sm:rounded-2xl rounded-t-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(201,163,94,0.12)] overflow-hidden p-6 sm:p-8 flex flex-col">
        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full border border-[var(--ancient-gold-alpha-soft)] bg-[var(--stone-gray-alpha)]/40 flex items-center justify-center mb-4 text-[var(--ancient-gold)] shadow-[0_0_20px_rgba(201,163,94,0.2)]">
            <CloudUpload className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[var(--parchment)]">
            Encontramos um acervo neste dispositivo
          </h2>
          <p className="text-xs text-[var(--sacred-ivory)]/70 mt-2 leading-relaxed">
            Sua conta na nuvem ainda está vazia. Deseja sincronizar os livros e notas catalogados localmente neste navegador com a sua conta?
          </p>
        </div>

        {/* Snapshot Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-[var(--ancient-gold)]" />
            <div>
              <div className="text-sm font-serif font-medium text-[var(--parchment)]">
                {localStats.libraryCount}
              </div>
              <div className="text-[10px] text-[var(--sacred-ivory)]/50 uppercase tracking-wider">
                Livros no acervo
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
            <FileText className="w-4 h-4 text-[var(--ancient-gold)]" />
            <div>
              <div className="text-sm font-serif font-medium text-[var(--parchment)]">
                {localStats.notesCount}
              </div>
              <div className="text-[10px] text-[var(--sacred-ivory)]/50 uppercase tracking-wider">
                Anotações
              </div>
            </div>
          </div>
        </div>

        {/* Sync Error Notice */}
        {cloudSyncError && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/40 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{cloudSyncError}</div>
          </div>
        )}

        {/* Safeguard explanation */}
        <div className="mb-6 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2 text-[11px] text-[var(--sacred-ivory)]/60">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
          <span>Seu acervo local continuará intacto durante e após a sincronização.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={isCloudLoading}
            onClick={() => {
              clearCloudSyncError();
              importLocalLibrary();
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[var(--ancient-gold)] hover:bg-[var(--gold-leaf)] text-black font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(201,163,94,0.3)] disabled:opacity-50"
          >
            {isCloudLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sincronizando acervo...</span>
              </>
            ) : (
              "Importar para minha conta"
            )}
          </button>

          <button
            type="button"
            disabled={isCloudLoading}
            onClick={dismissImportPrompt}
            className="w-full py-2 px-4 rounded-lg bg-transparent hover:bg-white/5 text-xs text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)] transition-colors text-center"
          >
            Começar com biblioteca vazia
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportLibraryModal;
