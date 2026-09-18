import React, { useState, useMemo } from "react";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { PageHeader } from "@/components/bibliotheca/PageHeader";
import { SearchBar } from "@/components/bibliotheca/SearchBar";
import { BookGrid } from "@/components/bibliotheca/BookGrid";
import { AddBookModal } from "@/components/bibliotheca/AddBookModal";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { ReadingStatus } from "@/types/bibliotheca";

export function LibraryPage() {
  const { getLibraryCards, editions } = useBibliotheca();
  const allBooks = getLibraryCards();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReadingStatus>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const editionMap = useMemo(() => new Map(editions.map((e) => [e.id, e])), [editions]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      if (statusFilter !== "all" && book.readingStatus !== statusFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const edition = editionMap.get(book.editionId);
        return (
          book.title.toLowerCase().includes(query) ||
          (book.originalTitle?.toLowerCase().includes(query) ?? false) ||
          book.author.toLowerCase().includes(query) ||
          (book.publisher?.toLowerCase().includes(query) ?? false) ||
          (edition?.translator?.toLowerCase().includes(query) ?? false) ||
          (edition?.isbn?.toLowerCase().includes(query) ?? false)
        );
      }

      return true;
    });
  }, [allBooks, searchQuery, statusFilter, editionMap]);

  const countLabel = `${filteredBooks.length} ${filteredBooks.length === 1 ? "livro" : "livros"}`;

  return (
    <AppShell>
      <PageHeader latinTitle="Bibliotheca" subtitle="Minha biblioteca" countLabel={countLabel} />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddBookClick={() => setModalOpen(true)}
      />

      <BookGrid
        books={filteredBooks}
        emptyMessage={
          searchQuery
            ? `Nenhum livro encontrado para "${searchQuery}".`
            : "Nenhum livro cadastrado nesta seção."
        }
        onAddClick={() => setModalOpen(true)}
      />

      <AddBookModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppShell>
  );
}

export default LibraryPage;
