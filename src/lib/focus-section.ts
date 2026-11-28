/**
 * Moves keyboard and screen-reader focus to a section's heading after we send someone there.
 * Only headings marked with `focusTarget` take focus; never a form field (that would open the
 * keyboard on phones).
 */
export function focusSectionHeading(id: string) {
  document.getElementById(id)?.querySelector<HTMLElement>('[data-focus-target]')?.focus({ preventScroll: true });
}
