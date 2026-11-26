/**
 * NON-PRODUCTION MARKER.
 *
 * While this is `true`, the site contains placeholder numbers, testimonials, handles
 * and brand slots (every one is tagged `// PLACEHOLDER` and listed in
 * docs/TODO-real-content.md). Effects:
 *   - testimonials render a small "Sample" tag
 *   - <meta name="ccc-content" content="placeholder"> is emitted (invisible)
 *   - `pnpm check:content` fails, so CI can block a production deploy
 *
 * Flip to `false` only after every PLACEHOLDER has been replaced with real, verified content.
 */
export const PLACEHOLDER_CONTENT = true;
