import React from "react";
import { useRoute, Link } from "wouter";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { BookDetailHero } from "@/components/bibliotheca/BookDetailHero";
import { BookDetailContent } from "@/components/bibliotheca/BookDetailContent";
import { BookDetailConnections } from "@/components/bibliotheca/BookDetailConnections";
import { BookDetailEdition } from "@/components/bibliotheca/BookDetailEdition";
import { BookDetailNotes } from "@/components/bibliotheca/BookDetailNotes";
import { getBookEnrichment } from "@/lib/bibliothecaEnrichments";
import { ArrowLeft } from "lucide-react";

export function BookDetailPage() {
  const [, params] = useRoute("/book/:workId");
  const workId = params?.workId || "";

  const {
    works,
    editions,
    libraryItems,
    notes,
    setReadingStatus,
    toggleQueue,
    isWorkInQueue,
    toggleWishlist,
    isWorkInWishlist,
    addNote,
    updateNote,
    deleteNote
  } = useBibliotheca();

  const work = works.find((w) => w.id === workId);

  // If work not found, graceful fallback
  if (!work) {
    return (
      <AppShell>
        <div className="py-20 text-center max-w-md mx-auto">
          <h2 className="font-cinzel text-xl text-[var(--parchment)] mb-2">
            Obra não encontrada
          </h2>
          <p className="font-cormorant text-base italic text-[var(--sacred-ivory)]/70 mb-6">
            O identificador solicitado não corresponde a nenhum título catalogado.
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--ancient-gold-warm)] text-[var(--cathedral-void)] font-cinzel text-xs font-semibold uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a biblioteca
          </Link>
        </div>
      </AppShell>
    );
  }

  // Find edition and library item associated with this work
  const edition = editions.find((e) => e.workId === work.id);
  const libraryItem = libraryItems.find(
    (item) => edition && item.editionId === edition.id
  );

  const bookNotes = notes.filter((n) => n.workId === work.id);
  const enrichment = getBookEnrichment(work.id);

  // Resolve library connections (related works that are in the user's library/works)
  const connections = enrichment.relatedWorkIds
    .map((relatedId) => {
      const relWork = works.find((w) => w.id === relatedId);
      const relEdition = editions.find((e) => e.workId === relatedId);
      return relWork ? { work: relWork, edition: relEdition } : null;
    })
    .filter(Boolean) as { work: typeof work; edition?: typeof edition }[];

  const isInQueue = isWorkInQueue(work.id);
  const isInWishlist = isWorkInWishlist(work.id);

  return (
    <AppShell>
      {/* Back to Library Navigation */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-xs font-cinzel tracking-wider uppercase text-[var(--ancient-gold-bright)] hover:text-[var(--byzantine-gold)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Hero: Cover, Metadata, Reading State, Queue Actions */}
      <BookDetailHero
        work={work}
        edition={edition}
        libraryItem={libraryItem}
        isInQueue={isInQueue}
        isInWishlist={isInWishlist}
        onReadingStatusChange={(status) => {
          if (libraryItem) {
            setReadingStatus(libraryItem.id, status);
          }
        }}
        onToggleQueue={() => toggleQueue(work.id, libraryItem?.id)}
        onToggleWishlist={() => toggleWishlist(work.id, edition?.id)}
      />

      {/* Content: Spoiler Modes, Synopsis, Context, Facts, Themes */}
      <BookDetailContent
        enrichment={enrichment}
        readingStatus={libraryItem?.readingStatus}
      />

      {/* Internal Library Connections */}
      <BookDetailConnections connections={connections} />

      {/* Exact Bibliographic Edition Section */}
      <BookDetailEdition work={work} edition={edition} />

      {/* Atomic Reading Notes */}
      <BookDetailNotes
        notes={bookNotes}
        workId={work.id}
        libraryItemId={libraryItem?.id}
        onAddNote={addNote}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
      />
    </AppShell>
  );
}

export default BookDetailPage;
