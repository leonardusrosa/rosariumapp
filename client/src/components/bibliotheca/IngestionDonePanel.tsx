import React from "react";
import { BookCopy, Plus, Library, BookOpen } from "lucide-react";
import { useLocation } from "wouter";

interface IngestionDonePanelProps {
  addedWorkIds: string[];
  addedLibraryItemIds: string[];
  onAddAnother: () => void;
  onClose: () => void;
}

export function IngestionDonePanel({
  addedWorkIds,
  addedLibraryItemIds,
  onAddAnother,
  onClose,
}: IngestionDonePanelProps) {
  const [, setLocation] = useLocation();
  const count = addedLibraryItemIds.length;
  const isBulk = count > 1;

  function goToBook() {
    if (addedWorkIds[0]) {
      setLocation(`/book/${addedWorkIds[0]}`);
      onClose();
    }
  }

  function goToLibrary() {
    setLocation("/library");
    onClose();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-8 py-12 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[var(--byzantine-gold-alpha)] border border-[var(--byzantine-gold)]/40 flex items-center justify-center">
        <BookCopy className="w-7 h-7 text-[var(--byzantine-gold)]" />
      </div>

      {/* Headline */}
      <div>
        <h2 className="font-cinzel text-base font-bold tracking-wide text-[var(--parchment)]">
          {isBulk
            ? `${count} livros adicionados à Bibliotheca`
            : "Adicionado à Bibliotheca"}
        </h2>
        <p className="text-xs font-inter text-[var(--sacred-ivory)]/60 mt-1.5">
          {isBulk
            ? "Todos os livros selecionados foram catalogados."
            : "O livro foi catalogado com sucesso."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        {!isBulk && (
          <button
            type="button"
            onClick={goToBook}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] font-cinzel font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_2px_12px_rgba(205,154,43,0.25)]"
          >
            <BookOpen className="w-4 h-4" />
            Ver livro
          </button>
        )}

        {isBulk && (
          <button
            type="button"
            onClick={goToLibrary}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] font-cinzel font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_2px_12px_rgba(205,154,43,0.25)]"
          >
            <Library className="w-4 h-4" />
            Ver biblioteca
          </button>
        )}

        <button
          type="button"
          onClick={onAddAnother}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[var(--ancient-gold-alpha-soft)] text-[var(--parchment)] font-inter text-xs hover:border-[var(--ancient-gold-warm)]/50 hover:bg-[var(--stone-gray-alpha)]/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          {isBulk ? "Adicionar mais" : "Adicionar outro"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="py-2 text-xs font-inter text-[var(--sacred-ivory)]/50 hover:text-[var(--sacred-ivory)]/80 transition-colors"
        >
          Concluir
        </button>
      </div>
    </div>
  );
}

export default IngestionDonePanel;
