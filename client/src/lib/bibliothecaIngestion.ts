import { Work, Edition, WishlistItem } from "@/types/bibliotheca";

// ─── ISBN Utilities ───────────────────────────────────────────────────────────

export function normalizeIsbn(raw: string): string {
  return raw.replace(/[\s\-]/g, "");
}

export function validateIsbn(normalized: string): boolean {
  if (normalized.length === 10) return validateIsbn10(normalized);
  if (normalized.length === 13) return validateIsbn13(normalized);
  return false;
}

function validateIsbn10(s: string): boolean {
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(s[i], 10);
  }
  const last = s[9] === "X" ? 10 : parseInt(s[9], 10);
  return (sum + last) % 11 === 0;
}

function validateIsbn13(s: string): boolean {
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(s[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(s[12], 10);
}

// ─── Work / Edition Deduplication ────────────────────────────────────────────

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findExistingWork(
  title: string,
  author: string | undefined,
  works: Work[]
): Work | undefined {
  const normTitle = normalizeText(title);
  const normAuthor = author ? normalizeText(author) : null;

  return works.find((w) => {
    const titleMatch = normalizeText(w.title) === normTitle;
    if (!titleMatch) return false;
    if (!normAuthor) return true;
    return normalizeText(w.author) === normAuthor;
  });
}

export function findExistingEditionByIsbn(
  isbn: string,
  editions: Edition[]
): Edition | undefined {
  if (!isbn) return undefined;
  const norm = normalizeIsbn(isbn);
  return editions.find((e) => e.isbn && normalizeIsbn(e.isbn) === norm);
}

export function findMatchingWishlist(
  workId: string,
  wishlist: WishlistItem[]
): WishlistItem | undefined {
  return wishlist.find((w) => w.workId === workId);
}
