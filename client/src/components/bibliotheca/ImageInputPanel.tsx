import React, { useRef, useState, useEffect } from "react";
import { Camera, ImageIcon, X, RefreshCw } from "lucide-react";

interface ImageInputPanelProps {
  mode: "shelf" | "cover";
  onCapture: (objectUrl: string) => void;
  onBack: () => void;
}

const FRAME_HINTS = {
  shelf: {
    label: "Aponte para a estante",
    hint: "Enquadre as lombadas dos livros horizontalmente",
    frameClass: "aspect-[16/9]",
    guideStyle: { top: "15%", left: "5%", right: "5%", bottom: "15%" },
  },
  cover: {
    label: "Aponte para a capa",
    hint: "Centralize a capa do livro no quadro",
    frameClass: "aspect-[3/4]",
    guideStyle: { top: "8%", left: "12%", right: "12%", bottom: "8%" },
  },
};

export function ImageInputPanel({ mode, onCapture, onBack }: ImageInputPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const config = FRAME_HINTS[mode];

  // Revoke old URLs on change or unmount
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setFilename(file.name);
    // Reset input so same file can be re-selected after replace
    e.target.value = "";
  }

  function handleReplace() {
    inputRef.current?.click();
  }

  function handleRemove() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setFilename("");
  }

  function handleVerify() {
    if (objectUrl) {
      // Pass URL to parent; parent must revoke after async is done
      onCapture(objectUrl);
    }
  }

  return (
    <div className="p-5 sm:p-7 flex flex-col gap-5">
      <div>
        <h2 className="font-cinzel text-sm font-bold tracking-wide text-[var(--parchment)] uppercase">
          {mode === "shelf" ? "Fotografar estante" : "Fotografar capa"}
        </h2>
        <p className="text-xs font-inter text-[var(--sacred-ivory)]/60 mt-1">{config.hint}</p>
      </div>

      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleFileChange}
      />

      {!objectUrl ? (
        /* Viewfinder placeholder */
        <div
          className={`relative w-full ${config.frameClass} bg-black/70 rounded-xl border-2 border-dashed border-[var(--ancient-gold-alpha-soft)] overflow-hidden flex items-center justify-center cursor-pointer group`}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Selecionar imagem"
        >
          {/* Frame guide corners */}
          <div
            className="absolute border-2 border-[var(--ancient-gold-warm)]/60 rounded-sm pointer-events-none"
            style={config.guideStyle as React.CSSProperties}
          />
          <div className="flex flex-col items-center gap-3 text-[var(--sacred-ivory)]/40 group-hover:text-[var(--sacred-ivory)]/70 transition-colors">
            <Camera className="w-10 h-10" />
            <span className="text-xs font-inter">{config.label}</span>
            <span className="text-[11px] font-inter text-[var(--sacred-ivory)]/30">
              Toque para selecionar ou capturar
            </span>
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="space-y-2">
          <div className={`relative w-full ${config.frameClass} rounded-xl overflow-hidden bg-black`}>
            <img
              src={objectUrl}
              alt="Imagem selecionada"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-[var(--ancient-gold)]/70 shrink-0" />
            <span className="text-[11px] font-inter text-[var(--sacred-ivory)]/60 truncate flex-1">
              {filename}
            </span>
            <button
              type="button"
              onClick={handleReplace}
              className="flex items-center gap-1 text-[11px] font-inter text-[var(--ancient-gold)]/80 hover:text-[var(--ancient-gold-bright)] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Substituir
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-[11px] font-inter text-[var(--sacred-ivory)]/50 hover:text-rose-400 transition-colors"
            >
              <X className="w-3 h-3" />
              Remover
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)] border border-[var(--ancient-gold-alpha-soft)] hover:border-[var(--ancient-gold-warm)]/40 transition-all"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleVerify}
          disabled={!objectUrl}
          className="flex-1 py-2 rounded-lg text-xs font-cinzel font-semibold tracking-wider uppercase bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(205,154,43,0.2)]"
        >
          Verificar
        </button>
      </div>
    </div>
  );
}

export default ImageInputPanel;
