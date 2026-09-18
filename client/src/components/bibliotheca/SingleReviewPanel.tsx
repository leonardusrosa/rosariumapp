import React, { useState } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { IdentifiedBookCandidate, ReadingStatus, GeneratedCoverDef, BookCoverDef } from "@/types/bibliotheca";
import { BookCover } from "./BookCover";
import { ReadingStateSelector } from "./ReadingStateSelector";
import { useBibliotheca, AddBookParams } from "@/contexts/BibliothecaContext";
import { normalizeIsbn } from "@/lib/bibliothecaIngestion";

interface SingleReviewPanelProps {
  candidate: IdentifiedBookCandidate;
  origin: "cover" | "isbn" | "barcode";
  onConfirm: (result: { workId: string; libraryItemId: string }) => void;
  onBack: () => void;
}

const DEFAULT_COVER: GeneratedCoverDef = {
  type: "generated",
  style: "minimal",
  primaryColor: "#1c2024",
  accentColor: "#c9a35e",
  textColor: "#f3eee5",
};

export function SingleReviewPanel({ candidate, origin, onConfirm, onBack }: SingleReviewPanelProps) {
  const { addBook, checkDuplicate } = useBibliotheca();

  const [title, setTitle] = useState(candidate.editedTitle || candidate.title);
  const [author, setAuthor] = useState(candidate.editedAuthor || candidate.author || "");
  const [originalTitle, setOriginalTitle] = useState(candidate.originalTitle || "");
  const [origYear, setOrigYear] = useState(String(candidate.originalPublicationYear || ""));
  const [isbn, setIsbn] = useState(candidate.possibleEdition?.isbn || "");
  const [publisher, setPublisher] = useState(candidate.possibleEdition?.publisher || "");
  const [pubYear, setPubYear] = useState(String(candidate.possibleEdition?.publicationYear || ""));
  const [translator, setTranslator] = useState(candidate.possibleEdition?.translator || "");
  const [language, setLanguage] = useState(candidate.possibleEdition?.language || "");
  const [pages, setPages] = useState(String(candidate.possibleEdition?.pages || ""));
  const [format, setFormat] = useState(candidate.possibleEdition?.format || "");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>("unread");
  const [addToQueue, setAddToQueue] = useState(false);
  const [forceAdd, setForceAdd] = useState(false);

  const normIsbn = isbn ? normalizeIsbn(isbn) : undefined;
  const dupeStatus = checkDuplicate(normIsbn, title, author || undefined);
  const showDupeWarning = !forceAdd && dupeStatus !== "none";

  const cover: BookCoverDef = candidate.remoteCoverUrl
    ? {
        type: "remote",
        url: candidate.remoteCoverUrl,
        source: candidate.providerMeta?.primary,
        fallback: DEFAULT_COVER,
      }
    : DEFAULT_COVER;

  const fieldClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--stone-gray-alpha)]/50 border border-[var(--ancient-gold-alpha-soft)] text-sm font-inter text-[var(--parchment)] placeholder:text-[var(--sacred-ivory)]/30 focus:outline-none focus:border-[var(--ancient-gold-warm)] focus:ring-1 focus:ring-[var(--ancient-gold-glow)] transition-all";
  const labelClass = "block text-[11px] font-cinzel uppercase tracking-wider text-[var(--ancient-gold)]/70 mb-1";

  function handleConfirm() {
    const params: AddBookParams = {
      workDraft: {
        title: title.trim(),
        originalTitle: originalTitle.trim() || undefined,
        author: author.trim() || "Autor desconhecido",
        originalPublicationYear: origYear ? parseInt(origYear) : undefined,
      },
      editionDraft: {
        isbn: normIsbn,
        publisher: publisher.trim() || undefined,
        publicationYear: pubYear ? parseInt(pubYear) : undefined,
        translator: translator.trim() || undefined,
        language: language.trim() || undefined,
        pages: pages ? parseInt(pages) : undefined,
        format: format.trim() || undefined,
        cover,
        providerMeta: candidate.providerMeta,
      },
      existingWorkId: dupeStatus === "same-work" && forceAdd
        ? undefined  // let addBook find the existing work
        : undefined,
      readingStatus,
      addToQueue,
    };
    const result = addBook(params);
    onConfirm(result);
  }

  return (
    <div className="flex flex-col max-h-[90vh]">
      <div className="px-5 pt-5 pb-3 border-b border-[var(--ancient-gold-alpha-soft)] shrink-0">
        <h2 className="font-cinzel text-sm font-bold tracking-wide text-[var(--parchment)] uppercase">
          Confirmar livro
        </h2>
        <p className="text-[11px] font-inter text-[var(--sacred-ivory)]/50 mt-0.5">
          Revise os dados antes de adicionar à Bibliotheca.
        </p>
      </div>

      <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
        {/* Cover preview */}
        <div className="flex gap-4 items-start">
          <div className="w-20 h-28 rounded-md overflow-hidden shadow-lg shrink-0 border border-[var(--ancient-gold-warm)]/20">
            <BookCover title={title || "…"} author={author || ""} cover={cover} />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <label className={labelClass}>Título *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Autor</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Autor desconhecido" className={fieldClass} />
            </div>
          </div>
        </div>

        {/* Dupe warning */}
        {showDupeWarning && (
          <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs font-inter ${
            dupeStatus === "exact-edition"
              ? "bg-rose-950/40 border-rose-700/50 text-rose-300"
              : "bg-amber-950/30 border-amber-700/40 text-amber-300"
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">
                {dupeStatus === "exact-edition"
                  ? "Esta edição já está na sua biblioteca."
                  : "Você já possui outra edição deste livro."}
              </p>
              {dupeStatus === "same-work" && (
                <button
                  type="button"
                  onClick={() => setForceAdd(true)}
                  className="mt-1 underline underline-offset-2 hover:text-amber-200 transition-colors"
                >
                  Adicionar esta edição mesmo assim
                </button>
              )}
            </div>
          </div>
        )}

        {/* Work section */}
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-cinzel uppercase tracking-widest text-[var(--ancient-gold)]/50">Obra</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Título original</label>
              <input type="text" value={originalTitle} onChange={(e) => setOriginalTitle(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Ano original</label>
              <input type="number" value={origYear} onChange={(e) => setOrigYear(e.target.value)} className={fieldClass} />
            </div>
          </div>
        </div>

        {/* Edition section */}
        <div className="space-y-2">
          <p className="text-[10px] font-cinzel uppercase tracking-widest text-[var(--ancient-gold)]/50">Sua edição</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>ISBN</label>
              <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Editora</label>
              <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Ano da edição</label>
              <input type="number" value={pubYear} onChange={(e) => setPubYear(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Tradutor</label>
              <input type="text" value={translator} onChange={(e) => setTranslator(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Idioma</label>
              <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Páginas</label>
              <input type="number" value={pages} onChange={(e) => setPages(e.target.value)} className={fieldClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Formato</label>
            <input type="text" value={format} onChange={(e) => setFormat(e.target.value)} placeholder="Capa dura, Bolso…" className={fieldClass} />
          </div>
        </div>

        {/* Reading state */}
        <div className="pt-2 border-t border-[var(--ancient-gold-alpha-soft)]/60">
          <ReadingStateSelector
            readingStatus={readingStatus}
            addToQueue={addToQueue}
            onReadingStatusChange={setReadingStatus}
            onAddToQueueChange={setAddToQueue}
          />
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[var(--ancient-gold-alpha-soft)] shrink-0 flex gap-3">
        <button type="button" onClick={onBack}
          className="px-4 py-2.5 rounded-lg text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)] border border-[var(--ancient-gold-alpha-soft)] hover:border-[var(--ancient-gold-warm)]/40 transition-all">
          Voltar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!title.trim() || (showDupeWarning && dupeStatus === "exact-edition")}
          className="flex-1 py-2.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider uppercase bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(205,154,43,0.2)]"
        >
          Adicionar à Bibliotheca
        </button>
      </div>
    </div>
  );
}

export default SingleReviewPanel;
