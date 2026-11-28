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

// CONFIRM: rate units offered to influencers, creators and models
export const priceUnits = [
  { value: 'per reel', label: 'Per reel' },
  { value: 'per post', label: 'Per post' },
  { value: 'per story', label: 'Per story' },
  { value: 'per day', label: 'Per shoot day' },
  { value: 'per campaign', label: 'Per campaign' },
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
    basePrice: 'Your base rate (₹)',
    basePricePlaceholder: '5000',
    priceUnit: 'Rate is',
    priceNote: 'Only CCC sees your rate. We use it for matching and quoting.',
    submit: 'Apply to join',
  },
  contact: {
    eyebrow: '// Contact',
    title: 'Send a message.',
    intro: 'Brands, influencers, investors, venues or press: tell us what you need.',
    fields: { name: 'Your name', email: 'Email', message: 'Message' },
    placeholders: { name: 'Aditi Sharma', email: 'you@email.com', message: 'What can we help with?' },
    submit: 'Send message',
    success: { title: 'Message sent.', body: 'We reply within 24 hours.', cta: 'Done' },
  },
  earlyAccess: {
    eyebrow: '// Early access',
    title: 'Get early access.',
    intro: 'Leave your email and we will tell you when dashboards open.',
    email: 'Email',
    placeholder: 'you@email.com',
    submit: 'Join the list',
    success: { title: "You're on the list.", body: 'We will email you when early access opens.', cta: 'Done' },
  },
  contactTabs: ['Send a message', "I'm a brand", 'Join the network'],
} as const;
