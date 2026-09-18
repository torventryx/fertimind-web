// Reseñas de Google para el directorio de clínicas (opcional).
//
// Cumple los Términos de Google: usa la Places API oficial (no scraping).
// Muestra hasta 5 reseñas con atribución "Reseñas de Google" y enlace.
// Se activa solo si existe GOOGLE_PLACES_API_KEY en el servidor; si no,
// las fichas muestran un enlace de búsqueda neutro.

import { SITE } from './i18n';

export interface PlaceReviews {
  rating: number | null;
  userRatingsCount: number | null;
  reviews: { author: string; rating: number; text: string; relativeTime: string }[];
  mapsUrl: string;
}

const cache = new Map<string, { data: PlaceReviews | null; expires: number }>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 h

export async function getClinicReviews(clinicName: string, city: string): Promise<PlaceReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  const cacheKey = `${clinicName}|${city}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expires > Date.now()) return hit.data;

  try {
    // Places API (nueva) — Text Search + details en una llamada
    const searchUrl =
      `https://places.googleapis.com/v1/places:searchText` +
      `?fields=places.displayName,places.rating,places.userRatingCount,places.reviews,places.googleMapsUri,places.formattedAddress`;
    const res = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
      },
      body: JSON.stringify({ textQuery: `${clinicName} ${city}` }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`places ${res.status}`);
    const json = (await res.json()) as any;
    const place = json.places?.[0];
    const data: PlaceReviews | null = place
      ? {
          rating: place.rating ?? null,
          userRatingsCount: place.userRatingCount ?? null,
          mapsUrl:
            place.googleMapsUri ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clinicName} ${city}`)}`,
          reviews: (place.reviews ?? []).slice(0, 5).map((r: any) => ({
            author: r.authorAttribution?.displayName ?? 'Usuaria de Google',
            rating: r.rating ?? 0,
            text: (r.text?.text ?? '').slice(0, 400),
            relativeTime: r.relativePublishTimeDescription ?? '',
          })),
        }
      : null;
    cache.set(cacheKey, { data, expires: Date.now() + TTL_MS });
    return data;
  } catch {
    cache.set(cacheKey, { data: null, expires: Date.now() + TTL_MS });
    return null;
  }
}

export function googleSearchUrl(clinicName: string, city: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`reseñas ${clinicName} ${city} fertilidad`)}`;
}
