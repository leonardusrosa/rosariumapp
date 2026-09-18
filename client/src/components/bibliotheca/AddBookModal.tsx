import React, { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { IngestionState, IdentifiedBookCandidate } from "@/types/bibliotheca";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { IngestionMethodSelect } from "./IngestionMethodSelect";
import { ImageInputPanel } from "./ImageInputPanel";
import { RecognizingPanel } from "./RecognizingPanel";
import { BulkReviewPanel } from "./BulkReviewPanel";
import { CandidateReviewPanel } from "./CandidateReviewPanel";
import { SingleReviewPanel } from "./SingleReviewPanel";
import { IsbnEntryPanel } from "./IsbnEntryPanel";
import { ManualEntryPanel } from "./ManualEntryPanel";
import { IngestionDonePanel } from "./IngestionDonePanel";
import { BarcodeScannerPanel } from "./BarcodeScannerPanel";
import { recognizeShelf, recognizeCover } from "@/lib/mockRecognition";
import { candidatesToAddBookParams } from "@/lib/bibliothecaBulkHelper";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL_STATE: IngestionState = { phase: "method-select" };

export function AddBookModal({ open, onClose }: AddBookModalProps) {
  const { addBooks } = useBibliotheca();
  const [ingestion, setIngestion] = useState<IngestionState>(INITIAL_STATE);

  // Reset on re-open
  useEffect(() => {
    if (open) setIngestion(INITIAL_STATE);
  }, [open]);

  // Prevent scroll behind modal
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleMethodSelect = useCallback((method: "shelf" | "cover" | "barcode" | "isbn" | "manual") => {
    if (method === "barcode") {
      setIngestion({ phase: "barcode-scan" });
    } else if (method === "isbn") {
      setIngestion({ phase: "isbn-entry" });
    } else if (method === "manual") {
      setIngestion({
        phase: "manual-entry",
        draft: { title: "", readingStatus: "unread", addToQueue: false },
      });
    } else {
      setIngestion({ phase: "image-input", mode: method });
    }
  }, []);

  const handleImageCapture = useCallback(async (objectUrl: string, mode: "shelf" | "cover") => {
    setIngestion({ phase: "recognizing", mode });
    try {
      const candidates = mode === "shelf"
        ? await recognizeShelf(objectUrl)
        : await recognizeCover(objectUrl);
      URL.revokeObjectURL(objectUrl);

      if (mode === "shelf") {
        setIngestion({ phase: "bulk-review", candidates });
      } else {
        setIngestion({ phase: "single-review", candidate: candidates[0], origin: "cover" });
      }
    } catch {
      URL.revokeObjectURL(objectUrl);
      setIngestion({ phase: "image-input", mode });
    }
  }, []);

  const handleBulkCommit = useCallback((selected: IdentifiedBookCandidate[]) => {
    const paramsList = candidatesToAddBookParams(selected);
    const results = addBooks(paramsList);
    setIngestion({
      phase: "done",
      addedWorkIds: results.map((r) => r.workId),
      addedLibraryItemIds: results.map((r) => r.libraryItemId),
    });
  }, [addBooks]);

  if (!open) return null;

  function renderPanel() {
    switch (ingestion.phase) {
      case "method-select":
        return <IngestionMethodSelect onSelect={handleMethodSelect} onClose={onClose} />;

      case "barcode-scan":
        return (
          <BarcodeScannerPanel
            onFound={(candidate) =>
              setIngestion({ phase: "single-review", candidate, origin: "barcode" })
            }
            onManualEntry={(scannedIsbn?: string) =>
              setIngestion({
                phase: "manual-entry",
                draft: { title: "", isbn: scannedIsbn, readingStatus: "unread", addToQueue: false },
              })
            }
            onTypeIsbn={() => setIngestion({ phase: "isbn-entry" })}
            onBack={() => setIngestion({ phase: "method-select" })}
          />
        );

      case "image-input":
        return (
          <ImageInputPanel
            mode={ingestion.mode}
            onCapture={(url) => handleImageCapture(url, ingestion.mode)}
            onBack={() => setIngestion({ phase: "method-select" })}
          />
        );

      case "recognizing":
        return <RecognizingPanel mode={ingestion.mode} />;

      case "bulk-review":
        return (
          <BulkReviewPanel
            candidates={ingestion.candidates}
            onCandidatesChange={(candidates) =>
              setIngestion({ phase: "bulk-review", candidates })
            }
            onEditCandidate={(id) =>
              setIngestion({
                phase: "candidate-review",
                candidateId: id,
                returnToBulk: true,
                candidates: ingestion.candidates,
              })
            }
            onCommit={handleBulkCommit}
            onBack={() => setIngestion({ phase: "image-input", mode: "shelf" })}
          />
        );

      case "candidate-review": {
        const candidate = ingestion.candidates.find((c) => c.id === ingestion.candidateId);
        if (!candidate) return null;
        return (
          <CandidateReviewPanel
            candidate={candidate}
            onSave={(updated) => {
              const updatedCandidates = ingestion.candidates.map((c) =>
                c.id === updated.id ? updated : c
              );
              setIngestion({ phase: "bulk-review", candidates: updatedCandidates });
            }}
            onBack={() =>
              setIngestion({ phase: "bulk-review", candidates: ingestion.candidates })
            }
          />
        );
      }

      case "single-review":
        return (
          <SingleReviewPanel
            candidate={ingestion.candidate}
            origin={ingestion.origin}
            onConfirm={(result) =>
              setIngestion({
                phase: "done",
                addedWorkIds: [result.workId],
                addedLibraryItemIds: [result.libraryItemId],
              })
            }
            onBack={() => {
              if (ingestion.origin === "barcode") {
                setIngestion({ phase: "barcode-scan" });
              } else if (ingestion.origin === "isbn") {
                setIngestion({ phase: "isbn-entry" });
              } else {
                setIngestion({ phase: "image-input", mode: "cover" });
              }
            }}
          />
        );

      case "isbn-entry":
        return (
          <IsbnEntryPanel
            onFound={(candidate) =>
              setIngestion({ phase: "single-review", candidate, origin: "isbn" })
            }
            onNotFound={(normIsbn) =>
              setIngestion({
                phase: "manual-entry",
                draft: { title: "", isbn: normIsbn, readingStatus: "unread", addToQueue: false },
              })
            }
            onBack={() => setIngestion({ phase: "method-select" })}
          />
        );

      case "manual-entry":
        return (
          <ManualEntryPanel
            initialIsbn={ingestion.draft.isbn}
            onConfirm={(result) =>
              setIngestion({
                phase: "done",
                addedWorkIds: [result.workId],
                addedLibraryItemIds: [result.libraryItemId],
              })
            }
            onBack={() => setIngestion({ phase: "method-select" })}
          />
        );

      case "done":
        return (
          <IngestionDonePanel
            addedWorkIds={ingestion.addedWorkIds}
            addedLibraryItemIds={ingestion.addedLibraryItemIds}
            onAddAnother={() => setIngestion({ phase: "method-select" })}
            onClose={onClose}
          />
        );

      default:
        return null;
    }
  }

  const showCloseButton = ingestion.phase !== "recognizing";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={ingestion.phase !== "recognizing" ? onClose : undefined}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full sm:max-w-lg sm:mx-4 bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] sm:rounded-2xl rounded-t-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(201,163,94,0.08)] overflow-hidden max-h-[95vh] flex flex-col">
        {/* Close button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-[var(--sacred-ivory)]/50 hover:text-[var(--parchment)] hover:bg-[var(--stone-gray-alpha)]/50 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {renderPanel()}
      </div>
    </div>
  );
}

export default AddBookModal;
