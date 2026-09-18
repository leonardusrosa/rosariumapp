import React from "react";
import { Work, Edition, LibraryItem, ReadingStatus } from "@/types/bibliotheca";
import { BookCover } from "./BookCover";
import { Bookmark, Heart, Check, BookOpen, Clock } from "lucide-react";

interface BookDetailHeroProps {
  work: Work;
  edition?: Edition;
  libraryItem?: LibraryItem;
  isInQueue: boolean;
  isInWishlist: boolean;
  onReadingStatusChange: (status: ReadingStatus) => void;
  onToggleQueue: () => void;
  onToggleWishlist: () => void;
}

export function BookDetailHero({
  work,
  edition,
  libraryItem,
  isInQueue,
  isInWishlist,
  onReadingStatusChange,
  onToggleQueue,
  onToggleWishlist
}: BookDetailHeroProps) {
  const currentStatus = libraryItem?.readingStatus;
  const isOwned = !!libraryItem;

  const fallbackCover = {
    style: "minimal" as const,
    primaryColor: "#1c2024",
    accentColor: "#c9a35e",
    textColor: "#f3eee5",
    geometryShape: "circle" as const
  };

  const coverDef = edition?.cover || fallbackCover;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 lg:gap-10 items-start pb-8 border-b border-[var(--ancient-gold-alpha-soft)]">
      {/* Left Column: Prominent Cover + Quick Edition Summary */}
      <div className="flex flex-col items-center md:items-start mx-auto md:mx-0 w-full max-w-[280px] lg:max-w-[320px]">
        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(205,154,43,0.15)] border border-[var(--ancient-gold-warm)]/30">
          <BookCover
            title={work.title}
            author={work.author}
            cover={coverDef}
            isLarge
          />
          {isInQueue && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-cinzel font-semibold bg-[var(--cathedral-void)]/95 text-[var(--byzantine-gold)] border border-[var(--byzantine-gold)]/40 shadow-md">
              Na Fila
            </div>
          )}
        </div>

        {/* Quick edition pill tags under cover */}
        {edition && (
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center md:justify-start w-full">
            {edition.publisher && (
              <span className="px-2 py-0.5 rounded text-[11px] font-inter bg-[var(--stone-gray-alpha)]/50 text-[var(--sacred-ivory)]/70 border border-white/5">
                {edition.publisher}
              </span>
            )}
            {edition.publicationYear && (
              <span className="px-2 py-0.5 rounded text-[11px] font-inter bg-[var(--stone-gray-alpha)]/50 text-[var(--sacred-ivory)]/70 border border-white/5">
                {edition.publicationYear}
              </span>
            )}
            {edition.format && (
              <span className="px-2 py-0.5 rounded text-[11px] font-inter bg-[var(--stone-gray-alpha)]/50 text-[var(--sacred-ivory)]/70 border border-white/5">
                {edition.format}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Title, Author, Reading State Controls, Queue Button */}
      <div className="flex flex-col">
        {/* Ownership Badge */}
        <div className="mb-2">
          {isOwned ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-inter font-medium bg-[var(--ancient-gold-alpha-soft)] text-[var(--ancient-gold-bright)] border border-[var(--ancient-gold-warm)]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--byzantine-gold)]" />
              Exemplar na sua biblioteca
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-inter font-medium bg-white/5 text-[var(--sacred-ivory)]/60 border border-white/10">
              Obra fora da biblioteca própria
            </span>
          )}
        </div>

        <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-[var(--parchment)] leading-tight">
          {work.title}
        </h1>

        <p className="font-cormorant text-lg sm:text-xl italic text-[var(--ancient-gold-bright)] mt-1">
          {work.author}
        </p>

        {/* Original metadata */}
        <div className="flex flex-wrap items-center gap-x-3 text-xs font-inter text-[var(--sacred-ivory)]/50 mt-2">
          {work.originalTitle && (
            <span>Original: <em className="font-cormorant italic text-[var(--sacred-ivory)]/70">{work.originalTitle}</em></span>
          )}
          {work.originalPublicationYear && (
            <span>
              Ano original: {work.originalPublicationYear < 0 ? `${Math.abs(work.originalPublicationYear)} a.C.` : work.originalPublicationYear}
            </span>
          )}
        </div>

        {/* Reading State Control (For Owned Items) */}
        {isOwned && (
          <div className="mt-6 pt-5 border-t border-[var(--ancient-gold-alpha-soft)]/60">
            <span className="block text-xs font-cinzel font-semibold tracking-wider text-[var(--ancient-gold)] uppercase mb-2">
              Estado de leitura
            </span>
            <div className="inline-flex p-1 rounded-lg bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] gap-1">
              <button
                type="button"
                onClick={() => onReadingStatusChange("unread")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-inter transition-all ${
                  currentStatus === "unread"
                    ? "bg-[var(--cathedral-void)] text-[var(--parchment)] font-medium shadow-sm border border-white/10"
                    : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Não lido</span>
              </button>
              <button
                type="button"
                onClick={() => onReadingStatusChange("reading")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-inter transition-all ${
                  currentStatus === "reading"
                    ? "bg-amber-500/20 text-amber-300 font-medium shadow-sm border border-amber-500/40"
                    : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lendo</span>
              </button>
              <button
                type="button"
                onClick={() => onReadingStatusChange("read")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-inter transition-all ${
                  currentStatus === "read"
                    ? "bg-[var(--byzantine-gold-alpha)] text-[var(--byzantine-gold)] font-medium shadow-sm border border-[var(--byzantine-gold)]/40"
                    : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lido</span>
              </button>
            </div>
          </div>
        )}

        {/* Action buttons: Proxima Queue & Wishlist */}
        <div className="mt-5 flex flex-wrap gap-2.5 items-center">
          <button
            type="button"
            onClick={onToggleQueue}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-cinzel tracking-wider uppercase transition-all duration-300 border ${
              isInQueue
                ? "bg-[var(--byzantine-gold-alpha)] border-[var(--byzantine-gold)] text-[var(--byzantine-gold)]"
                : "bg-[var(--stone-gray-alpha)]/40 border-[var(--ancient-gold-alpha-soft)] text-[var(--parchment)] hover:border-[var(--ancient-gold-warm)]/60"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isInQueue ? "fill-current" : ""}`} />
            <span>{isInQueue ? "Nas próximas leituras" : "Adicionar às próximas"}</span>
          </button>

          <button
            type="button"
            onClick={onToggleWishlist}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-cinzel tracking-wider uppercase transition-all duration-300 border ${
              isInWishlist
                ? "bg-rose-950/40 border-rose-500/50 text-rose-300"
                : "bg-[var(--stone-gray-alpha)]/40 border-[var(--ancient-gold-alpha-soft)] text-[var(--parchment)] hover:border-[var(--ancient-gold-warm)]/60"
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
            <span>{isInWishlist ? "Na lista de desejos" : "Lista de desejos"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetailHero;
