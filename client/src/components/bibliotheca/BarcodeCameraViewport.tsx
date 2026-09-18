import React from "react";
import { Camera, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export type BarcodeCameraStatus =
  | "initializing"
  | "scanning"
  | "detected"
  | "resolving"
  | "not-found"
  | "provider-error"
  | "permission-denied"
  | "camera-unavailable"
  | "error";

interface BarcodeCameraViewportProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  status: BarcodeCameraStatus;
  detectedIsbn: string;
  errorMessage: string;
  onManualEntry: (isbn?: string) => void;
  onScanAgain: () => void;
  onRetryMetadata: () => void;
}

export function BarcodeCameraViewport({
  videoRef,
  status,
  detectedIsbn,
  errorMessage,
  onManualEntry,
  onScanAgain,
  onRetryMetadata,
}: BarcodeCameraViewportProps) {
  return (
    <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col items-center">
      {/* Viewport container */}
      <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-[var(--ancient-gold-alpha-soft)] shadow-2xl flex items-center justify-center">
        {/* Live Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            status === "scanning" ? "opacity-100" : "opacity-20"
          }`}
        />

        {/* Barcode Framing Overlay (Bibliotheca aesthetic) */}
        {status === "scanning" && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="relative w-full h-28 max-w-[260px] rounded-lg border border-[var(--ancient-gold)]/60 shadow-[0_0_25px_rgba(201,163,94,0.15)] flex items-center justify-center">
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[var(--ancient-gold-bright)]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[var(--ancient-gold-bright)]" />
              <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[var(--ancient-gold-bright)]" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[var(--ancient-gold-bright)]" />
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold-bright)] to-transparent opacity-80 animate-pulse" />
            </div>

            <div className="mt-4 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-inter text-[var(--sacred-ivory)]/70 tracking-wide backdrop-blur-md">
              Procurando código ISBN…
            </div>
          </div>
        )}

        {/* State: Initializing */}
        {status === "initializing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-center p-4">
            <Loader2 className="w-6 h-6 text-[var(--ancient-gold)] animate-spin" />
            <p className="text-xs font-inter text-[var(--sacred-ivory)]/70">
              Iniciando câmera…
            </p>
          </div>
        )}

        {/* State: Resolving metadata */}
        {(status === "detected" || status === "resolving") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 text-center p-4">
            <Loader2 className="w-7 h-7 text-[var(--ancient-gold)] animate-spin" />
            <div>
              <div className="text-xs font-cinzel font-semibold tracking-wider text-[var(--parchment)]">
                ISBN {detectedIsbn}
              </div>
              <p className="text-[11px] font-inter text-[var(--sacred-ivory)]/60 mt-1">
                Consultando catálogo de obras…
              </p>
            </div>
          </div>
        )}

        {/* State: Permission Denied */}
        {status === "permission-denied" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/95 text-center p-5">
            <Camera className="w-8 h-8 text-[var(--ancient-gold)]/60" />
            <div>
              <h3 className="text-xs font-cinzel font-semibold text-[var(--parchment)]">
                Não foi possível acessar a câmera
              </h3>
              <p className="text-[11px] font-inter text-[var(--sacred-ivory)]/60 mt-1 max-w-[220px]">
                Verifique a permissão da câmera no navegador ou digite o ISBN manualmente.
              </p>
            </div>
          </div>
        )}

        {/* State: Camera Unavailable / in-use */}
        {(status === "camera-unavailable" || status === "error") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/95 text-center p-5">
            <AlertCircle className="w-8 h-8 text-rose-400/80" />
            <div>
              <h3 className="text-xs font-cinzel font-semibold text-[var(--parchment)]">
                {status === "camera-unavailable"
                  ? "Nenhuma câmera disponível"
                  : "Câmera indisponível"}
              </h3>
              <p className="text-[11px] font-inter text-[var(--sacred-ivory)]/60 mt-1 max-w-[220px]">
                {errorMessage || "Não foi possível conectar ao dispositivo de vídeo."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resolved feedback: Not Found */}
      {status === "not-found" && (
        <div className="w-full max-w-sm mt-4 p-3.5 rounded-xl bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] space-y-2">
          <div className="flex items-start gap-2 text-xs font-inter text-[var(--sacred-ivory)]/80">
            <AlertCircle className="w-4 h-4 text-[var(--ancient-gold)] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[var(--parchment)]">ISBN {detectedIsbn}</div>
              <div>Não encontramos dados para este ISBN.</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onManualEntry(detectedIsbn)}
              className="text-xs font-cinzel font-semibold text-[var(--ancient-gold)] hover:underline"
            >
              Preencher manualmente →
            </button>
            <span className="text-[var(--sacred-ivory)]/30">·</span>
            <button
              type="button"
              onClick={onScanAgain}
              className="text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
            >
              Escanear novamente
            </button>
          </div>
        </div>
      )}

      {/* Resolved feedback: Provider Error */}
      {status === "provider-error" && (
        <div className="w-full max-w-sm mt-4 p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="flex items-start gap-2 text-xs font-inter text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Catálogo indisponível</div>
              <div className="text-[11px] text-rose-300/80">{errorMessage}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onRetryMetadata}
              className="flex items-center gap-1 text-xs font-inter font-medium text-[var(--ancient-gold)] hover:text-[var(--ancient-gold-bright)]"
            >
              <RefreshCw className="w-3 h-3" />
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={() => onManualEntry(detectedIsbn)}
              className="text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)] underline"
            >
              Preencher manualmente
            </button>
            <button
              type="button"
              onClick={onScanAgain}
              className="text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
            >
              Escanear outro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
