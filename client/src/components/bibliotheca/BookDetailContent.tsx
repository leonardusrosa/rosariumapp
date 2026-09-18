import React, { useState, useEffect } from "react";
import { BookEnrichment, ReadingStatus, SpoilerMode } from "@/types/bibliotheca";
import { Sparkles, Eye, ShieldAlert, BookMarked } from "lucide-react";

interface BookDetailContentProps {
  enrichment: BookEnrichment;
  readingStatus?: ReadingStatus;
}

export function BookDetailContent({
  enrichment,
  readingStatus = "unread"
}: BookDetailContentProps) {
  // Determine initial default spoiler mode based on reading status
  const getDefaultMode = (status: ReadingStatus): SpoilerMode => {
    if (status === "read") return "full-analysis";
    if (status === "reading") return "reading-guide";
    return "no-spoilers";
  };

  const [spoilerMode, setSpoilerMode] = useState<SpoilerMode>(() =>
    getDefaultMode(readingStatus)
  );

  // Auto-adapt when reading status changes
  useEffect(() => {
    setSpoilerMode(getDefaultMode(readingStatus));
  }, [readingStatus]);

  const activeSynopsis =
    spoilerMode === "full-analysis"
      ? enrichment.synopsis.fullAnalysis
      : spoilerMode === "reading-guide"
      ? enrichment.synopsis.readingGuide
      : enrichment.synopsis.noSpoilers;

  return (
    <div className="py-8 space-y-8 border-b border-[var(--ancient-gold-alpha-soft)]">
      {/* Restrained Future AI Indicator Badge */}
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[var(--stone-gray-alpha)]/30 border border-[var(--ancient-gold-alpha-soft)]/50 text-[var(--ancient-gold-bright)] text-xs font-inter">
        <Sparkles className="w-4 h-4 flex-shrink-0 text-[var(--ancient-gold)]" />
        <span className="text-[var(--sacred-ivory)]/70">
          Síntese, contexto e conexões preparados na arquitetura para futuro enriquecimento inteligente.
        </span>
      </div>

      {/* Synopsis Section with Spoiler Control */}
      <section aria-labelledby="synopsis-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h2
            id="synopsis-heading"
            className="font-cinzel text-lg font-semibold tracking-wider text-[var(--parchment)]"
          >
            Sinopse & Visão Geral
          </h2>

          {/* Elegant Secondary Spoiler Mode Selector */}
          <div
            role="group"
            aria-label="Modo de revelação de conteúdo"
            className="inline-flex p-0.5 rounded-lg bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] text-xs font-inter self-start sm:self-auto"
          >
            <button
              type="button"
              onClick={() => setSpoilerMode("no-spoilers")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                spoilerMode === "no-spoilers"
                  ? "bg-[var(--cathedral-void)] text-[var(--ancient-gold-bright)] font-medium shadow-sm border border-[var(--ancient-gold-warm)]/30"
                  : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Sem spoilers</span>
            </button>
            <button
              type="button"
              onClick={() => setSpoilerMode("reading-guide")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                spoilerMode === "reading-guide"
                  ? "bg-[var(--cathedral-void)] text-[var(--ancient-gold-bright)] font-medium shadow-sm border border-[var(--ancient-gold-warm)]/30"
                  : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
              }`}
            >
              <BookMarked className="w-3 h-3" />
              <span>Guia de leitura</span>
            </button>
            <button
              type="button"
              onClick={() => setSpoilerMode("full-analysis")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                spoilerMode === "full-analysis"
                  ? "bg-[var(--cathedral-void)] text-[var(--byzantine-gold)] font-medium shadow-sm border border-[var(--byzantine-gold)]/40"
                  : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Análise completa</span>
            </button>
          </div>
        </div>

        <p className="font-cormorant text-base sm:text-lg text-[var(--parchment)]/90 leading-relaxed max-w-3xl">
          {activeSynopsis}
        </p>
      </section>

      {/* Literary & Historical Context Section */}
      <section aria-labelledby="context-heading">
        <h2
          id="context-heading"
          className="font-cinzel text-lg font-semibold tracking-wider text-[var(--parchment)] mb-2"
        >
          Contexto Histórico e Literário
        </h2>
        <p className="font-cormorant text-base sm:text-lg text-[var(--parchment)]/80 leading-relaxed max-w-3xl">
          {enrichment.context}
        </p>
      </section>

      {/* Interesting Facts */}
      {enrichment.facts.length > 0 && (
        <section aria-labelledby="facts-heading">
          <h2
            id="facts-heading"
            className="font-cinzel text-lg font-semibold tracking-wider text-[var(--parchment)] mb-3"
          >
            Fatos Notáveis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {enrichment.facts.map((fact, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg bg-[var(--stone-gray-alpha)]/30 border border-[var(--ancient-gold-alpha-soft)]/60 flex items-start gap-3"
              >
                <span className="font-cinzel text-xs text-[var(--ancient-gold)] font-bold">
                  {index + 1}.
                </span>
                <p className="font-inter text-xs text-[var(--sacred-ivory)]/75 leading-relaxed">
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Themes and Concepts */}
      {enrichment.themes.length > 0 && (
        <section aria-labelledby="themes-heading">
          <h2
            id="themes-heading"
            className="font-cinzel text-xs font-semibold tracking-wider uppercase text-[var(--ancient-gold)] mb-2.5"
          >
            Temas e Conceitos
          </h2>
          <div className="flex flex-wrap gap-2">
            {enrichment.themes.map((theme, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-inter bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] text-[var(--parchment)]"
              >
                {theme}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default BookDetailContent;
