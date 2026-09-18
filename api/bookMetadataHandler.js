// Plain JS metadata handler for Vercel Serverless Function

const cache = new Map();
const SUCCESS_TTL_MS = 60 * 60 * 1000;
const NOT_FOUND_TTL_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 12000;

function normalizeIsbn(raw) {
  return String(raw || "").replace(/[\s\-]/g, "").toUpperCase();
}

function validateIsbn10(s) {
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(s[i], 10);
  }
  const last = s[9] === "X" ? 10 : parseInt(s[9], 10);
  return (sum + last) % 11 === 0;
}

function validateIsbn13(s) {
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(s[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(s[12], 10);
}

function validateIsbn(norm) {
  if (norm.length === 10) return validateIsbn10(norm);
  if (norm.length === 13) return validateIsbn13(norm);
  return false;
}

async function fetchWithTimeout(url, headers = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function getOlHeaders() {
  const email = process.env.OPENLIBRARY_CONTACT_EMAIL || "";
  const contact = email ? `contact: ${email}` : "contact: bibliotheca-app";
  return {
    "User-Agent": `Bibliotheca/1.0 (${contact})`,
    Accept: "application/json",
  };
}

async function fetchOpenLibrary(isbn) {
  const res = await fetchWithTimeout(`https://openlibrary.org/isbn/${isbn}.json`, getOlHeaders());
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`OL HTTP ${res.status}`);
  const editionRaw = await res.json();

  let searchDoc = null;
  try {
    const sRes = await fetchWithTimeout(
      `https://openlibrary.org/search.json?isbn=${isbn}&limit=1&fields=author_name,first_publish_year,key`,
      getOlHeaders()
    );
    if (sRes.ok) {
      const sData = await sRes.json();
      searchDoc = sData.docs?.[0] || null;
    }
  } catch {
    // Secondary author lookup failure is non-fatal
  }

  const coverIds = editionRaw.covers;
  const coverId = Array.isArray(coverIds) ? coverIds.find((id) => id > 0) : undefined;
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false` : undefined;

  const editionKey = editionRaw.key ? editionRaw.key.replace("/books/", "") : undefined;
  const workKey = editionRaw.works?.[0]?.key ? editionRaw.works[0].key.replace("/works/", "") : undefined;
  const publisher = editionRaw.publishers?.[0];
  const pubYear = editionRaw.publish_date
    ? parseInt(String(editionRaw.publish_date).replace(/\D+/g, "").slice(0, 4))
    : undefined;
  const pages = Number.isFinite(editionRaw.number_of_pages) ? editionRaw.number_of_pages : undefined;
  const langKey = editionRaw.languages?.[0]?.key ? editionRaw.languages[0].key.replace("/languages/", "") : undefined;
  const title = editionRaw.subtitle ? `${editionRaw.title}: ${editionRaw.subtitle}` : editionRaw.title;

  return {
    isbn10: editionRaw.isbn_10?.[0],
    isbn13: editionRaw.isbn_13?.[0],
    title,
    authors: searchDoc?.author_name || undefined,
    originalPublicationYear: searchDoc?.first_publish_year,
    publisher,
    publicationYear: Number.isFinite(pubYear) ? pubYear : undefined,
    language: langKey,
    pages,
    format: editionRaw.physical_format,
    coverUrl,
    providerMeta: {
      primary: "openlibrary",
      openLibraryEditionKey: editionKey,
      openLibraryWorkKey: workKey,
    },
  };
}

async function fetchGoogleBooks(isbn) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) return null;

  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`;
  const res = await fetchWithTimeout(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GoogleBooks HTTP ${res.status}`);

  const data = await res.json();
  if (!data.totalItems || !data.items?.length) return null;

  const item = data.items[0];
  const vi = item.volumeInfo || {};
  const pubYear = vi.publishedDate ? parseInt(vi.publishedDate.slice(0, 4)) : undefined;

  let coverUrl = undefined;
  if (vi.imageLinks) {
    const keys = ["extraLarge", "large", "medium", "small", "thumbnail", "smallThumbnail"];
    for (const k of keys) {
      if (vi.imageLinks[k]) {
        coverUrl = vi.imageLinks[k].replace(/^http:\/\//i, "https://").replace(/[&?]edge=curl/i, "");
        break;
      }
    }
  }

  const id13 = vi.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier;
  const id10 = vi.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier;

  return {
    isbn10: id10,
    isbn13: id13,
    title: vi.title,
    authors: vi.authors,
    publisher: vi.publisher,
    publicationYear: Number.isFinite(pubYear) ? pubYear : undefined,
    language: vi.language,
    pages: Number.isFinite(vi.pageCount) ? vi.pageCount : undefined,
    coverUrl,
    providerMeta: {
      primary: "google-books",
      googleVolumeId: item.id,
    },
  };
}

function mergeResults(primary, fallback) {
  const title = primary.title || fallback?.title || "Título desconhecido";
  const authors = primary.authors?.length ? primary.authors : fallback?.authors?.length ? fallback.authors : [];
  const coverUrl = primary.coverUrl || fallback?.coverUrl;
  const coverSource = primary.coverUrl ? primary.providerMeta.primary : fallback?.coverUrl ? "google-books" : undefined;

  return {
    isbn10: primary.isbn10 || fallback?.isbn10,
    isbn13: primary.isbn13 || fallback?.isbn13,
    work: {
      title,
      authors,
      originalPublicationYear: primary.originalPublicationYear || fallback?.originalPublicationYear,
    },
    edition: {
      publisher: primary.publisher || fallback?.publisher,
      publicationYear: primary.publicationYear || fallback?.publicationYear,
      language: primary.language || fallback?.language,
      pages: primary.pages || fallback?.pages,
      format: primary.format || fallback?.format,
      translator: primary.translator || fallback?.translator,
    },
    cover: coverUrl && coverSource ? { url: coverUrl, source: coverSource } : undefined,
    providerMeta: {
      primary: primary.providerMeta.primary,
      openLibraryEditionKey: primary.providerMeta.openLibraryEditionKey,
      openLibraryWorkKey: primary.providerMeta.openLibraryWorkKey,
      googleVolumeId: primary.providerMeta.googleVolumeId || fallback?.providerMeta?.googleVolumeId,
    },
  };
}

export async function handleIsbnLookup(rawIsbn) {
  const isbn = normalizeIsbn(rawIsbn);
  if (!validateIsbn(isbn)) {
    return { found: false };
  }

  const cached = cache.get(isbn);
  if (cached) {
    const ttl = cached.result === null ? NOT_FOUND_TTL_MS : SUCCESS_TTL_MS;
    if (Date.now() - cached.cachedAt <= ttl) {
      return cached.result ? { found: true, metadata: cached.result } : { found: false };
    }
    cache.delete(isbn);
  }

  let olResult = null;
  let olError = false;
  try {
    olResult = await fetchOpenLibrary(isbn);
  } catch (err) {
    olError = true;
    console.warn(`[Vercel ISBN] OL lookup error for ${isbn}:`, err);
  }

  if (olResult && olResult.title && olResult.authors?.length && olResult.coverUrl) {
    const merged = mergeResults(olResult, null);
    cache.set(isbn, { result: merged, cachedAt: Date.now() });
    return { found: true, metadata: merged };
  }

  const hasGoogleKey = !!process.env.GOOGLE_BOOKS_API_KEY;
  if (olResult && hasGoogleKey) {
    try {
      const gResult = await fetchGoogleBooks(isbn);
      const merged = mergeResults(olResult, gResult);
      cache.set(isbn, { result: merged, cachedAt: Date.now() });
      return { found: true, metadata: merged };
    } catch {
      const merged = mergeResults(olResult, null);
      cache.set(isbn, { result: merged, cachedAt: Date.now() });
      return { found: true, metadata: merged };
    }
  } else if (olResult && olResult.title) {
    const merged = mergeResults(olResult, null);
    cache.set(isbn, { result: merged, cachedAt: Date.now() });
    return { found: true, metadata: merged };
  }

  let gResult = null;
  let gError = false;
  if (hasGoogleKey) {
    try {
      gResult = await fetchGoogleBooks(isbn);
    } catch (err) {
      gError = true;
      console.warn(`[Vercel ISBN] Google lookup error for ${isbn}:`, err);
    }
  }

  if (gResult && gResult.title) {
    const merged = mergeResults(gResult, null);
    cache.set(isbn, { result: merged, cachedAt: Date.now() });
    return { found: true, metadata: merged };
  }

  if (olError && (!hasGoogleKey || gError)) {
    return { error: "provider_unavailable" };
  }

  cache.set(isbn, { result: null, cachedAt: Date.now() });
  return { found: false };
}
