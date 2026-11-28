import { getMailConfig } from '@/lib/email/config';

/** Runs once when a server instance starts: a production server with incomplete email settings fails loudly. */
export function register() {
  getMailConfig();
}
