import React, { useState, useMemo } from "react";
import { Check, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { IdentifiedBookCandidate } from "@/types/bibliotheca";

interface BulkReviewPanelProps {
  candidates: IdentifiedBookCandidate[];
  onCandidatesChange: (candidates: IdentifiedBookCandidate[]) => void;
  onEditCandidate: (id: string) => void;
  onCommit: (selected: IdentifiedBookCandidate[]) => void;
  onBack: () => void;
}

const CONFIDENCE_LABELS: Record<IdentifiedBookCandidate["confidence"], string> = {
  high: "Alta confiança",
  medium: "Revisar",
  low: "Incerto",
};

const CONFIDENCE_CLASS: Record<IdentifiedBookCandidate["confidence"], string> = {
  high: "bg-emerald-950/60 text-emerald-400 border-emerald-700/40",
  medium: "bg-amber-950/60 text-amber-400 border-amber-700/40",
  low: "bg-rose-950/60 text-rose-400 border-rose-700/40",
};

function colorFromString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 30%, 22%)`;
}

function MiniSwatch({ title, author }: { title: string; author?: string }) {
  const color = colorFromString((author || "") + title);
  return (
    <div
      className="w-9 h-12 rounded-sm shrink-0 flex items-end justify-center pb-1 border border-white/10"
      style={{ background: color }}
    >
      <div className="w-5 h-0.5 bg-white/20 rounded-full" />
    </div>
  );
}

export function BulkReviewPanel({
  candidates,
  onCandidatesChange,
  onEditCandidate,
  onCommit,
  onBack,
}: BulkReviewPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const selected = useMemo(() => candidates.filter((c) => c.selected), [candidates]);

  function toggleSelect(id: string) {
    onCandidatesChange(
      candidates.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  }

  function removeCandidate(id: string) {
    onCandidatesChange(candidates.filter((c) => c.id !== id));
  }

  function selectAll() {
    onCandidatesChange(candidates.map((c) => ({ ...c, selected: true })));
  }

  function selectNone() {
    onCandidatesChange(candidates.map((c) => ({ ...c, selected: false })));
  }

  const ctaLabel =
    selected.length === 0
      ? "Nenhum selecionado"
      : selected.length === 1
      ? "Adicionar 1 livro"
      : `Adicionar ${selected.length} livros`;

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-[var(--ancient-gold-alpha-soft)] shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-cinzel text-sm font-bold tracking-wide text-[var(--parchment)] uppercase">
              Livros identificados
            </h2>
            <p className="text-[11px] font-inter text-[var(--sacred-ivory)]/50 mt-0.5">
              {candidates.length} encontrados · {selected.length} selecionados
            </p>
          </div>
          <div className="flex gap-2 text-[11px] font-inter">
            <button
              type="button"
              onClick={selectAll}
              className="text-[var(--ancient-gold)]/80 hover:text-[var(--ancient-gold-bright)] transition-colors"
            >
              Todos
            </button>
            <span className="text-[var(--sacred-ivory)]/30">·</span>
            <button
              type="button"
              onClick={selectNone}
              className="text-[var(--sacred-ivory)]/50 hover:text-[var(--parchment)] transition-colors"
            >
              Nenhum
            </button>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <div className="overflow-y-auto flex-1 px-4 py-2 space-y-1.5">
        {candidates.map((c) => {
          const displayTitle = c.editedTitle || c.title;
          const displayAuthor = c.editedAuthor || c.author;
          return (
            <div
              key={c.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                c.selected
                  ? "bg-[var(--stone-gray-alpha)]/60 border-[var(--ancient-gold-alpha-soft)]"
                  : "bg-transparent border-white/5 opacity-60"
              }`}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggleSelect(c.id)}
                aria-label={c.selected ? "Desselecionar" : "Selecionar"}
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                  c.selected
                    ? "bg-[var(--byzantine-gold)] border-[var(--byzantine-gold)]"
                    : "border-[var(--ancient-gold-alpha-soft)] bg-transparent hover:border-[var(--ancient-gold-warm)]/50"
                }`}
              >
                {c.selected && <Check className="w-3 h-3 text-[var(--cathedral-void)]" />}
              </button>

              {/* Mini swatch */}
              <MiniSwatch title={displayTitle} author={displayAuthor} />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-cinzel text-xs font-semibold text-[var(--parchment)] truncate">
                  {displayTitle}
                </div>
                <div className="text-[11px] font-inter text-[var(--sacred-ivory)]/60 truncate">
                  {displayAuthor || <em className="opacity-60">Autor desconhecido</em>}
                </div>
                {c.possibleEdition?.publisher && (
                  <div className="text-[10px] font-inter text-[var(--sacred-ivory)]/40 truncate">
                    {c.possibleEdition.publisher}
                  </div>
                )}
              </div>

              {/* Confidence + Actions */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-inter border ${CONFIDENCE_CLASS[c.confidence]}`}
                >
                  {CONFIDENCE_LABELS[c.confidence]}
                </span>
                <div className="flex items-center gap-1">
                  {(c.needsReview || c.confidence !== "high") && (
                    <button
                      type="button"
                      onClick={() => onEditCandidate(c.id)}
                      title="Editar"
                      className="p-1 rounded text-[var(--ancient-gold)]/70 hover:text-[var(--ancient-gold-bright)] hover:bg-[var(--ancient-gold-alpha-soft)] transition-all"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeCandidate(c.id)}
                    title="Remover"
                    className="p-1 rounded text-[var(--sacred-ivory)]/40 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-[var(--ancient-gold-alpha-soft)] shrink-0 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-lg text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)] border border-[var(--ancient-gold-alpha-soft)] hover:border-[var(--ancient-gold-warm)]/40 transition-all"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={() => onCommit(selected)}
          disabled={selected.length === 0}
          className="flex-1 py-2.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider uppercase bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(205,154,43,0.2)]"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

export default BulkReviewPanel;
