import 'server-only';
import { Resend } from 'resend';
import { getLeadConfig, type MailConfig, type SheetConfig } from './lead-config';
import { appendToSheet } from './sheet';
import { LOGO_ATTACHMENT, confirmationEmail, leadEmail } from './email/template';
import type { Lead, LeadContext } from './schemas';

/**
 * Lead delivery adapter. Swap the implementation without touching forms:
 *   - email and/or Google Sheet, whichever is configured (see lead-config.ts)
 *   - development with neither    → logged to the console, nothing sent
 *   - production with neither     → configuration error (also raised at server start)
 * A database adapter (Phase 2 dashboards) only needs to implement `save`.
 * `save` must throw unless delivery is confirmed: the form shows success only when it resolves.
 */
export type StoredLead = Lead & LeadContext & { id: string; receivedAt: string };

interface LeadAdapter {
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
    console.warn('[lead] NOTHING WAS SENT OR SAVED: no email or Google Sheet is configured (development only). See .env.example.');
    console.info(`[lead] ${leadEmail(lead).subject}\n${leadEmail(lead).text}`);
  },
};

const sheetAdapter = (config: SheetConfig): LeadAdapter => ({ name: 'google-sheet', save: (lead) => appendToSheet(config, lead) });

/** Delivers to every destination. One confirmed copy is enough; the others' failures are logged. */
const everywhere = (adapters: LeadAdapter[]): LeadAdapter => ({
  name: adapters.map((a) => a.name).join('+'),
  async save(lead) {
    const results = await Promise.allSettled(adapters.map((a) => a.save(lead)));
    const failures = results.flatMap((r, i) => (r.status === 'rejected' ? [`${adapters[i].name}: ${r.reason}`] : []));
    if (failures.length === adapters.length) throw new Error(failures.join(' | '));
    if (failures.length) console.error(`[lead] ${lead.id} was saved, but not everywhere: ${failures.join(' | ')}`);
  },
});

function getLeadAdapter(): LeadAdapter {
  const { mail, sheet } = getLeadConfig();
  const adapters = [...(mail ? [emailAdapter(mail)] : []), ...(sheet ? [sheetAdapter(sheet)] : [])];
  return adapters.length ? everywhere(adapters) : consoleAdapter;
}

export async function saveLead(lead: Lead, context: LeadContext) {
  const stored: StoredLead = { ...lead, ...context, id: crypto.randomUUID(), receivedAt: new Date().toISOString() };
  await getLeadAdapter().save(stored);
  return stored.id;
}
