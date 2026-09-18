import { normalizeIsbn, isBooklandIsbn13 } from "@shared/bookMetadataTypes";

export interface BooklandBarcodeResult {
  isValid: boolean;
  normalizedIsbn?: string;
}

/**
 * Validates a raw barcode string strictly against Bookland EAN-13 standards.
 * Must be 13 digits, start with 978 or 979, and pass ISBN-13 checksum.
 * Retail non-book EANs (e.g. food/general retail codes) are rejected.
 */
export function validateBooklandBarcode(rawValue: string): BooklandBarcodeResult {
  if (!rawValue) return { isValid: false };
  const normalized = normalizeIsbn(rawValue);
  if (isBooklandIsbn13(normalized)) {
    return {
      isValid: true,
      normalizedIsbn: normalized,
    };
  }
  return { isValid: false };
}

/**
 * Debouncer ensuring a single accepted barcode is fired once
 * and prevents rapid duplicate triggers.
 */
export class BarcodeDebouncer {
  private accepted = false;
  private lastCode: string | null = null;
  private lastTime = 0;
  private readonly cooldownMs: number;

  constructor(cooldownMs = 1500) {
    this.cooldownMs = cooldownMs;
  }

  /**
   * Evaluates if a raw barcode should be accepted.
   * If valid Bookland ISBN and not locked, locks and returns the normalized ISBN.
   */
  process(rawValue: string): string | null {
    if (this.accepted) return null;

    const { isValid, normalizedIsbn } = validateBooklandBarcode(rawValue);
    if (!isValid || !normalizedIsbn) return null;

    const now = Date.now();
    if (this.lastCode === normalizedIsbn && now - this.lastTime < this.cooldownMs) {
      return null;
    }

    this.accepted = true;
    this.lastCode = normalizedIsbn;
    this.lastTime = now;
    return normalizedIsbn;
  }

  reset() {
    this.accepted = false;
    this.lastCode = null;
    this.lastTime = 0;
  }
}
