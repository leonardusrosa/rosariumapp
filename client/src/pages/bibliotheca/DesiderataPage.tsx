import React from "react";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { PageHeader } from "@/components/bibliotheca/PageHeader";
import { WishlistItemCard } from "@/components/bibliotheca/WishlistItemCard";
import { EmptyState } from "@/components/bibliotheca/EmptyState";

export function DesiderataPage() {
  const { wishlistItems, works, editions, removeFromWishlist } = useBibliotheca();

  const countLabel = `${wishlistItems.length} ${wishlistItems.length === 1 ? "desejado" : "desejados"}`;

  return (
    <AppShell>
      <PageHeader
        latinTitle="Desiderata"
        subtitle="Lista de desejos"
        countLabel={wishlistItems.length > 0 ? countLabel : undefined}
      />

      {wishlistItems.length === 0 ? (
        <EmptyState
          iconName="Heart"
          latinTitle="Desiderata"
          subtitle="Lista de desejos"
          description="Livros que você deseja adquirir aparecerão aqui. Encontre obras e salve edições pretendidas para planejar futuras aquisições."
          actionText="Explorar minha biblioteca"
          actionHref="/library"
        />
      ) : (
        <div className="space-y-3 max-w-3xl">
          <p className="font-cormorant text-sm italic text-[var(--sacred-ivory)]/60 mb-2">
            Volumes e obras que você planeja adquirir para enriquecer sua biblioteca física.
          </p>

          {wishlistItems.map((item) => {
            const work = works.find((w) => w.id === item.workId);
            const edition = editions.find(
              (e) => (item.editionId && e.id === item.editionId) || e.workId === item.workId
            );

            if (!work) return null;

            return (
              <WishlistItemCard
                key={item.id}
                item={item}
                work={work}
                edition={edition}
                onRemove={() => removeFromWishlist(item.id)}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

export default DesiderataPage;
