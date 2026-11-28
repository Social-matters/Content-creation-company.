/**
 * Where a submission came from: the page, plus any UTM tags the visitor arrived with.
 * Tags are remembered for the session because client-side navigation drops the query string.
 * Browser-safe and dependency-free (it's part of the main bundle).
 */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

const STORE = 'ccc:utm';

function fromUrl() {
  const params = new URLSearchParams(window.location.search);
  const found: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }
  return found;
}

function stored(): Partial<Record<UtmKey, string>> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? '{}');
  } catch {
    return {};
  }
}

/** Call once on landing. */
export function rememberUtm() {
  const found = fromUrl();
  if (!Object.keys(found).length) return;
  try {
    sessionStorage.setItem(STORE, JSON.stringify(found));
  } catch {
    // storage blocked: the tags are still read from the URL if the form is sent from the landing page
  }
}

export function leadContext() {
  return { page: window.location.pathname, utm: { ...stored(), ...fromUrl() } };
}
