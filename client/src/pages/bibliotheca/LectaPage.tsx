import React from "react";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { PageHeader } from "@/components/bibliotheca/PageHeader";
import { HistoryItemCard } from "@/components/bibliotheca/HistoryItemCard";
import { EmptyState } from "@/components/bibliotheca/EmptyState";

export function LectaPage() {
  const { readingRecords, works, editions, libraryItems } = useBibliotheca();

  // Sort reading records: newest finishedAt first; records with undefined date follow
  const sortedRecords = [...readingRecords].sort((a, b) => {
    if (!a.finishedAt) return 1;
    if (!b.finishedAt) return -1;
    return new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime();
  });

  const countLabel = `${sortedRecords.length} ${sortedRecords.length === 1 ? "leitura concluída" : "leituras concluídas"}`;

  return (
    <AppShell>
      <PageHeader
        latinTitle="Lecta"
        subtitle="Histórico de leitura"
        countLabel={sortedRecords.length > 0 ? countLabel : undefined}
      />

      {sortedRecords.length === 0 ? (
        <EmptyState
          iconName="BookCheck"
          latinTitle="Lecta"
          subtitle="Histórico de leitura"
          description="Seu histórico de leitura aparecerá aqui. Conclua uma leitura ou registre leituras passadas para acompanhar seu histórico."
          actionText="Ver minha biblioteca"
          actionHref="/library"
        />
      ) : (
        <div className="space-y-3 max-w-3xl">
          <p className="font-cormorant text-sm italic text-[var(--sacred-ivory)]/60 mb-2">
            Registro cronológico de todas as leituras concluídas, abrangendo tanto volumes do seu acervo atual quanto obras lidas anteriormente.
          </p>

          {sortedRecords.map((record) => {
            const work = works.find((w) => w.id === record.workId);
            const edition = editions.find(
              (e) => (record.editionId && e.id === record.editionId) || e.workId === record.workId
            );
            const isOwned = libraryItems.some(
              (item) => edition && item.editionId === edition.id
            );

            if (!work) return null;

            return (
              <HistoryItemCard
                key={record.id}
                record={record}
                work={work}
                edition={edition}
                isOwned={isOwned}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

export default LectaPage;
