import React from "react";
import { Link } from "wouter";
import { Work, Edition, ReadingRecord } from "@/types/bibliotheca";
import { BookCover } from "./BookCover";
import { CalendarCheck, CheckCircle2 } from "lucide-react";

interface HistoryItemCardProps {
  record: ReadingRecord;
  work: Work;
  edition?: Edition;
  isOwned: boolean;
}

export function HistoryItemCard({
  record,
  work,
  edition,
  isOwned
}: HistoryItemCardProps) {
  const fallbackCover = {
    style: "minimal" as const,
    primaryColor: "#1a1d20",
    accentColor: "#c89f55",
    textColor: "#ede8dd"
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Data não informada";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
      });
    } catch {
      return isoString;
    }
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

      {/* Book Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {isOwned ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-inter bg-[var(--ancient-gold-alpha-soft)] text-[var(--ancient-gold-bright)] border border-[var(--ancient-gold-warm)]/30">
              <CheckCircle2 className="w-3 h-3" />
              Na biblioteca
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-inter bg-white/5 text-[var(--sacred-ivory)]/60 border border-white/10">
              Lido (fora do acervo)
            </span>
          )}
        </div>

        <Link href={`/book/${work.id}`} className="block">
          <h3 className="font-cinzel text-sm sm:text-base font-semibold text-[var(--parchment)] group-hover:text-[var(--ancient-gold-bright)] transition-colors truncate">
            {work.title}
          </h3>
        </Link>
        <p className="font-cormorant text-xs sm:text-sm italic text-[var(--sacred-ivory)]/70 truncate mt-0.5">
          {work.author}
        </p>

        {/* Completion date */}
        <div className="flex items-center gap-1.5 text-xs font-inter text-[var(--sacred-ivory)]/50 mt-2">
          <CalendarCheck className="w-3.5 h-3.5 text-[var(--ancient-gold)]/80" />
          <span className="capitalize">Concluído em {formatDate(record.finishedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default HistoryItemCard;
