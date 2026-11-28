/**
 * Email settings, all from the environment (never in source). Server only.
 *
 * Production: RESEND_API_KEY, LEADS_TO_EMAIL and LEADS_FROM_EMAIL are required; a missing one
 * is a configuration error raised at server start (src/instrumentation.ts).
 * Development: without RESEND_API_KEY nothing is sent (see lib/leads.ts).
 */
export type MailConfig = { apiKey: string; to: string; from: string; sendConfirmation: boolean };

export class MailConfigError extends Error {
  constructor(message: string) {
    super(`Email configuration error: ${message} See "Form emails" in README.md.`);
    this.name = 'MailConfigError';
  }
}

const REQUIRED = ['RESEND_API_KEY', 'LEADS_TO_EMAIL', 'LEADS_FROM_EMAIL'] as const;
/** Resend's shared test sender: only delivers to the address that owns the Resend account. */
const TEST_SENDER = 'CCC Website <onboarding@resend.dev>';

/** `null` means "development without a key": log instead of sending. */
export function getMailConfig(): MailConfig | null {
  const read = (key: string) => process.env[key]?.trim() ?? '';
  const missing = REQUIRED.filter((key) => !read(key));
  if (process.env.NODE_ENV === 'production' && missing.length) throw new MailConfigError(`missing ${missing.join(', ')}.`);
  const apiKey = read('RESEND_API_KEY');
  if (!apiKey) return null;
  const to = read('LEADS_TO_EMAIL');
  if (!to) throw new MailConfigError('RESEND_API_KEY is set but LEADS_TO_EMAIL is empty.');
  return { apiKey, to, from: read('LEADS_FROM_EMAIL') || TEST_SENDER, sendConfirmation: read('SEND_CONFIRMATION_EMAIL') === 'true' };
}
