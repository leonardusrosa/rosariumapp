import React from "react";
import { Link } from "wouter";
import { Work, Edition, ReadingQueueItem } from "@/types/bibliotheca";
import { BookCover } from "./BookCover";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

interface QueueItemCardProps {
  item: ReadingQueueItem;
  work: Work;
  edition?: Edition;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function QueueItemCard({
  item,
  work,
  edition,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove
}: QueueItemCardProps) {
  const romanPos = ROMAN_NUMERALS[item.position - 1] || String(item.position);

  const fallbackCover = {
    style: "minimal" as const,
    primaryColor: "#1a1d20",
    accentColor: "#c89f55",
    textColor: "#ede8dd"
  };

  return (
    <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[var(--stone-gray-alpha)]/25 hover:bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] transition-all group">
      {/* Position indicator */}
      <div className="w-9 text-center font-cinzel text-lg font-bold text-[var(--ancient-gold)]">
        {romanPos}
      </div>

      {/* Cover thumbnail */}
      <Link href={`/book/${work.id}`} className="block w-16 sm:w-20 aspect-[2/3] flex-shrink-0 rounded overflow-hidden shadow border border-white/10 group-hover:border-[var(--ancient-gold-warm)]/40 transition-colors">
        <BookCover
          title={work.title}
          author={work.author}
          cover={edition?.cover || fallbackCover}
        />
      </Link>

      {/* Book Metadata */}
      <div className="flex-1 min-w-0">
        <Link href={`/book/${work.id}`} className="block">
          <h3 className="font-cinzel text-sm sm:text-base font-semibold text-[var(--parchment)] group-hover:text-[var(--ancient-gold-bright)] transition-colors truncate">
            {work.title}
          </h3>
        </Link>
        <p className="font-cormorant text-xs sm:text-sm italic text-[var(--sacred-ivory)]/70 truncate mt-0.5">
          {work.author}
        </p>
        {edition?.publisher && (
          <span className="inline-block text-[11px] font-inter text-[var(--sacred-ivory)]/50 mt-1">
            {edition.publisher} {edition.publicationYear ? `(${edition.publicationYear})` : ""}
          </span>
        )}
      </div>

      {/* Reorder & Remove Actions */}
      <div className="flex items-center gap-1">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            title="Mover para cima"
            className="p-1.5 rounded hover:bg-[var(--stone-gray-alpha)] text-[var(--sacred-ivory)]/60 hover:text-[var(--ancient-gold-bright)] disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            title="Mover para baixo"
            className="p-1.5 rounded hover:bg-[var(--stone-gray-alpha)] text-[var(--sacred-ivory)]/60 hover:text-[var(--ancient-gold-bright)] disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          title="Remover da fila"
          className="p-2 rounded hover:bg-rose-950/30 text-[var(--sacred-ivory)]/50 hover:text-rose-400 transition-colors ml-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default QueueItemCard;
