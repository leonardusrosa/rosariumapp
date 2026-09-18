import React from "react";
import { BookOpen, Check, Clock, Bookmark } from "lucide-react";
import { ReadingStatus } from "@/types/bibliotheca";

interface ReadingStateSelectorProps {
  readingStatus: ReadingStatus;
  addToQueue: boolean;
  onReadingStatusChange: (s: ReadingStatus) => void;
  onAddToQueueChange: (v: boolean) => void;
}

const STATUSES: { id: ReadingStatus; label: string; icon: React.ReactNode; activeClass: string }[] = [
  {
    id: "unread",
    label: "Não lido",
    icon: <Clock className="w-3.5 h-3.5" />,
    activeClass: "bg-[var(--cathedral-void)] text-[var(--parchment)] border-white/10",
  },
  {
    id: "reading",
    label: "Lendo",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    activeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "read",
    label: "Lido",
    icon: <Check className="w-3.5 h-3.5" />,
    activeClass: "bg-[var(--byzantine-gold-alpha)] text-[var(--byzantine-gold)] border-[var(--byzantine-gold)]/40",
  },
];

export function ReadingStateSelector({
  readingStatus,
  addToQueue,
  onReadingStatusChange,
  onAddToQueueChange,
}: ReadingStateSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <span className="block text-xs font-cinzel font-semibold tracking-wider text-[var(--ancient-gold)] uppercase mb-2">
          Estado de leitura
        </span>
        <div className="inline-flex p-1 rounded-lg bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] gap-1">
          {STATUSES.map((s) => {
            const isActive = readingStatus === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onReadingStatusChange(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-inter transition-all border ${
                  isActive
                    ? s.activeClass + " font-medium shadow-sm"
                    : "border-transparent text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer group w-fit">
        <input
          type="checkbox"
          checked={addToQueue}
          onChange={(e) => onAddToQueueChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
            addToQueue
              ? "bg-[var(--byzantine-gold)] border-[var(--byzantine-gold)]"
              : "border-[var(--ancient-gold-alpha-soft)] bg-transparent group-hover:border-[var(--ancient-gold-warm)]/50"
          }`}
        >
          {addToQueue && <Check className="w-2.5 h-2.5 text-[var(--cathedral-void)]" />}
        </div>
        <span className="flex items-center gap-1.5 text-xs font-inter text-[var(--sacred-ivory)]/80 group-hover:text-[var(--parchment)] transition-colors">
          <Bookmark className="w-3.5 h-3.5 text-[var(--ancient-gold)]/70" />
          Adicionar às próximas leituras
        </span>
      </label>
    </div>
  );
}

export default ReadingStateSelector;
