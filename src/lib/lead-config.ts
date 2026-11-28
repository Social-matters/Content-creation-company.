/**
 * Where form submissions go, all from the environment (never in source). Server only.
 *
 *   Email        RESEND_API_KEY + LEADS_TO_EMAIL + LEADS_FROM_EMAIL
 *   Google Sheet SHEETS_WEBHOOK_URL + SHEETS_WEBHOOK_SECRET
 *
 * Use either or both. Production needs at least one, complete: otherwise it's a configuration
 * error raised at server start (src/instrumentation.ts). Development with neither only logs.
 */
export type MailConfig = { apiKey: string; to: string; from: string; sendConfirmation: boolean };
export type SheetConfig = { url: string; secret: string };
export type LeadConfig = { mail: MailConfig | null; sheet: SheetConfig | null };

export class LeadConfigError extends Error {
  constructor(message: string) {
    super(`Lead delivery configuration error: ${message} See "Where form submissions go" in README.md.`);
    this.name = 'LeadConfigError';
  }
}

/** Resend's shared test sender: only delivers to the address that owns the Resend account. */
const TEST_SENDER = 'CCC Website <onboarding@resend.dev>';

export function getLeadConfig(): LeadConfig {
  const read = (key: string) => process.env[key]?.trim() ?? '';
  const production = process.env.NODE_ENV === 'production';

  let mail: MailConfig | null = null;
  const apiKey = read('RESEND_API_KEY');
  if (apiKey) {
    const missing = (production ? ['LEADS_TO_EMAIL', 'LEADS_FROM_EMAIL'] : ['LEADS_TO_EMAIL']).filter((key) => !read(key));
    if (missing.length) throw new LeadConfigError(`RESEND_API_KEY is set but ${missing.join(', ')} is empty.`);
    mail = { apiKey, to: read('LEADS_TO_EMAIL'), from: read('LEADS_FROM_EMAIL') || TEST_SENDER, sendConfirmation: read('SEND_CONFIRMATION_EMAIL') === 'true' };
  }

  let sheet: SheetConfig | null = null;
  const url = read('SHEETS_WEBHOOK_URL');
  if (url) {
    const secret = read('SHEETS_WEBHOOK_SECRET');
    if (secret.length < 16) throw new LeadConfigError('SHEETS_WEBHOOK_URL is set but SHEETS_WEBHOOK_SECRET is missing or shorter than 16 characters.');
    // https only; plain http is allowed for a mock on this machine (tests).
    if (!/^https:\/\/|^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url)) throw new LeadConfigError('SHEETS_WEBHOOK_URL must be the https web app URL (it ends in /exec).');
    sheet = { url, secret };
  }

  if (production && !mail && !sheet) throw new LeadConfigError('nowhere to send submissions. Set SHEETS_WEBHOOK_URL and SHEETS_WEBHOOK_SECRET, or RESEND_API_KEY, LEADS_TO_EMAIL and LEADS_FROM_EMAIL.');
  return { mail, sheet };
}
