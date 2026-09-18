import React from "react";
import { Camera, Scan, Barcode, Hash, PenLine } from "lucide-react";

export type IngestionMethodId = "shelf" | "cover" | "barcode" | "isbn" | "manual";

interface IngestionMethodSelectProps {
  onSelect: (method: IngestionMethodId) => void;
  onClose: () => void;
}

const METHODS = [
  {
    id: "shelf" as const,
    icon: <Scan className="w-5 h-5" />,
    title: "Fotografar estante",
    description: "Identifique vários livros de uma só vez",
  },
  {
    id: "cover" as const,
    icon: <Camera className="w-5 h-5" />,
    title: "Fotografar capa",
    description: "Identifique um livro pela capa",
  },
  {
    id: "barcode" as const,
    icon: <Barcode className="w-5 h-5" />,
    title: "Escanear código de barras",
    description: "Leia o ISBN diretamente do livro",
    highlight: true,
  },
  {
    id: "isbn" as const,
    icon: <Hash className="w-5 h-5" />,
    title: "Inserir ISBN",
    description: "Digite o ISBN da sua edição",
  },
  {
    id: "manual" as const,
    icon: <PenLine className="w-5 h-5" />,
    title: "Adicionar manualmente",
    description: "Preencha os dados do livro",
    fullWidth: true,
  },
];

export function IngestionMethodSelect({ onSelect, onClose }: IngestionMethodSelectProps) {
  return (
    <div className="p-5 sm:p-7">
      <div className="mb-5">
        <h2 className="font-cinzel text-base font-bold tracking-wide text-[var(--parchment)]">
          Adicionar livro
        </h2>
        <p className="text-xs font-inter text-[var(--sacred-ivory)]/60 mt-0.5">
          Como deseja catalogar esta obra?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className={`group flex items-center gap-3.5 p-3.5 rounded-xl bg-[var(--stone-gray-alpha)]/40 border transition-all duration-200 text-left ${
              m.fullWidth ? "sm:col-span-2" : ""
            } ${
              m.highlight
                ? "border-[var(--ancient-gold-alpha-medium)] bg-[var(--stone-gray-alpha)]/60 shadow-[0_0_15px_rgba(201,163,94,0.06)]"
                : "border-[var(--ancient-gold-alpha-soft)] hover:border-[var(--ancient-gold-warm)]/60"
            } hover:bg-[var(--stone-gray-alpha)]/80`}
          >
            <div className="p-2 rounded-lg bg-[var(--ancient-gold-alpha-soft)] text-[var(--ancient-gold-bright)] group-hover:bg-[var(--byzantine-gold-alpha)] group-hover:text-[var(--byzantine-gold)] transition-colors shrink-0">
              {m.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-cinzel text-xs font-semibold tracking-wide text-[var(--parchment)]">
                {m.title}
              </div>
              <div className="text-[11px] font-inter text-[var(--sacred-ivory)]/60 mt-0.5 leading-snug">
                {m.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full py-2 text-xs font-inter text-[var(--sacred-ivory)]/50 hover:text-[var(--sacred-ivory)]/80 transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
}

export default IngestionMethodSelect;
