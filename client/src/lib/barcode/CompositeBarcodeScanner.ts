import { BarcodeScannerAdapter, BarcodeScannerSession, BarcodeScanError } from "./types";
import { NativeBarcodeDetectorAdapter } from "./NativeBarcodeDetectorAdapter";
import { ZXingBarcodeAdapter } from "./ZXingBarcodeAdapter";

export class CompositeBarcodeScanner implements BarcodeScannerAdapter {
  private nativeAdapter = new NativeBarcodeDetectorAdapter();
  private zxingAdapter = new ZXingBarcodeAdapter();

  async start(
    videoElement: HTMLVideoElement,
    onCode: (rawValue: string) => void,
    onError: (error: BarcodeScanError) => void
  ): Promise<BarcodeScannerSession> {
    const isNativeSupported = await NativeBarcodeDetectorAdapter.isSupported().catch(() => false);

    if (isNativeSupported) {
      try {
        return await this.nativeAdapter.start(videoElement, onCode, onError);
      } catch (err: any) {
        // If the error was a camera permission or unavailable error, don't retry with ZXing
        // because ZXing will face the same camera error
        if (err?.type === "permission_denied" || err?.type === "camera_unavailable" || err?.type === "in_use") {
          throw err;
        }
        console.warn("Native BarcodeDetector initialization failed, falling back to ZXing:", err);
      }
    }

    // Fall back cleanly to ZXing
    return await this.zxingAdapter.start(videoElement, onCode, onError);
  }
}

export const defaultBarcodeScanner = new CompositeBarcodeScanner();
