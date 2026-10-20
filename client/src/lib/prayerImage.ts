// Preserve image attachments inside the existing prayer content field so guest
// prayers and Supabase-backed prayers work without a database migration.
const MARKER = "\n\n<!-- rosarium:image:";
const SUFFIX = " -->";
const MAX_EMBEDDED_LENGTH = 550_000;

export interface PrayerContentWithImage {
  text: string;
  image: string | null;
}

export function isPrayerImageSource(value: string): boolean {
  if (/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) {
    return value.length <= MAX_EMBEDDED_LENGTH;
  }
  if (value.length > 2048 || /[\s<>"']/u.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function unpackPrayerContent(content: string): PrayerContentWithImage {
  const markerAt = content.lastIndexOf(MARKER);
  if (markerAt < 0 || !content.endsWith(SUFFIX)) {
    return { text: content, image: null };
  }
  const image = content.slice(markerAt + MARKER.length, -SUFFIX.length);
  if (!isPrayerImageSource(image)) return { text: content, image: null };
  return { text: content.slice(0, markerAt), image };
}

export function packPrayerContent(text: string, image: string | null): string {
  const cleanText = unpackPrayerContent(text).text;
  return image && isPrayerImageSource(image)
    ? `${cleanText}${MARKER}${image}${SUFFIX}`
    : cleanText;
}
