import { z } from 'zod';
import { categories, followerTiers } from '@/content/forms';
import { brandNeeds, budgets, talentTypes, timelines } from '@/content/v2/forms';

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number'));

const name = z.string().trim().min(2, 'Enter your name').max(80);
const email = z.email('Enter a valid email').trim().toLowerCase();
const city = z.string().trim().min(2, 'Enter your city').max(60);
const values = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];
/** react-hook-form gives `false` for an untouched checkbox group and a string for a single tick. */
const asArray = (v: unknown) => (v === false || v == null || v === '' ? [] : Array.isArray(v) ? v : [v]);
const needs = z.preprocess(asArray, z.array(z.enum(values(brandNeeds))));
const budget = z.enum(values(budgets), 'Pick a budget range');
const timeline = z.enum(values(timelines), 'Pick a timeline');
const talentType = z.enum(values(talentTypes), 'Tell us what you do');

/** Honeypot: real users never see or fill it. */
const website = z.string().max(0).optional();

export const brandLeadSchema = z.object({
  kind: z.literal('brand'),
  name,
  brand: z.string().trim().min(2, 'Enter your brand name').max(80),
  email,
  phone,
  category: z.enum(categories, 'Pick a category'),
  city,
  description: z.string().trim().min(10, 'A line or two helps us prepare').max(1200),
  // v2 fields: optional here so v1 submissions stay valid; brandLeadSchemaV2 requires them.
  needs: needs.optional(),
  budget: budget.optional(),
  timeline: timeline.optional(),
  website,
});

/** v2 brand form: what they need, budget and timeline are required. */
export const brandLeadSchemaV2 = brandLeadSchema.extend({
  needs: z.preprocess(asArray, z.array(z.enum(values(brandNeeds))).min(1, 'Pick at least one')),
  budget,
  timeline,
});

export const creatorLeadSchema = z.object({
  kind: z.literal('creator'),
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
  // v2 field: optional here so v1 submissions stay valid; creatorLeadSchemaV2 requires it.
  type: talentType.optional(),
  website,
});

/** v2 influencer-network form: "I am a" is required. */
export const creatorLeadSchemaV2 = creatorLeadSchema.extend({ type: talentType });

export const loginSchema = z.object({ kind: z.literal('login'), email, website });

export const leadSchema = z.discriminatedUnion('kind', [brandLeadSchema, creatorLeadSchema, loginSchema]);

export type BrandLeadInput = z.input<typeof brandLeadSchema>;
export type CreatorLeadInput = z.input<typeof creatorLeadSchema>;
export type LoginInput = z.input<typeof loginSchema>;
export type Lead = z.output<typeof leadSchema>;
