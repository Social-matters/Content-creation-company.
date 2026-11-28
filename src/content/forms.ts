import { site } from './site';

export const categories = [
  'Food & Beverage',
  'Fashion',
  'Beauty & Skincare',
  'Fitness',
  'Lifestyle',
  'Travel & Hospitality',
  'Tech & Gadgets',
  'Home & Decor',
  'Other',
] as const;

export const followerTiers = [
  { value: 'nano', label: 'Nano · under 10K' },
  { value: 'micro', label: 'Micro · 10K–100K' },
  { value: 'mid', label: 'Mid · 100K–500K' },
  { value: 'macro', label: 'Macro · 500K+' },
] as const;

export const formCopy = {
  required: 'Required',
  select: 'Select…',
  submitting: 'Sending…',
  error: `Something went wrong. Please try again or email us at ${site.email}`,
  rateLimited: `Too many submissions. Please wait a few minutes, or email us at ${site.email}`,
  honeypot: 'Leave this field empty',
  /** Required checkbox under every form; the link opens in a new tab so typed details aren't lost. */
  consent: { before: 'By submitting, you agree to our', link: 'Privacy Policy', after: '.', href: '/privacy', required: 'Please tick the box to continue' },
  brand: {
    eyebrow: '// For brands',
    title: "I'm a brand.",
    intro: 'Tell us about your brand. Founding-brand slots come with locked pricing for year one and priority placement at launch.',
    fields: {
      name: 'Your name',
      brand: 'Brand name',
      email: 'Work email',
      phone: 'Phone',
      category: 'Category',
      city: 'City',
      description: 'Tell us about your brand',
    },
    placeholders: {
      name: 'Aditi Sharma',
      brand: 'Brewhaus Coffee',
      email: 'you@brand.in',
      phone: '98765 43210',
      city: 'Mumbai',
      description: 'What you sell, who buys it, and what you want creators to make.',
    },
    submit: 'Apply as a brand',
    success: {
      title: "You're on the list.",
      body: "We'll be in touch within 24 hours to talk founding-brand slots.",
      cta: 'Done',
    },
  },
  creator: {
    eyebrow: '// For creators',
    title: "I'm a creator.",
    intro: 'Join the network. Brand work flows in; we handle briefs, contracts and payments.',
    fields: {
      name: 'Your name',
      instagram: 'Instagram handle',
      email: 'Email',
      phone: 'Phone',
      niche: 'Niche',
      tier: 'Followers',
      city: 'City',
      languages: 'Languages you create in',
      description: 'Tell us about your content',
    },
    placeholders: {
      name: 'Rohan Mehta',
      instagram: '@yourhandle',
      email: 'you@email.com',
      phone: '98765 43210',
      city: 'Pune',
      languages: 'Hindi, English, Marathi',
      description: 'What you make, who watches, and a reel you are proud of.',
    },
    submit: 'Apply as a creator',
    success: {
      title: "Application in.",
      body: "We review every profile by hand. Expect a reply within 24 hours.",
      cta: 'Done',
    },
  },
  // Login is UI-only until the dashboards exist: nothing is sent or stored.
  login: {
    eyebrow: '// Welcome back',
    title: 'Log in',
    intro: 'Dashboards for brands and creators open soon.',
    email: 'Email',
    placeholder: 'you@email.com',
    submit: 'Continue',
    success: { title: 'Not open yet.', body: `Dashboards are still being built, so there is nothing to log in to. Questions? Email ${site.email}.`, cta: 'Done' },
    note: 'No password needed.',
  },
  pages: {
    brand: { title: 'Start a campaign', description: 'Apply for a founding-brand slot with Content Creation Company.' },
    creator: { title: 'Join as a creator', description: "Apply to join India's creator-commerce network." },
  },
} as const;

export const phonePrefix = '+91';
