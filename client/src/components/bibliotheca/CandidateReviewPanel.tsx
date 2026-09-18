import React, { useState } from "react";
import { IdentifiedBookCandidate, ReadingStatus } from "@/types/bibliotheca";
import { ReadingStateSelector } from "./ReadingStateSelector";
import { ArrowLeft } from "lucide-react";

interface CandidateReviewPanelProps {
  candidate: IdentifiedBookCandidate;
  onSave: (updated: IdentifiedBookCandidate) => void;
  onBack: () => void;
}

export function CandidateReviewPanel({ candidate, onSave, onBack }: CandidateReviewPanelProps) {
  const [title, setTitle] = useState(candidate.editedTitle || candidate.title);
  const [author, setAuthor] = useState(candidate.editedAuthor || candidate.author || "");
  const [publisher, setPublisher] = useState(candidate.possibleEdition?.publisher || "");
  const [year, setYear] = useState(String(candidate.possibleEdition?.publicationYear || ""));
  const [translator, setTranslator] = useState(candidate.possibleEdition?.translator || "");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(
    candidate.readingStatus || "unread"
  );
  const [addToQueue, setAddToQueue] = useState(candidate.addToQueue || false);

  function handleSave() {
    const updated: IdentifiedBookCandidate = {
      ...candidate,
      editedTitle: title.trim() || candidate.title,
      editedAuthor: author.trim() || undefined,
      possibleEdition: {
        ...candidate.possibleEdition,
        publisher: publisher.trim() || undefined,
        publicationYear: year ? parseInt(year) : undefined,
        translator: translator.trim() || undefined,
      },
      readingStatus,
      addToQueue,
    };
    onSave(updated);
  }

  const fieldClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--stone-gray-alpha)]/50 border border-[var(--ancient-gold-alpha-soft)] text-sm font-inter text-[var(--parchment)] placeholder:text-[var(--sacred-ivory)]/30 focus:outline-none focus:border-[var(--ancient-gold-warm)] focus:ring-1 focus:ring-[var(--ancient-gold-glow)] transition-all";

  return (
    <div className="flex flex-col max-h-[85vh]">
      <div className="px-5 pt-5 pb-3 border-b border-[var(--ancient-gold-alpha-soft)] shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-inter text-[var(--ancient-gold)]/80 hover:text-[var(--ancient-gold-bright)] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar à lista
        </button>
        <h2 className="font-cinzel text-sm font-bold tracking-wide text-[var(--parchment)] uppercase">
          Editar candidato
        </h2>
        <p className="text-[11px] font-inter text-[var(--sacred-ivory)]/50 mt-0.5">
          As alterações são aplicadas apenas a este livro no lote.
        </p>
      </div>

      <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
        <div>
          <label className="block text-[11px] font-cinzel uppercase tracking-wider text-[var(--ancient-gold)]/70 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="block text-[11px] font-cinzel uppercase tracking-wider text-[var(--ancient-gold)]/70 mb-1">
            Autor
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-cinzel uppercase tracking-wider text-[var(--ancient-gold)]/70 mb-1">
              Editora
            </label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-[11px] font-cinzel uppercase tracking-wider text-[var(--ancient-gold)]/70 mb-1">
              Ano
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-cinzel uppercase tracking-wider text-[var(--ancient-gold)]/70 mb-1">
            Tradutor
          </label>
          <input
            type="text"
            value={translator}
            onChange={(e) => setTranslator(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="pt-2 border-t border-[var(--ancient-gold-alpha-soft)]/60">
          <ReadingStateSelector
            readingStatus={readingStatus}
            addToQueue={addToQueue}
            onReadingStatusChange={setReadingStatus}
            onAddToQueueChange={setAddToQueue}
          />
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[var(--ancient-gold-alpha-soft)] shrink-0">
        <button
          type="button"
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full py-2.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider uppercase bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(205,154,43,0.2)]"
        >
          Voltar à lista
        </button>
      </div>
    </div>
  );
}

export default CandidateReviewPanel;
