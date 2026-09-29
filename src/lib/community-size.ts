import { db } from '@/lib/admin';

/**
 * Tamaño real de la comunidad: cuentas en `users` (sin expertos).
 *
 * Se lee en build time (las páginas son estáticas) con caché de módulo y
 * floor de fallback: si la lectura falla devolvemos `null` y la UI muestra
 * "900+", siempre por debajo del número real para no sobreafirmar.
 */
export const COMMUNITY_SIZE_FLOOR = 900;

let cached: number | null | undefined;

export async function getCommunitySize(): Promise<number | null> {
  if (cached !== undefined) return cached;
  try {
    const snap = await db().collection('users').count().get();
    cached = Math.max(0, snap.data().count - 1); // -1: cuenta experta interna
    return cached;
  } catch {
    cached = null;
    return null;
  }
}
