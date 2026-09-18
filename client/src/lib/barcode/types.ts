export type BarcodeScanErrorType =
  | "camera_unavailable"
  | "permission_denied"
  | "in_use"
  | "unsupported"
  | "unknown";

export interface BarcodeScanError {
  type: BarcodeScanErrorType;
  message: string;
  cause?: unknown;
}

export interface BarcodeScannerSession {
  stop(): void | Promise<void>;
}

export interface BarcodeScannerAdapter {
  start(
    videoElement: HTMLVideoElement,
    onCode: (rawValue: string) => void,
    onError: (error: BarcodeScanError) => void
  ): Promise<BarcodeScannerSession>;
}
