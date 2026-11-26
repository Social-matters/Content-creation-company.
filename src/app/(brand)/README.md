# (brand) route group — reserved for Phase 2

Brand dashboard (campaigns, briefs, approvals, reporting) lands here in Phase 2.
It will get its own `layout.tsx` (no marketing nav/footer, no Lenis) and share:

- design tokens: `src/styles/tokens.css` + `src/lib/tokens.ts`
- primitives: `src/components/ui/*` (Button, Badge, Modal, Counter, …)
- lead/auth plumbing: `src/lib/schemas.ts`, `src/lib/leads.ts` (swap for a DB adapter)

Do not add routes here during Phase 1.
