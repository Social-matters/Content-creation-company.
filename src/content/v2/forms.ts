/** v2 form copy and option lists (v1's lives in ../forms.ts). */

export const brandNeeds = [
  { value: 'influencer', label: 'Influencer campaign' },
  { value: 'celebrity', label: 'Celebrity or serial actor' },
  { value: 'models', label: 'Model shoot' },
  { value: 'content', label: 'Creator content' },
] as const;

// PLACEHOLDER: budget bands to confirm with CCC
export const budgets = [
  { value: 'under-50k', label: 'Under ₹50K' },
  { value: '50k-2l', label: '₹50K – ₹2L' },
  { value: '2l-10l', label: '₹2L – ₹10L' },
  { value: '10l-plus', label: '₹10L+' },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

export const timelines = [
  { value: 'asap', label: 'As soon as possible' },
  { value: 'month', label: 'Within a month' },
  { value: 'quarter', label: 'In 1–3 months' },
  { value: 'exploring', label: 'Just exploring' },
] as const;

export const talentTypes = [
  { value: 'influencer', label: 'Influencer' },
  { value: 'creator', label: 'Creator' },
  { value: 'model', label: 'Model' },
] as const;

export const formCopyV2 = {
  brand: {
    needs: 'What do you need?',
    budget: 'Budget',
    timeline: 'Timeline',
  },
  creator: {
    eyebrow: '// Join the network',
    title: 'Join our influencer network.',
    intro: 'Influencers, creators and models. Paid briefs from brands that fit your audience; we handle contracts and payments.',
    type: 'I am a',
    submit: 'Apply to join',
  },
} as const;
