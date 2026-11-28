/**
 * Appends a lead to the team's Google Sheet through the Apps Script web app in
 * integrations/google-sheet/Code.gs. Server only.
 */
import type { SheetConfig } from './lead-config';
import { leadColumns } from './email/template';
import type { StoredLead } from './leads';

const TIMEOUT_MS = 15_000;

/** A cell starting with = + - @ would run as a formula (and could leak other rows): force it to text. */
export const asText = (value: string) => (/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

export async function appendToSheet(config: SheetConfig, lead: StoredLead) {
  const columns = leadColumns(lead);
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: config.secret, headers: columns.map(([name]) => name), row: columns.map(([, value]) => asText(value)) }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = await response.text();
  // Apps Script answers 200 even for its own error and sign-in pages, so only an explicit ok counts.
  let ok = false;
  try {
    ok = response.ok && JSON.parse(body).ok === true;
  } catch {
    ok = false;
  }
  if (!ok) throw new Error(`Google Sheet did not confirm the row (HTTP ${response.status}): ${body.slice(0, 300)}`);
}
