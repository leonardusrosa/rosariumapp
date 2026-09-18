import React from "react";
import { BookCardViewModel } from "@/types/bibliotheca";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: BookCardViewModel[];
  emptyMessage?: string;
  onAddClick?: () => void;
}

export function BookGrid({
  books,
  emptyMessage = "Nenhum livro cadastrado nesta seção.",
  onAddClick,
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-xl bg-[var(--stone-gray-alpha)]/20 border border-[var(--ancient-gold-alpha-soft)] flex flex-col items-center justify-center gap-4">
        <p className="font-cormorant text-lg italic text-[var(--sacred-ivory)]/70 max-w-sm">
          {emptyMessage}
        </p>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="py-2 px-4 rounded-lg bg-[var(--ancient-gold)] hover:bg-[var(--gold-leaf)] text-black text-xs font-medium transition-colors shadow-sm"
          >
            Adicionar Livro
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      aria-label="Grade de livros da biblioteca"
      className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,210px))] gap-4 sm:gap-5 md:gap-6 justify-start items-start"
    >
      {books.map((book) => (
        <BookCard key={book.itemId} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;
