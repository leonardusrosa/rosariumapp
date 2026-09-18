import { BarcodeScannerAdapter, BarcodeScannerSession, BarcodeScanError } from "./types";
import { startCameraStream, stopCameraStream } from "./cameraHelper";

export class NativeBarcodeDetectorAdapter implements BarcodeScannerAdapter {
  static async isSupported(): Promise<boolean> {
    if (typeof globalThis === "undefined" || !("BarcodeDetector" in globalThis)) {
      return false;
    }
    try {
      const formats: string[] = await (globalThis as any).BarcodeDetector.getSupportedFormats();
      return formats.includes("ean_13");
    } catch {
      return false;
    }
  }

  async start(
    videoElement: HTMLVideoElement,
    onCode: (rawValue: string) => void,
    onError: (error: BarcodeScanError) => void
  ): Promise<BarcodeScannerSession> {
    const supported = await NativeBarcodeDetectorAdapter.isSupported().catch(() => false);
    if (!supported) {
      throw {
        type: "unsupported",
        message: "BarcodeDetector não suporta EAN-13 nativamente.",
      } as BarcodeScanError;
    }

    let stream: MediaStream | null = null;
    let detector: any = null;
    let timerId: any = null;
    let isStopped = false;

    try {
      stream = await startCameraStream(videoElement);
      detector = new (globalThis as any).BarcodeDetector({ formats: ["ean_13"] });
    } catch (err: any) {
      stopCameraStream(stream, videoElement);
      if (err?.type) {
        onError(err);
        throw err;
      }
      const scanErr: BarcodeScanError = {
        type: "unknown",
        message: err?.message || "Falha ao iniciar BarcodeDetector nativo.",
        cause: err,
      };
      onError(scanErr);
      throw scanErr;
    }

    // Process frames at ~6 fps (every 160ms) to preserve CPU and battery
    const scanLoop = async () => {
      if (isStopped || !videoElement) return;

      if (videoElement.readyState >= 2 && !videoElement.paused) {
        try {
          const barcodes = await detector.detect(videoElement);
          if (!isStopped && Array.isArray(barcodes) && barcodes.length > 0) {
            for (const b of barcodes) {
              if (b.rawValue) {
                onCode(b.rawValue);
              }
            }
          }
        } catch {
          // Ignore intermittent frame decode errors (e.g. during focus shifts)
        }
      }
    };

    timerId = setInterval(scanLoop, 160);

    return {
      stop() {
        if (isStopped) return;
        isStopped = true;
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
        stopCameraStream(stream, videoElement);
      },
    };
  }
}
