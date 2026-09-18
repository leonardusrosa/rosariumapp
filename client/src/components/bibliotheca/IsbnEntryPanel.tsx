import React, { useState } from "react";
import { Hash, AlertCircle, Info, RefreshCw } from "lucide-react";
import { normalizeIsbn, validateIsbn } from "@/lib/bibliothecaIngestion";
import { fetchIsbnMetadata, ProviderUnavailableError, buildCandidateFromMetadata } from "@/lib/isbnApi";
import { IdentifiedBookCandidate } from "@/types/bibliotheca";

interface IsbnEntryPanelProps {
  onFound: (candidate: IdentifiedBookCandidate) => void;
  onNotFound: (normalizedIsbn: string) => void;
  onBack: () => void;
}

type LookupState = "idle" | "looking" | "not-found" | "error";

export function IsbnEntryPanel({ onFound, onNotFound, onBack }: IsbnEntryPanelProps) {
  const [raw, setRaw] = useState("");
  const [lookupState, setLookupState] = useState<LookupState>("idle");
  const [validationError, setValidationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const normalized = normalizeIsbn(raw);
  const isLongEnough = normalized.length === 10 || normalized.length === 13;
  const isValid = isLongEnough && validateIsbn(normalized);

  function getValidationMessage(): string {
    if (!raw.trim()) return "";
    if (!isLongEnough) return `ISBN deve ter 10 ou 13 dígitos (atual: ${normalized.length})`;
    if (!isValid) return "Dígito verificador inválido. Confira o código.";
    return "";
  }

  async function handleLookup() {
    const msg = getValidationMessage();
    if (msg) {
      setValidationError(msg);
      return;
    }
    setValidationError("");
    setErrorMessage("");
    setLookupState("looking");

    try {
      const meta = await fetchIsbnMetadata(normalized);
      if (meta) {
        const candidate = buildCandidateFromMetadata(normalized, meta);
        onFound(candidate);
      } else {
        setLookupState("not-found");
      }
    } catch (err) {
      setLookupState("error");
      if (err instanceof ProviderUnavailableError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erro ao consultar o catálogo. Tente novamente.");
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLookup();
  }

  const errMsg = validationError || getValidationMessage();
  const showError = errMsg && raw.trim().length > 0;

  return (
    <div className="p-5 sm:p-7 flex flex-col gap-5">
      <div>
        <h2 className="font-cinzel text-sm font-bold tracking-wide text-[var(--parchment)] uppercase">
          Inserir ISBN
        </h2>
        <p className="text-xs font-inter text-[var(--sacred-ivory)]/60 mt-1">
          ISBN-10 ou ISBN-13. Hífens e espaços são ignorados.
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sacred-ivory)]/40 pointer-events-none" />
          <input
            type="text"
            inputMode="numeric"
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setLookupState("idle");
              setValidationError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="978-85-359-0xxxxxx"
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--stone-gray-alpha)]/50 border text-sm font-inter text-[var(--parchment)] placeholder:text-[var(--sacred-ivory)]/30 focus:outline-none focus:ring-1 transition-all ${
              showError
                ? "border-rose-500/60 focus:border-rose-400 focus:ring-rose-400/20"
                : "border-[var(--ancient-gold-alpha-soft)] focus:border-[var(--ancient-gold-warm)] focus:ring-[var(--ancient-gold-glow)]"
            }`}
          />
        </div>

        {showError && (
          <div className="flex items-center gap-1.5 text-xs font-inter text-rose-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errMsg}
          </div>
        )}

        {lookupState === "not-found" && (
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)]">
            <div className="flex items-start gap-2 text-xs font-inter text-[var(--sacred-ivory)]/70">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--ancient-gold)]/60" />
              Não encontramos dados para este ISBN.
            </div>
            <button
              type="button"
              onClick={() => onNotFound(normalized)}
              className="self-start text-xs font-cinzel font-semibold tracking-wider text-[var(--ancient-gold)] hover:text-[var(--ancient-gold-bright)] underline underline-offset-2 transition-colors"
            >
              Preencher manualmente →
            </button>
          </div>
        )}

        {lookupState === "error" && (
          <div className="flex flex-col gap-2.5 p-3 rounded-lg bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-start gap-2 text-xs font-inter text-rose-300">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
              {errorMessage || "Provedores de metadados temporariamente indisponíveis."}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleLookup}
                className="flex items-center gap-1.5 text-xs font-inter font-medium text-[var(--ancient-gold)] hover:text-[var(--ancient-gold-bright)] transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Tentar novamente
              </button>
              <button
                type="button"
                onClick={() => onNotFound(normalized)}
                className="text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)] underline underline-offset-2 transition-colors"
              >
                Preencher manualmente
              </button>
            </div>
          </div>
        )}
      </div>

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
          onClick={handleLookup}
          disabled={!raw.trim() || lookupState === "looking"}
          className="flex-1 py-2 rounded-lg text-xs font-cinzel font-semibold tracking-wider uppercase bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {lookupState === "looking" ? "Consultando dados da edição…" : "Consultar"}
        </button>
      </div>
    </div>
  );
}

export default IsbnEntryPanel;
