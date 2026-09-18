import React from "react";

interface RecognizingPanelProps {
  mode: "shelf" | "cover";
}

const COPY = {
  shelf: "Verificando livros…",
  cover: "Verificando livro…",
};

export function RecognizingPanel({ mode }: RecognizingPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 px-8">
      {/* Mechanical spinner — no fake progress */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--ancient-gold-alpha-soft)]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--ancient-gold-warm)] animate-spin" />
      </div>
      <p className="font-inter text-sm text-[var(--sacred-ivory)]/70 tracking-wide">
        {COPY[mode]}
      </p>
    </div>
  );
}

export default RecognizingPanel;
