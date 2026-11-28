/**
 * v2 service pages: /v2/celebrities and /v2/model-shoots. Lean: hero, what's included,
 * how it works, enquiry form. No celebrity or actor names, roster sizes or results:
 * those come from CCC (see docs/TODO-real-content.md).
 */
import type { Cta, Headline } from '../types';

const enquire = { label: 'Enquire now', href: '#enquire' } satisfies Cta;
const call = { label: 'Book a call', href: '/contact', meta: '15 min' } satisfies Cta;

export const celebritiesPage = {
  meta: {
    title: 'Celebrity & TV serial actor tie-ups',
    description: 'Endorsements, appearances and branded content with celebrities and television serial actors, arranged and managed by Content Creation Company.',
  },
  hero: {
    badge: 'Celebrity & TV serial actor tie-ups',
    headline: ['Famous faces.', { before: 'Real ', accent: 'reach.', style: 'block' }] satisfies Headline,
    lead: 'Endorsements, appearances and branded content with celebrities and television serial actors, arranged and managed for you.',
    ctas: [enquire, call],
  },
  included: {
    label: "// What's included",
    headline: ['What we', { accent: 'arrange.', style: 'orange' }] satisfies Headline,
    items: [
      { n: '01', title: 'Endorsements', body: 'A known face for a launch or a range, with usage rights agreed up front.' },
      { n: '02', title: 'Appearances', body: 'Store openings, events and launches, scheduled and managed end to end.' },
      { n: '03', title: 'Branded content', body: 'Reels, stories and integrations written to fit their voice and your brief.' },
      { n: '04', title: 'Serial actor tie-ups', body: 'Television serial actors for regional and family audiences.' },
    ],
  },
  how: {
    label: '// How it works',
    headline: ['From brief', { before: 'to ', accent: 'on air.', style: 'orange' }] satisfies Headline,
    items: [
      { n: '01', title: 'Brief', body: 'Tell us the audience, the budget and the dates.' },
      { n: '02', title: 'Shortlist', body: 'We come back with talent that fits, with availability and fees.' },
      { n: '03', title: 'Confirm', body: 'Contracts, usage rights and schedules handled for you.' },
      { n: '04', title: 'Live', body: 'The content goes out. We track it and report back.' },
    ],
  },
  enquiry: {
    label: '// Enquire',
    headline: ['Tell us who', { before: 'you have ', accent: 'in mind.', style: 'orange' }] satisfies Headline,
    body: 'Roster shared on request. No names are confirmed until contracts are signed.',
  },
} as const;

export const modelShootsPage = {
  meta: {
    title: 'Model shoots',
    description: 'Content Creation Company provides the models and runs the shoot: product, lookbook, e-commerce and campaign shoots.',
  },
  hero: {
    badge: 'Model shoots',
    headline: ['Models.', 'Lights.', { accent: 'Content.', style: 'block' }] satisfies Headline,
    lead: 'We provide the models and run the shoot: product, lookbook, e-commerce and campaign shoots, in a studio or on location.',
    ctas: [enquire, call],
  },
  included: {
    label: "// What's included",
    headline: ['Everything', { before: 'on the ', accent: 'call sheet.', style: 'orange' }] satisfies Headline,
    items: [
      { n: '01', title: 'Models', body: 'Cast to your brand and audience, with usage rights agreed.' },
      { n: '02', title: 'Shoot crew', body: 'Photographer, videographer, styling and lighting.' },
      { n: '03', title: 'Studio or location', body: 'A studio we book, or your own space.' },
      { n: '04', title: 'Edited delivery', body: 'Retouched stills and cut reels, ready to post.' },
    ],
  },
  how: {
    label: '// How it works',
    headline: ['From brief', { before: 'to ', accent: 'delivery.', style: 'orange' }] satisfies Headline,
    items: [
      { n: '01', title: 'Brief', body: 'Products, looks, references and where it will be used.' },
      { n: '02', title: 'Casting', body: 'Model options to approve, with rates.' },
      { n: '03', title: 'Shoot day', body: 'We run the set. You can join or stay at your desk.' },
      { n: '04', title: 'Delivery', body: 'Selects, retouches and reels in the formats you need.' },
    ],
  },
  enquiry: {
    label: '// Enquire',
    headline: ['Book a', { accent: 'shoot.', style: 'orange' }] satisfies Headline,
    body: 'Tell us what you are shooting and when. We reply within 24 hours.',
  },
} as const;

export const joinPage = {
  meta: { title: 'Join our influencer network', description: 'Influencers, creators and models: apply to join the Content Creation Company network.' },
  hero: {
    badge: 'Now onboarding influencers',
    headline: ['Join the', { accent: 'network.', style: 'block' }] satisfies Headline,
    lead: 'Influencers, creators and models: paid briefs from brands that fit your audience.',
  },
} as const;
