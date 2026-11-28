import { getLeadConfig } from '@/lib/lead-config';

/** Runs once when a server instance starts: a production server with nowhere to put leads fails loudly. */
export function register() {
  getLeadConfig();
}
