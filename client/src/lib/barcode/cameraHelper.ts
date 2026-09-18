import { BarcodeScanError } from "./types";

export async function startCameraStream(videoElement: HTMLVideoElement): Promise<MediaStream> {
  if (!navigator?.mediaDevices?.getUserMedia) {
    throw {
      type: "camera_unavailable",
      message: "Câmera não suportada neste navegador.",
    } as BarcodeScanError;
  }

  let stream: MediaStream;
  const timeoutMs = 7000;
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject({
        type: "camera_unavailable",
        message: "Nenhuma câmera disponível ou tempo limite excedido.",
      } as BarcodeScanError);
    }, timeoutMs);
  });

  try {
    // 1. Prefer rear / environment camera with HD ideal resolution
    const requestStream = async () => {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err: any) {
        if (err?.name === "OverconstrainedError" || err?.name === "ConstraintNotSatisfiedError") {
          return await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
        throw mapCameraError(err);
      }
    };

    stream = await Promise.race([requestStream(), timeoutPromise]);
  } catch (err: any) {
    if (err?.type) throw err;
    throw mapCameraError(err);
  }

  videoElement.srcObject = stream;
  videoElement.setAttribute("playsinline", "true");
  videoElement.muted = true;

  try {
    await videoElement.play();
  } catch (playErr) {
    console.warn("Video play interrupted or delayed:", playErr);
  }

  return stream;
}

export function stopCameraStream(
  stream: MediaStream | null,
  videoElement?: HTMLVideoElement | null
): void {
  if (stream) {
    try {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (e) {
      console.warn("Error stopping stream track:", e);
    }
  }

  if (videoElement) {
    videoElement.srcObject = null;
    videoElement.load();
  }
}

export function mapCameraError(err: unknown): BarcodeScanError {
  const errorObj = err as { name?: string; message?: string } | undefined;
  const name = errorObj?.name || "";

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return {
      type: "permission_denied",
      message: "Permissão de câmera negada.",
      cause: err,
    };
  }

  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return {
      type: "camera_unavailable",
      message: "Nenhuma câmera detectada neste dispositivo.",
      cause: err,
    };
  }

  if (name === "NotReadableError" || name === "TrackStartError") {
    return {
      type: "in_use",
      message: "A câmera pode estar em uso por outro aplicativo.",
      cause: err,
    };
  }

  return {
    type: "unknown",
    message: errorObj?.message || "Não foi possível acessar a câmera.",
    cause: err,
  };
}
