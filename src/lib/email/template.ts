/**
 * Lead and confirmation emails: branded HTML plus a plain-text twin.
 * Table layout and inline styles only, so Gmail and Outlook render it the same way.
 * Every user-provided string is escaped before it touches markup, and cleaned before it
 * touches a subject line.
 */
import { followerTiers } from '@/content/forms';
import { brandNeeds, budgets, talentTypes, timelines } from '@/content/v2/forms';
import { site } from '@/content/site';
import { UTM_KEYS } from '@/lib/lead-context';
import type { StoredLead } from '@/lib/leads';
import { LOGO_PNG_BASE64 } from './logo';

export type Email = { subject: string; html: string; text: string };

export const LOGO_ATTACHMENT = { filename: 'ccc-logo.png', content: LOGO_PNG_BASE64, contentType: 'image/png', contentId: 'ccc-logo' };

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Control characters, line/paragraph separators and text-direction overrides. */
const UNSAFE_IN_HEADER = /[\p{Cc}\u2028\u2029\u200e\u200f\u202a-\u202e\u2066-\u2069]+/gu;
/** One safe line of user text for a subject: no newlines or control characters, bounded length. */
const subjectPart = (s: string, max = 80) => s.replace(UNSAFE_IN_HEADER, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

const labelOf = (list: readonly { value: string; label: string }[], value: string) => list.find((o) => o.value === value)?.label ?? value;
const rupees = (digits: string) => `₹${Number(digits).toLocaleString('en-IN')}`;

const FORM_NAMES: Record<StoredLead['kind'], string> = {
  brand: 'Brand application',
  celebrity: 'Celebrity enquiry',
  'model-shoot': 'Model shoot enquiry',
  creator: 'Influencer / creator application',
  contact: 'Contact form',
  'early-access': 'Early-access signup',
};

const TITLES: Record<StoredLead['kind'], string> = {
  brand: 'New brand enquiry',
  celebrity: 'New celebrity enquiry',
  'model-shoot': 'New model shoot enquiry',
  creator: 'New influencer application',
  contact: 'New contact message',
  'early-access': 'New early-access signup',
};

function leadSubject(lead: StoredLead): string {
  switch (lead.kind) {
    case 'brand':
      return `[CCC] New brand enquiry: ${subjectPart(lead.brand)} (${lead.needs.map((n) => labelOf(brandNeeds, n)).join(', ')})`;
    case 'creator':
      return `[CCC] New influencer application: ${subjectPart(lead.name)}, ${rupees(lead.basePrice)} ${lead.priceUnit}`;
    case 'celebrity':
      return `[CCC] New celebrity enquiry: ${subjectPart(lead.brand)}`;
    case 'model-shoot':
      return `[CCC] New model shoot enquiry: ${subjectPart(lead.brand)}`;
    case 'contact':
      return `[CCC] New contact message: ${subjectPart(lead.name)}`;
    case 'early-access':
      return `[CCC] New early-access signup: ${subjectPart(lead.email, 160)}`;
  }
}

/** Field order and labels. Every submitted field has an entry; absent ones are skipped. */
const FIELDS: [key: string, label: string, show?: (value: never) => string][] = [
  ['type', 'I am a', (v: string) => labelOf(talentTypes, v)],
  ['name', 'Name'],
  ['brand', 'Brand'],
  ['email', 'Email'],
  ['phone', 'Phone', (v: string) => `+91 ${v}`],
  ['instagram', 'Instagram', (v: string) => `@${v}`],
  ['needs', 'Needs', (v: string[]) => v.map((n) => labelOf(brandNeeds, n)).join(', ')],
  ['budget', 'Budget', (v: string) => labelOf(budgets, v)],
  ['timeline', 'Timeline', (v: string) => labelOf(timelines, v)],
  ['category', 'Category'],
  ['niche', 'Niche'],
  ['tier', 'Followers', (v: string) => labelOf(followerTiers, v)],
  ['basePrice', 'Base price (internal)', (v: string) => rupees(v)],
  ['priceUnit', 'Rate unit (internal)'],
  ['city', 'City'],
  ['languages', 'Languages'],
  ['description', 'About'],
  ['message', 'Message'],
  ['consent', 'Privacy consent', (v: boolean) => (v ? 'Accepted the Privacy Policy' : 'Not accepted')],
];

type Row = [label: string, value: string];

/** Control characters other than tab and line breaks: invisible junk in a body. */
const UNSAFE_IN_BODY = /(?![\t\n\r])\p{Cc}/gu;

function fieldRows(lead: StoredLead): Row[] {
  const record = lead as unknown as Record<string, unknown>;
  return FIELDS.flatMap(([key, label, show]) => (record[key] === undefined ? [] : [[label, (show ? show(record[key] as never) : String(record[key])).replace(UNSAFE_IN_BODY, '')] as Row]));
}

const istTime = (iso: string) => `${new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(iso))} IST`;

function metaRows(lead: StoredLead): Row[] {
  return [
    ['Form', FORM_NAMES[lead.kind]],
    ['Page', lead.page],
    ['Submitted', istTime(lead.receivedAt)],
    ...UTM_KEYS.flatMap((k) => (lead.utm[k] ? [[k, lead.utm[k]] as Row] : [])),
    ['Reference', lead.id],
  ];
}

const SANS = 'Arial,Helvetica,sans-serif';
const HEAD = `'Archivo Black','Arial Black',${SANS}`;

function table(rows: Row[]) {
  const cell = 'padding:10px 0;border-top:1px solid #E7E1D5;vertical-align:top;';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;table-layout:fixed;">${rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" width="150" style="${cell}width:150px;padding-right:14px;font-family:${SANS};font-size:11px;line-height:20px;letter-spacing:0.06em;text-transform:uppercase;color:#6B655E;font-weight:bold;">${escapeHtml(label)}</th>` +
        `<td valign="top" style="${cell}font-family:${SANS};font-size:15px;line-height:22px;color:#141210;word-wrap:break-word;overflow-wrap:anywhere;">${escapeHtml(value).replace(/\r\n|\r|\n/g, '<br>')}</td></tr>`,
    )
    .join('')}</table>`;
}

/** Cream page, orange header bar with the logo, white card with a hard border. `body` is trusted markup. */
function layout(title: string, preheader: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background-color:#F1EDE4;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1EDE4" style="background-color:#F1EDE4;"><tr><td align="center" style="padding:24px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border:2px solid #000000;">
<tr><td bgcolor="#FF812A" style="background-color:#FF812A;border-bottom:2px solid #000000;padding:16px 24px;"><img src="cid:ccc-logo" width="108" height="48" alt="Content Creation Company" style="display:block;border:0;width:108px;height:48px;"></td></tr>
<tr><td style="padding:26px 24px 28px;"><h1 style="margin:0 0 18px;font-family:${HEAD};font-size:21px;line-height:27px;text-transform:uppercase;color:#141210;">${escapeHtml(title)}</h1>${body}</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}

/** Continuation lines are indented so a multi-line value can't pose as another field. */
const textRows = (rows: Row[]) => rows.map(([label, value]) => `${label}: ${value.replace(/\r\n|\r|\n/g, '\n    ')}`).join('\n');

/** The same fields as the email, as a fixed set of columns (blank where a form doesn't ask). */
export function leadColumns(lead: StoredLead): Row[] {
  const values = new Map<string, string>([...metaRows(lead), ...fieldRows(lead)]);
  const names = ['Submitted', 'Form', ...FIELDS.map(([, label]) => label), 'Page', ...UTM_KEYS, 'Reference'];
  return names.map((name) => [name, values.get(name) ?? '']);
}

export function leadEmail(lead: StoredLead): Email {
  const fields = fieldRows(lead);
  const meta = metaRows(lead);
  const title = TITLES[lead.kind];
  const internal = lead.kind === 'creator' ? 'Base price is internal: for CCC matching and proposals only.' : '';
  const reply = 'Reply to this email to answer the sender directly.';
  const note = (s: string) => `<p style="margin:16px 0 0;font-family:${SANS};font-size:13px;line-height:19px;color:#6B655E;">${escapeHtml(s)}</p>`;
  const html = layout(
    title,
    `${FORM_NAMES[lead.kind]} from ${lead.email}`,
    `${table(fields)}<h2 style="margin:26px 0 6px;font-family:${HEAD};font-size:13px;line-height:18px;text-transform:uppercase;color:#B34A0B;">Submission details</h2>${table(meta)}${internal ? note(internal) : ''}${note(reply)}`,
  );
  const text = [title.toUpperCase(), '', textRows(fields), '', 'SUBMISSION DETAILS', textRows(meta), '', internal, reply].filter((line, i, all) => line !== '' || all[i - 1] !== '').join('\n');
  return { subject: leadSubject(lead), html, text };
}

/** Sent to the submitter when SEND_CONFIRMATION_EMAIL=true. Carries no user text, so it can't be used to relay spam. */
export function confirmationEmail(): Email {
  const body = 'Thanks, we have your details. We reply within 24 hours.';
  const sign = `If you did not send anything, you can ignore this email. Questions: ${site.email}`;
  const p = (s: string, size: number, color: string) => `<p style="margin:0 0 14px;font-family:${SANS};font-size:${size}px;line-height:${size + 8}px;color:${color};">${escapeHtml(s)}</p>`;
  return {
    subject: '[CCC] Thanks, we reply within 24 hours',
    html: layout('Thanks, we got it.', body, p(body, 16, '#141210') + p(sign, 13, '#6B655E')),
    text: `${body}\n\n${sign}`,
  };
}
