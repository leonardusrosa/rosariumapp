import React, { useRef, useState, useEffect, useCallback } from "react";
import { RefreshCw, PenLine } from "lucide-react";
import {
  defaultBarcodeScanner,
  BarcodeScannerSession,
  BarcodeScanError,
  BarcodeDebouncer,
} from "@/lib/barcode";
import { fetchIsbnMetadata, ProviderUnavailableError, buildCandidateFromMetadata } from "@/lib/isbnApi";
import { IdentifiedBookCandidate } from "@/types/bibliotheca";
import { BarcodeCameraViewport, BarcodeCameraStatus } from "./BarcodeCameraViewport";

export interface BarcodeScannerPanelProps {
  onFound: (candidate: IdentifiedBookCandidate) => void;
  onManualEntry: (scannedIsbn?: string) => void;
  onTypeIsbn: () => void;
  onBack: () => void;
}

export function BarcodeScannerPanel({
  onFound,
  onManualEntry,
  onTypeIsbn,
  onBack,
}: BarcodeScannerPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<BarcodeScannerSession | null>(null);
  const debouncerRef = useRef(new BarcodeDebouncer(2000));

  const [status, setStatus] = useState<BarcodeCameraStatus>("initializing");
  const [detectedIsbn, setDetectedIsbn] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const stopActiveSession = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.stop();
      } catch (e) {
        console.warn("Error stopping scanner session:", e);
      }
      sessionRef.current = null;
    }
  }, []);

  const resolveIsbnMetadata = useCallback(
    async (isbn: string) => {
      setStatus("resolving");
      setErrorMessage("");

      try {
        const meta = await fetchIsbnMetadata(isbn);
        if (meta) {
          const candidate = buildCandidateFromMetadata(isbn, meta);
          onFound(candidate);
        } else {
          setStatus("not-found");
        }
      } catch (err) {
        if (err instanceof ProviderUnavailableError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Falha ao consultar catálogo de metadados.");
        }
        setStatus("provider-error");
      }
    },
    [onFound]
  );

  const handleBarcodeDetected = useCallback(
    (rawValue: string) => {
      const validIsbn = debouncerRef.current.process(rawValue);
      if (!validIsbn) return; // Non-book EAN or duplicate scan; ignore silently

      // 1. Immediately halt camera hardware
      stopActiveSession();

      // 2. Transition state and fetch metadata
      setDetectedIsbn(validIsbn);
      setStatus("detected");
      resolveIsbnMetadata(validIsbn);
    },
    [stopActiveSession, resolveIsbnMetadata]
  );

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;
    stopActiveSession();
    debouncerRef.current.reset();
    setStatus("initializing");
    setErrorMessage("");

    try {
      const session = await defaultBarcodeScanner.start(
        videoRef.current,
        handleBarcodeDetected,
        (scanErr: BarcodeScanError) => {
          stopActiveSession();
          if (scanErr.type === "permission_denied") {
            setStatus("permission-denied");
          } else if (scanErr.type === "camera_unavailable") {
            setStatus("camera-unavailable");
          } else {
            setErrorMessage(scanErr.message);
            setStatus("error");
          }
        }
      );

      sessionRef.current = session;
      setStatus("scanning");
    } catch (err: any) {
      stopActiveSession();
      if (err?.type === "permission_denied") {
        setStatus("permission-denied");
      } else if (err?.type === "camera_unavailable") {
        setStatus("camera-unavailable");
      } else {
        setErrorMessage(err?.message || "Não foi possível acessar a câmera.");
        setStatus("error");
      }
    }
  }, [handleBarcodeDetected, stopActiveSession]);

  useEffect(() => {
    startScanning();
    return () => {
      stopActiveSession();
    };
  }, [startScanning, stopActiveSession]);

  useEffect(() => {
    const handleSimulate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) handleBarcodeDetected(customEvent.detail);
    };
    window.addEventListener("bibliotheca:simulate-barcode", handleSimulate);
    return () => {
      window.removeEventListener("bibliotheca:simulate-barcode", handleSimulate);
    };
  }, [handleBarcodeDetected]);

  return (
    <div className="flex flex-col max-h-[92vh]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-[var(--ancient-gold-alpha-soft)] shrink-0">
        <h2 className="font-cinzel text-sm font-bold tracking-wide text-[var(--parchment)] uppercase">
          Escanear ISBN
        </h2>
        <p className="text-[11px] font-inter text-[var(--sacred-ivory)]/60 mt-0.5">
          Posicione o código de barras dentro da área indicada.
        </p>
      </div>

      <BarcodeCameraViewport
        videoRef={videoRef}
        status={status}
        detectedIsbn={detectedIsbn}
        errorMessage={errorMessage}
        onManualEntry={onManualEntry}
        onScanAgain={startScanning}
        onRetryMetadata={() => resolveIsbnMetadata(detectedIsbn)}
      />

      {/* Footer Controls */}
      <div className="px-5 py-4 border-t border-[var(--ancient-gold-alpha-soft)] flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)] border border-[var(--ancient-gold-alpha-soft)] hover:border-[var(--ancient-gold-warm)]/40 transition-all"
        >
          Cancelar
        </button>

        <div className="flex items-center gap-2">
          {(status === "permission-denied" || status === "error") && (
            <button
              type="button"
              onClick={startScanning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-inter text-[var(--parchment)] bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Tentar novamente
            </button>
          )}

          <button
            type="button"
            onClick={onTypeIsbn}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-cinzel font-semibold tracking-wider text-[var(--ancient-gold)] hover:bg-[var(--ancient-gold-alpha-soft)] border border-[var(--ancient-gold-alpha-soft)] transition-colors"
          >
            <PenLine className="w-3.5 h-3.5" />
            Digitar ISBN
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarcodeScannerPanel;
