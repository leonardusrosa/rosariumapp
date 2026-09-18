import React from "react";
import { useRoute, Link } from "wouter";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { PageHeader } from "@/components/bibliotheca/PageHeader";
import { ArrowLeft, BookMarked, UserCheck, Layers } from "lucide-react";

interface DetailPlaceholderPageProps {
  type: "book" | "author" | "collection";
}

export function DetailPlaceholderPage({ type }: DetailPlaceholderPageProps) {
  const [, bookParams] = useRoute("/book/:id");
  const [, authorParams] = useRoute("/author/:id");
  const [, collectionParams] = useRoute("/collection/:id");

  const id =
    type === "book"
      ? bookParams?.id
      : type === "author"
      ? authorParams?.id
      : collectionParams?.id;

  const titles = {
    book: {
      latinTitle: "Liber",
      subtitle: "Ficha da edição",
      icon: BookMarked,
      label: "Identificador do livro"
    },
    author: {
      latinTitle: "Auctor",
      subtitle: "Catálogo do autor",
      icon: UserCheck,
      label: "Identificador do autor"
    },
    collection: {
      latinTitle: "Collectio",
      subtitle: "Ficha da coleção",
      icon: Layers,
      label: "Identificador da coleção"
    }
  }[type];

  const Icon = titles.icon;

  return (
    <AppShell>
      <div className="mb-4">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-xs font-cinzel text-[var(--ancient-gold-bright)] hover:text-[var(--byzantine-gold)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a biblioteca</span>
        </Link>
      </div>

      <PageHeader
        latinTitle={titles.latinTitle}
        subtitle={titles.subtitle}
      />

      <div className="py-16 max-w-md mx-auto text-center rounded-xl bg-[var(--stone-gray-alpha)]/30 border border-[var(--ancient-gold-alpha-soft)] p-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-[var(--ancient-gold-alpha-soft)] border border-[var(--ancient-gold-warm)]/30 text-[var(--ancient-gold-bright)]">
          <Icon className="w-6 h-6" />
        </div>

        <h2 className="font-cinzel text-lg font-semibold text-[var(--parchment)] mb-1">
          {titles.subtitle}
        </h2>
        <p className="font-inter text-xs text-[var(--sacred-ivory)]/60 mb-4">
          Esta rota de detalhe foi preparada na arquitetura para as próximas fases.
        </p>
        <div className="inline-block px-3 py-1 rounded bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] text-xs font-mono text-[var(--ancient-gold)]">
          {titles.label}: {id || "não informado"}
        </div>
      </div>
    </AppShell>
  );
}

export default DetailPlaceholderPage;
