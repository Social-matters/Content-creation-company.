import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Lead } from './schemas';

/**
 * Lead delivery adapter. Swap the implementation without touching forms:
 *   - RESEND_API_KEY set  → email via Resend (Phase 2 ready)
 *   - development         → appended to .leads/leads.jsonl + console
 *   - otherwise           → structured console log (visible in Vercel logs)
 * A database adapter (Phase 2 dashboards) only needs to implement `save`.
 */
export type StoredLead = Lead & { id: string; receivedAt: string };

export interface LeadAdapter {
  name: string;
  save(lead: StoredLead): Promise<void>;
}

const consoleAdapter: LeadAdapter = {
  name: 'console',
  async save(lead) {
    console.info('[lead]', JSON.stringify(lead));
  },
};

const fileAdapter: LeadAdapter = {
  name: 'file',
  async save(lead) {
    const dir = path.join(process.cwd(), '.leads');
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, 'leads.jsonl'), JSON.stringify(lead) + '\n', 'utf8');
    await consoleAdapter.save(lead);
  },
};

const resendAdapter = (apiKey: string, to: string): LeadAdapter => ({
  name: 'resend',
  async save(lead) {
    const subject = lead.kind === 'brand' ? `New brand lead: ${lead.brand}` : lead.kind === 'creator' ? `New creator: @${lead.instagram}` : `Login interest: ${lead.email}`;
    const rows = Object.entries(lead)
      .filter(([k, v]) => k !== 'website' && v !== undefined)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td>${escapeHtml(Array.isArray(v) ? v.join(', ') : String(v))}</td></tr>`)
      .join('');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'CCC Leads <leads@contentcreationcompany.in>', to, subject, html: `<table>${rows}</table>` }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  },
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function getLeadAdapter(): LeadAdapter {
  const key = process.env.RESEND_API_KEY;
  if (key) return resendAdapter(key, process.env.LEADS_TO_EMAIL || 'hello@contentcreationcompany.in');
  if (process.env.NODE_ENV === 'development') return fileAdapter;
  return consoleAdapter;
}

export async function saveLead(lead: Lead) {
  const stored: StoredLead = { ...lead, id: crypto.randomUUID(), receivedAt: new Date().toISOString() };
  await getLeadAdapter().save(stored);
  return stored.id;
}
