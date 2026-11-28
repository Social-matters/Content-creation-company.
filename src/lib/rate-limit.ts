/**
 * 5 form submissions per IP per 10 minutes.
 *
 * TODO before heavy traffic: move to Upstash Redis (or similar). This store is in memory, so
 * on serverless each instance counts separately and a cold start forgets everything.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_TRACKED = 5000;
const hits = new Map<string, number[]>();

export function takeSlot(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  if (hits.size > MAX_TRACKED) hits.delete(hits.keys().next().value!); // drop the least recently active
  return true;
}

/** Vercel sets and overwrites these. Behind another proxy, make sure it does too, or they can be spoofed. */
export const clientIp = (headers: { get(name: string): string | null }) => headers.get('x-real-ip') ?? headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
