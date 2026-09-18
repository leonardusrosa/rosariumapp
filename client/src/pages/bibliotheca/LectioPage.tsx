import React from "react";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { PageHeader } from "@/components/bibliotheca/PageHeader";
import { BookGrid } from "@/components/bibliotheca/BookGrid";
import { EmptyState } from "@/components/bibliotheca/EmptyState";

export function LectioPage() {
  const { getLectioCards } = useBibliotheca();
  const readingBooks = getLectioCards();

  const countLabel = `${readingBooks.length} ${readingBooks.length === 1 ? "livro" : "livros"}`;

  return (
    <AppShell>
      <PageHeader
        latinTitle="Lectio"
        subtitle="Lendo agora"
        countLabel={readingBooks.length > 0 ? countLabel : undefined}
      />

      {readingBooks.length === 0 ? (
        <EmptyState
          iconName="BookOpen"
          latinTitle="Lectio"
          subtitle="Lendo agora"
          description="Nenhum livro em leitura no momento. Marque um exemplar como 'Lendo' para acompanhar suas leituras ativas aqui."
          actionText="Ver minha biblioteca"
          actionHref="/library"
        />
      ) : (
        <BookGrid books={readingBooks} />
      )}
    </AppShell>
  );
}

export default LectioPage;
