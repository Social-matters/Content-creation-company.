import 'server-only';
import { Resend } from 'resend';
import { getMailConfig, type MailConfig } from './email/config';
import { LOGO_ATTACHMENT, confirmationEmail, leadEmail } from './email/template';
import type { Lead, LeadContext } from './schemas';

/**
 * Lead delivery adapter. Swap the implementation without touching forms:
 *   - RESEND_API_KEY set          → emailed to LEADS_TO_EMAIL via Resend
 *   - development without a key   → logged to the console, nothing sent
 *   - production without a key    → configuration error (also raised at server start)
 * A database adapter (Phase 2 dashboards) only needs to implement `save`.
 * `save` must throw unless delivery is confirmed: the form shows success only when it resolves.
 */
export type StoredLead = Lead & LeadContext & { id: string; receivedAt: string };

export interface LeadAdapter {
  name: string;
  save(lead: StoredLead): Promise<void>;
}

const SEND_TIMEOUT_MS = 15_000;

async function send(resend: Resend, message: Parameters<Resend['emails']['send']>[0]) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Resend did not answer in time')), SEND_TIMEOUT_MS);
  });
  try {
    const { data, error } = await Promise.race([resend.emails.send(message), timeout]);
    if (error || !data?.id) throw new Error(`Resend rejected the email: ${JSON.stringify(error ?? data)}`);
  } finally {
    clearTimeout(timer);
  }
}

const emailAdapter = (config: MailConfig): LeadAdapter => ({
  name: 'resend',
  async save(lead) {
    const resend = new Resend(config.apiKey);
    await send(resend, { from: config.from, to: config.to, replyTo: lead.email, ...leadEmail(lead), attachments: [LOGO_ATTACHMENT] });
    if (!config.sendConfirmation) return;
    try {
      await send(resend, { from: config.from, to: lead.email, replyTo: config.to, ...confirmationEmail(), attachments: [LOGO_ATTACHMENT] });
    } catch (e) {
      // The team already has the lead, so a failed courtesy email must not show the visitor an error.
      console.error('[lead] confirmation email failed', e);
    }
  },
});

const consoleAdapter: LeadAdapter = {
  name: 'console',
  async save(lead) {
    console.warn('[lead] NO EMAIL WAS SENT: RESEND_API_KEY is not set (development only). Add it to .env.local to send for real.');
    console.info(`[lead] ${leadEmail(lead).subject}\n${leadEmail(lead).text}`);
  },
};

export function getLeadAdapter(): LeadAdapter {
  const config = getMailConfig();
  return config ? emailAdapter(config) : consoleAdapter;
}

export async function saveLead(lead: Lead, context: LeadContext) {
  const stored: StoredLead = { ...lead, ...context, id: crypto.randomUUID(), receivedAt: new Date().toISOString() };
  await getLeadAdapter().save(stored);
  return stored.id;
}
