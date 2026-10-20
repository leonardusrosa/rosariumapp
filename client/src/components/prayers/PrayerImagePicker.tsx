import { useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isPrayerImageSource } from "@/lib/prayerImage";

interface PrayerImagePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_DATA_URL_LENGTH = 480_000;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      reject(new Error("Use uma imagem JPG, PNG ou WebP."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("A imagem original deve ter até 12 MB."));
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Não foi possível processar a imagem.");
        for (const maxEdge of [1200, 1000, 800, 600, 450]) {
          const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          for (const quality of [0.8, 0.65, 0.48]) {
            const data = canvas.toDataURL("image/webp", quality);
            if (data.startsWith("data:image/webp;") && data.length <= MAX_DATA_URL_LENGTH) {
              resolve(data);
              return;
            }
          }
        }
        reject(new Error("Não foi possível compactar a imagem. Escolha uma menor."));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Não foi possível abrir essa imagem."));
    };
    img.src = blobUrl;
  });
}

export function PrayerImagePicker({ value, onChange, disabled = false }: PrayerImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  const applyFile = async (file: File) => {
    if (disabled) return;
    setError("");
    setLoading(true);
    try {
      const data = await readImage(file);
      onChange(data);
      setUrl("");
      setPreviewFailed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível adicionar a imagem.");
    } finally {
      setLoading(false);
    }
  };

  const applyUrl = (candidate: string) => {
    const normalized = candidate.trim();
    try {
      const parsed = new URL(normalized);
      const src = parsed.toString();
      if (!isPrayerImageSource(src)) throw new Error();
      onChange(src);
      setUrl(src);
      setPreviewFailed(false);
      setError("");
    } catch {
      setError("Informe uma URL HTTPS válida e direta para a imagem.");
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const item = Array.from(event.clipboardData.items).find(item => item.type.startsWith("image/"));
    if (item) {
      event.preventDefault();
      const file = item.getAsFile();
      if (file) void applyFile(file);
      return;
    }
    const pastedText = event.clipboardData.getData("text/plain").trim();
    if (/^https:\/\//i.test(pastedText)) {
      event.preventDefault();
      applyUrl(pastedText);
    }
  };

  const pasteFromClipboard = async () => {
    if (disabled) return;
    try {
      if (!navigator.clipboard?.read) throw new Error();
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const mime = item.types.find(type => type.startsWith("image/"));
        if (mime) {
          const blob = await item.getType(mime);
          await applyFile(new File([blob], "imagem-colada", { type: blob.type }));
          return;
        }
      }
      setError("Nenhuma imagem encontrada na área de transferência.");
    } catch {
      setError("Clique na área abaixo e pressione Ctrl+V (ou ⌘V) para colar.");
      zoneRef.current?.focus();
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    const file = event.dataTransfer.files[0];
    if (file) void applyFile(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-byzantine-gold font-inter text-sm sm:text-base md:text-lg">
        <i className="fas fa-image mr-2" aria-hidden="true" />
        Imagem da oração <span className="text-parchment/60 text-sm">(opcional)</span>
      </label>
      <div
        ref={zoneRef}
        tabIndex={disabled ? -1 : 0}
        role="group"
        aria-label="Área para colar ou arrastar uma imagem"
        onPaste={onPaste}
        onDragOver={event => event.preventDefault()}
        onDrop={onDrop}
        className="rounded-lg border border-dashed border-[var(--ancient-gold-alpha)] bg-[var(--gothic-stone)] p-3 sm:p-4 text-center text-parchment/80 outline-none focus-visible:ring-2 focus-visible:ring-[var(--byzantine-gold)]"
      >
        {value ? (
          <div className="space-y-2">
            <img
              key={value}
              src={value}
              alt="Prévia da imagem da oração"
              referrerPolicy="no-referrer"
              className="mx-auto max-h-48 w-auto max-w-full rounded-md object-contain"
              onLoad={() => setPreviewFailed(false)}
              onError={() => setPreviewFailed(true)}
            />
            {previewFailed && <p className="text-amber-300 text-sm">Não foi possível carregar esta URL. Confira o endereço antes de salvar.</p>}
            <Button type="button" variant="outline" disabled={disabled || loading}
              onClick={() => { onChange(null); setUrl(""); setPreviewFailed(false); setError(""); }}
              className="text-parchment border-[var(--ancient-gold-alpha)]">
              Remover imagem
            </Button>
          </div>
        ) : (
          <p className="text-sm">Cole uma imagem aqui (Ctrl+V), arraste ou escolha um arquivo.</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
          aria-label="Selecionar imagem do dispositivo"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) void applyFile(file);
            event.target.value = "";
          }} />
        <Button type="button" variant="outline" disabled={disabled || loading}
          className="border-[var(--ancient-gold-alpha)] text-parchment"
          onClick={() => fileRef.current?.click()}>
          <i className="fas fa-upload mr-2" aria-hidden="true" /> Do dispositivo
        </Button>
        <Button type="button" variant="outline" disabled={disabled || loading}
          className="border-[var(--ancient-gold-alpha)] text-parchment"
          onClick={() => void pasteFromClipboard()}>
          <i className="fas fa-paste mr-2" aria-hidden="true" /> Colar imagem
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input type="url" value={url} disabled={disabled || loading}
          aria-label="URL HTTPS da imagem" placeholder="https://exemplo.com/imagem.jpg"
          onChange={event => setUrl(event.target.value)}
          className="bg-[var(--gothic-stone)] text-parchment border-[var(--ancient-gold-alpha)]" />
        <Button type="button" variant="outline" disabled={disabled || loading || !url.trim()}
          className="border-[var(--ancient-gold-alpha)] text-parchment shrink-0"
          onClick={() => applyUrl(url)}>Usar URL</Button>
      </div>
      <p className="text-xs text-parchment/60">
        JPG, PNG ou WebP. Arquivos e imagens coladas são compactados antes de salvar; URLs externas precisam continuar disponíveis.
      </p>
      {loading && <p className="text-sm text-parchment" role="status">Processando imagem...</p>}
      {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
    </div>
  );
}
