import React from "react";
import { Link } from "wouter";
import { Work, Edition, WishlistItem } from "@/types/bibliotheca";
import { BookCover } from "./BookCover";
import { Trash2 } from "lucide-react";

interface WishlistItemCardProps {
  item: WishlistItem;
  work: Work;
  edition?: Edition;
  onRemove: () => void;
}

export function WishlistItemCard({
  item,
  work,
  edition,
  onRemove
}: WishlistItemCardProps) {
  const fallbackCover = {
    style: "minimal" as const,
    primaryColor: "#1a1d20",
    accentColor: "#c89f55",
    textColor: "#ede8dd"
  };

  return (
    <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[var(--stone-gray-alpha)]/25 hover:bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] transition-all group">
      {/* Cover thumbnail */}
      <Link
        href={`/book/${work.id}`}
        className="block w-16 sm:w-20 aspect-[2/3] flex-shrink-0 rounded overflow-hidden shadow border border-white/10 group-hover:border-[var(--ancient-gold-warm)]/40 transition-colors"
      >
        <BookCover
          title={work.title}
          author={work.author}
          cover={edition?.cover || fallbackCover}
        />
      </Link>

      {/* Metadata */}
      <div className="flex-1 min-w-0">
        <Link href={`/book/${work.id}`} className="block">
          <h3 className="font-cinzel text-sm sm:text-base font-semibold text-[var(--parchment)] group-hover:text-[var(--ancient-gold-bright)] transition-colors truncate">
            {work.title}
          </h3>
        </Link>
        <p className="font-cormorant text-xs sm:text-sm italic text-[var(--sacred-ivory)]/70 truncate mt-0.5">
          {work.author}
        </p>

        {item.desiredEditionNotes && (
          <p className="font-inter text-xs text-[var(--ancient-gold-bright)]/80 mt-1.5 line-clamp-1">
            Edição desejada: {item.desiredEditionNotes}
          </p>
        )}
      </div>

      {/* Remove from wishlist */}
      <button
        type="button"
        onClick={onRemove}
        title="Remover da lista de desejos"
        className="p-2 rounded hover:bg-rose-950/30 text-[var(--sacred-ivory)]/50 hover:text-rose-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default WishlistItemCard;
