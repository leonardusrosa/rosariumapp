import { BarcodeScannerAdapter, BarcodeScannerSession, BarcodeScanError } from "./types";
import { startCameraStream, stopCameraStream } from "./cameraHelper";

export class ZXingBarcodeAdapter implements BarcodeScannerAdapter {
  async start(
    videoElement: HTMLVideoElement,
    onCode: (rawValue: string) => void,
    onError: (error: BarcodeScanError) => void
  ): Promise<BarcodeScannerSession> {
    let stream: MediaStream | null = null;
    let controls: { stop: () => void } | null = null;
    let isStopped = false;

    try {
      // 1. Start camera first
      stream = await startCameraStream(videoElement);

      // 2. Dynamically import @zxing/browser to avoid upfront bundle weight
      const { BrowserMultiFormatReader, BarcodeFormat } = await import("@zxing/browser");

      // 3. Narrow decoder hints exclusively to EAN_13 (DecodeHintType.POSSIBLE_FORMATS = 2)
      const hints = new Map<number, any>();
      hints.set(2, [BarcodeFormat.EAN_13]);

      const reader = new BrowserMultiFormatReader(hints, {
        delayBetweenScanAttempts: 180,
      });

      controls = await reader.decodeFromVideoElement(
        videoElement,
        (result, _err, currentControls) => {
          if (isStopped) {
            currentControls?.stop();
            return;
          }
          if (result) {
            const text = result.getText();
            if (text) {
              onCode(text);
            }
          }
        }
      );
    } catch (err: any) {
      stopCameraStream(stream, videoElement);
      if (err?.type) {
        onError(err);
        throw err;
      }
      const scanErr: BarcodeScanError = {
        type: "unknown",
        message: err?.message || "Falha ao inicializar leitor ZXing.",
        cause: err,
      };
      onError(scanErr);
      throw scanErr;
    }

    return {
      stop() {
        if (isStopped) return;
        isStopped = true;
        try {
          controls?.stop();
        } catch (e) {
          console.warn("Error stopping ZXing controls:", e);
        }
        stopCameraStream(stream, videoElement);
      },
    };
  }
}
