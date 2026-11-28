/**
 * Every form's shape, used twice: by the browser (react-hook-form) and again by the server
 * action. Each form has its own `kind`, so both sides run exactly the same schema.
 */
import { z } from 'zod';
import { UTM_KEYS } from '@/lib/lead-context';
import { categories, followerTiers, formCopy } from '@/content/forms';
import { brandNeeds, budgets, priceUnits, talentTypes, timelines } from '@/content/v2/forms';

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number'));

const name = z.string().trim().min(2, 'Enter your name').max(80);
const email = z.string().trim().toLowerCase().max(160).pipe(z.email('Enter a valid email'));
const city = z.string().trim().min(2, 'Enter your city').max(60);
const values = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];
/** react-hook-form gives `false` for an untouched checkbox group and a string for a single tick. */
const asArray = (v: unknown) => (v === false || v == null || v === '' ? [] : Array.isArray(v) ? v : [v]);

const consent = z.boolean(formCopy.consent.required).refine((v) => v, formCopy.consent.required);
/** Honeypot: real users never see or fill it. */
const website = z.string().max(0).optional();
const always = { consent, website };

const brandBase = {
  name,
  brand: z.string().trim().min(2, 'Enter your brand name').max(80),
  email,
  phone,
  category: z.enum(categories, 'Pick a category'),
  city,
  description: z.string().trim().min(10, 'A line or two helps us prepare').max(1200),
  ...always,
};
const brandDetail = {
  ...brandBase,
  needs: z.preprocess(asArray, z.array(z.enum(values(brandNeeds))).min(1, 'Pick at least one')),
  budget: z.enum(values(budgets), 'Pick a budget range'),
  timeline: z.enum(values(timelines), 'Pick a timeline'),
};

/** v2 brand application, and the two enquiry forms on the Celebrities and Model Shoots pages. */
export const brandSchema = z.object({ kind: z.literal('brand'), ...brandDetail });
export const celebritySchema = z.object({ kind: z.literal('celebrity'), ...brandDetail });
export const modelShootSchema = z.object({ kind: z.literal('model-shoot'), ...brandDetail });
/** v1 brand application (no needs, budget or timeline). */
export const brandClassicSchema = z.object({ kind: z.literal('brand-classic'), ...brandBase });

const creatorBase = {
  name,
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, ''))
    .pipe(z.string().regex(/^[A-Za-z0-9._]{1,30}$/, 'Enter a valid Instagram handle')),
  email,
  phone,
  niche: z.enum(categories, 'Pick your niche'),
  tier: z.enum(followerTiers.map((t) => t.value) as [string, ...string[]], 'Pick your follower range'),
  city,
  languages: z.string().trim().min(2, 'Which languages do you create in?').max(120),
  description: z.string().trim().min(10, 'A line or two helps us review you').max(1200),
  ...always,
};

/** Rupees, typed as text so "5,000" and "₹5000" are accepted. Stays internal to CCC. */
const basePrice = z
  .string()
  .transform((v) => v.replace(/[₹,\s]/g, ''))
  .pipe(z.string().regex(/^\d{3,8}$/, 'Enter your rate in rupees (at least ₹100), numbers only'));

/** v2 influencer-network application. */
export const creatorSchema = z.object({
  kind: z.literal('creator'),
  ...creatorBase,
  type: z.enum(values(talentTypes), 'Tell us what you do'),
  basePrice,
  priceUnit: z.enum(values(priceUnits), 'Pick what the rate covers'),
});
/** v1 creator application. */
export const creatorClassicSchema = z.object({ kind: z.literal('creator-classic'), ...creatorBase });

export const contactSchema = z.object({
  kind: z.literal('contact'),
  name,
  email,
  message: z.string().trim().min(10, 'A line or two helps us reply').max(2000),
  ...always,
});

export const earlyAccessSchema = z.object({ kind: z.literal('early-access'), email, ...always });

/** The login box is UI-only: validated in the browser, never sent. */
export const loginSchema = z.object({ email });

export const leadSchema = z.discriminatedUnion('kind', [brandSchema, celebritySchema, modelShootSchema, brandClassicSchema, creatorSchema, creatorClassicSchema, contactSchema, earlyAccessSchema]);

/** Where a submission came from. Informational only, so bad values are dropped rather than rejected. */
export const leadContextSchema = z
  .object({
    page: z.string().max(300).startsWith('/').catch('/'),
    utm: z.partialRecord(z.enum(UTM_KEYS), z.string().max(200)).catch({}),
  })
  .catch({ page: '/', utm: {} });

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
export type LeadContext = z.output<typeof leadContextSchema>;
/** Field sets for the forms (the widest variant of each; `kind` picks the schema). */
export type BrandFormInput = Omit<z.input<typeof brandSchema>, 'kind'> & { kind: 'brand' | 'celebrity' | 'model-shoot' | 'brand-classic' };
export type CreatorFormInput = Omit<z.input<typeof creatorSchema>, 'kind'> & { kind: 'creator' | 'creator-classic' };
export type ContactFormInput = z.input<typeof contactSchema>;
export type EarlyAccessFormInput = z.input<typeof earlyAccessSchema>;
export type LoginInput = z.input<typeof loginSchema>;
