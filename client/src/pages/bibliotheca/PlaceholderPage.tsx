import React from "react";
import { AppShell } from "@/components/bibliotheca/AppShell";
import { PageHeader } from "@/components/bibliotheca/PageHeader";
import { EmptyState } from "@/components/bibliotheca/EmptyState";

interface PlaceholderConfig {
  latinTitle: string;
  subtitle: string;
  description: string;
  iconName: string;
}

const ROUTE_CONFIGS: Record<string, PlaceholderConfig> = {
  reading: {
    latinTitle: "Lectio",
    subtitle: "Lendo agora",
    description: "Nenhum livro em leitura no momento.",
    iconName: "BookOpen"
  },
  next: {
    latinTitle: "Proxima",
    subtitle: "Próximas leituras",
    description: "Sua fila de próximas leituras aparecerá aqui.",
    iconName: "Bookmark"
  },
  read: {
    latinTitle: "Lecta",
    subtitle: "Já lidos",
    description: "Seu histórico de leitura aparecerá aqui.",
    iconName: "BookCheck"
  },
  wishlist: {
    latinTitle: "Desiderata",
    subtitle: "Lista de desejos",
    description: "Livros que você deseja adquirir aparecerão aqui.",
    iconName: "Heart"
  },
  collections: {
    latinTitle: "Collectiones",
    subtitle: "Coleções",
    description: "Organize sua biblioteca em coleções.",
    iconName: "Layers"
  },
  notes: {
    latinTitle: "Notae",
    subtitle: "Notas",
    description: "Suas notas de leitura aparecerão aqui.",
    iconName: "NotebookPen"
  },
  ai: {
    latinTitle: "Sapientia",
    subtitle: "Explorar com IA",
    description: "Converse com a sua biblioteca.",
    iconName: "Sparkles"
  }
};

interface PlaceholderPageProps {
  sectionKey: keyof typeof ROUTE_CONFIGS;
}

export function PlaceholderPage({ sectionKey }: PlaceholderPageProps) {
  const config = ROUTE_CONFIGS[sectionKey] || {
    latinTitle: "Bibliotheca",
    subtitle: "Seção da biblioteca",
    description: "Conteúdo em preparação.",
    iconName: "BookCopy"
  };

  return (
    <AppShell>
      <PageHeader
        latinTitle={config.latinTitle}
        subtitle={config.subtitle}
      />

      <EmptyState
        iconName={config.iconName}
        latinTitle={config.latinTitle}
        subtitle={config.subtitle}
        description={config.description}
      />
    </AppShell>
  );
}

export default PlaceholderPage;
