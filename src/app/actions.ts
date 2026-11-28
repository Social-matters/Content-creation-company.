'use server';

import { headers } from 'next/headers';
import { leadContextSchema, leadSchema } from '@/lib/schemas';
import { saveLead } from '@/lib/leads';
import { clientIp, takeSlot } from '@/lib/rate-limit';

type LeadResult = { ok: true } | { ok: false; reason: 'invalid'; fieldErrors: Record<string, string[]> } | { ok: false; reason: 'rate' | 'delivery' };

/**
 * Validates again on the server with the same schema as the browser (never trust the client),
 * drops honeypot hits, rate-limits by IP, and reports success only once delivery is confirmed.
 */
export async function submitLead(input: unknown, context?: unknown): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      (fieldErrors[key] ??= []).push(issue.message);
    }
    if (fieldErrors.website) return { ok: true }; // honeypot filled: pretend success, send nothing
    return { ok: false, reason: 'invalid', fieldErrors };
  }
  if (!takeSlot(clientIp(await headers()))) return { ok: false, reason: 'rate' };
  try {
    await saveLead(parsed.data, leadContextSchema.parse(context));
    return { ok: true };
  } catch (e) {
    console.error('[lead] delivery failed', e);
    return { ok: false, reason: 'delivery' };
  }
}
