import React from "react";
import { Link } from "wouter";
import { BookCardViewModel } from "@/types/bibliotheca";
import { BookCover } from "./BookCover";

interface BookCardProps {
  book: BookCardViewModel;
}

export function BookCard({ book }: BookCardProps) {
  const statusLabels: Record<string, { label: string; color: string }> = {
    reading: { label: "Lendo", color: "text-amber-400/90 border-amber-500/30 bg-amber-500/10" },
    read: { label: "Lido", color: "text-[var(--ancient-gold-bright)] border-[var(--ancient-gold-warm)]/30 bg-[var(--ancient-gold-alpha-soft)]" },
    unread: { label: "Não lido", color: "text-[var(--sacred-ivory)]/50 border-white/10 bg-white/5" }
  };

  const statusConfig = statusLabels[book.readingStatus] || statusLabels.unread;

  return (
    <article className="group flex flex-col w-full focus-within:ring-1 focus-within:ring-[var(--ancient-gold-warm)] rounded-lg">
      <Link
        href={`/book/${book.workId}`}
        className="block focus:outline-none"
        aria-label={`${book.title}, por ${book.author}`}
      >
        {/* Cover Canvas: Dominates 75–85% of card visual weight */}
        <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden shadow-lg group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.7),0_0_12px_rgba(205,154,43,0.2)] border border-[var(--ancient-gold-alpha-soft)] group-hover:border-[var(--ancient-gold-warm)]/50 transition-all duration-300 transform group-hover:-translate-y-1">
          <BookCover
            title={book.title}
            author={book.author}
            cover={book.cover}
          />

          {/* Queue tag indicator (Next) */}
          {book.isNextRead && (
            <div
              title="Próxima leitura da fila"
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-cinzel font-semibold bg-[var(--cathedral-void)]/90 text-[var(--byzantine-gold)] border border-[var(--byzantine-gold)]/40 shadow-sm"
            >
              Próxima
            </div>
          )}
        </div>
      </Link>

      {/* Book Metadata Below Cover */}
      <div className="pt-2.5 px-0.5 flex flex-col flex-1">
        <Link href={`/book/${book.workId}`} className="focus:outline-none">
          <h4 className="font-cinzel text-xs sm:text-sm font-semibold text-[var(--parchment)] group-hover:text-[var(--ancient-gold-bright)] transition-colors leading-tight line-clamp-1">
            {book.title}
          </h4>
        </Link>
        <p className="font-cormorant text-xs italic text-[var(--sacred-ivory)]/70 line-clamp-1 mt-0.5">
          {book.author}
        </p>

        {/* Restrained Reading State Badge */}
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-inter border ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
          {book.notesCount > 0 && (
            <span
              className="text-[10px] font-inter text-[var(--sacred-ivory)]/50"
              title={`${book.notesCount} notas registradas`}
            >
              {book.notesCount} {book.notesCount === 1 ? "nota" : "notas"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default BookCard;
