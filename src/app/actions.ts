'use server';

import { leadSchema } from '@/lib/schemas';
import { saveLead } from '@/lib/leads';

export type LeadResult = { ok: true } | { ok: false; fieldErrors?: Record<string, string[]>; message?: string };

/** Validates on the server (never trust the client), drops honeypot hits, hands off to the adapter. */
export async function submitLead(input: unknown): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      (fieldErrors[key] ??= []).push(issue.message);
    }
    if (fieldErrors.website) return { ok: true }; // honeypot filled: pretend success, store nothing
    return { ok: false, fieldErrors };
  }
  try {
    await saveLead(parsed.data);
    return { ok: true };
  } catch (e) {
    console.error('[lead] delivery failed', e);
    return { ok: false, message: 'delivery' };
  }
}
