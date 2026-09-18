import React from "react";
import { Search, Plus, X } from "lucide-react";
import { ReadingStatus } from "@/types/bibliotheca";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | ReadingStatus;
  onStatusFilterChange: (status: "all" | ReadingStatus) => void;
  onAddBookClick?: () => void;
}

const STATUS_FILTERS: Array<{ id: "all" | ReadingStatus; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "unread", label: "Não lidos" },
  { id: "reading", label: "Lendo" },
  { id: "read", label: "Lidos" }
];

export function SearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddBookClick
}: SearchBarProps) {
  return (
    <div className="space-y-4 mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with dark glass & gold focus ring */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sacred-ivory)]/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, autor..."
            className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-[var(--stone-gray-alpha)]/50 border border-[var(--ancient-gold-alpha-soft)] text-sm text-[var(--parchment)] placeholder:text-[var(--sacred-ivory)]/40 focus:outline-none focus:border-[var(--ancient-gold-warm)] focus:ring-1 focus:ring-[var(--ancient-gold-glow)] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--sacred-ivory)]/50 hover:text-[var(--parchment)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Gold Accent Action: + Adicionar livro */}
        <button
          type="button"
          onClick={onAddBookClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] font-cinzel font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_2px_12px_rgba(205,154,43,0.25)] hover:shadow-[0_4px_20px_rgba(205,154,43,0.4)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Adicionar livro</span>
        </button>
      </div>

      {/* Status Filter Chips: Todos · Não lidos · Lendo · Lidos */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" role="tablist">
        {STATUS_FILTERS.map((filter) => {
          const isActive = statusFilter === filter.id;
          return (
            <button
              key={filter.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onStatusFilterChange(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-inter transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[var(--byzantine-gold-alpha)] border border-[var(--byzantine-gold)]/60 text-[var(--byzantine-gold)] font-medium"
                  : "bg-[var(--stone-gray-alpha)]/30 border border-[var(--ancient-gold-alpha-soft)] text-[var(--sacred-ivory)]/70 hover:text-[var(--parchment)] hover:border-[var(--ancient-gold-warm)]/40"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;
