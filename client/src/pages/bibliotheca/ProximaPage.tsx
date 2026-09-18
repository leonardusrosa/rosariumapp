import React from "react";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { PageHeader } from "@/components/bibliotheca/PageHeader";
import { QueueItemCard } from "@/components/bibliotheca/QueueItemCard";
import { EmptyState } from "@/components/bibliotheca/EmptyState";

export function ProximaPage() {
  const {
    readingQueue,
    works,
    editions,
    moveQueueItem,
    removeFromQueue
  } = useBibliotheca();

  const sortedQueue = [...readingQueue].sort((a, b) => a.position - b.position);

  const countLabel = `${sortedQueue.length} ${sortedQueue.length === 1 ? "na fila" : "na fila"}`;

  return (
    <AppShell>
      <PageHeader
        latinTitle="Proxima"
        subtitle="Próximas leituras"
        countLabel={sortedQueue.length > 0 ? countLabel : undefined}
      />

      {sortedQueue.length === 0 ? (
        <EmptyState
          iconName="Bookmark"
          latinTitle="Proxima"
          subtitle="Próximas leituras"
          description="Sua fila de próximas leituras está vazia. Adicione livros à fila na página de detalhes para definir sua ordem de leitura."
          actionText="Explorar minha biblioteca"
          actionHref="/library"
        />
      ) : (
        <div className="space-y-3 max-w-3xl">
          <p className="font-cormorant text-sm italic text-[var(--sacred-ivory)]/60 mb-2">
            Ordem cronológica planejada para suas leituras. Use as setas para reorganizar a prioridade.
          </p>

          {sortedQueue.map((item, index) => {
            const work = works.find((w) => w.id === item.workId);
            const edition = editions.find((e) => e.workId === item.workId);

            if (!work) return null;

            return (
              <QueueItemCard
                key={item.id}
                item={item}
                work={work}
                edition={edition}
                isFirst={index === 0}
                isLast={index === sortedQueue.length - 1}
                onMoveUp={() => moveQueueItem(item.id, "up")}
                onMoveDown={() => moveQueueItem(item.id, "down")}
                onRemove={() => removeFromQueue(item.id)}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

export default ProximaPage;
