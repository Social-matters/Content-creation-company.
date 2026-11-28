/**
 * PLACEHOLDER legal copy. A reasonable starting draft only: it must be reviewed by
 * counsel (incl. DPDP Act, 2023 obligations) before launch. Listed in docs/TODO-real-content.md.
 */
export type LegalDoc = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

// PLACEHOLDER: draft legal copy, needs counsel review before launch
export const privacy: LegalDoc = {
  title: 'Privacy policy',
  description: 'How Content Creation Company collects, uses and protects your personal data.',
  updated: '28 November 2026',
  intro: 'This policy explains what personal data Content Creation Company ("CCC", "we") collects through this website, why, and the choices you have.',
  sections: [
    {
      heading: 'What we collect',
      body: [
        'When you send a brand application, an influencer or creator application, a celebrity or model shoot enquiry, a contact message or an early-access signup, we collect what you type into the form: for example your name, brand name, email, phone number, city, category or niche, Instagram handle, follower range, languages, budget, timeline, your base rate and any message you add.',
        'With each submission we also record the page it was sent from and any campaign tags (UTM) in the link that brought you here. We briefly use your IP address to limit spam.',
        'We also collect basic technical data (browser type, pages visited) to keep the site secure and working.',
      ],
    },
    {
      heading: 'Why we use it',
      body: [
        'Each submission goes to the CCC team by email or into the team’s Google Sheet. They use it to respond to you, match brands with influencers and creators, and prepare proposals. We also use it to tell you about early access and to improve the service. We do not sell your personal data.',
        'Creator rates are used only by CCC, for matching and proposals.',
      ],
    },
    {
      heading: 'Who we share it with',
      body: ['Service providers that help us run the site and deliver email (including Resend, which sends form submissions to our inbox, and Google, which stores our spreadsheets), under contracts that protect your data. Brands and creators only see each other’s details once both sides agree to work together.'],
    },
    {
      heading: 'How long we keep it',
      body: ['Application data is kept while your application or account is active and for up to 24 months after, unless the law requires otherwise.'],
    },
    {
      heading: 'Your rights',
      body: ['You can ask to access, correct or delete your personal data, or withdraw consent, by emailing hello@contentcreationcompany.in. We respond within 30 days.'],
    },
    {
      heading: 'Contact',
      body: ['Questions about this policy: hello@contentcreationcompany.in.'],
    },
  ],
};

export const terms: LegalDoc = {
  title: 'Terms of use',
  description: 'The terms that apply when you use the Content Creation Company website.',
  updated: '28 November 2026',
  intro: 'By using this website you agree to these terms. If you do not agree, please do not use the site.',
  sections: [
    {
      heading: 'Early access',
      body: ['Applying through this site does not create a contract. Features and availability described here are indicative, and nothing is agreed until it is confirmed in writing.'],
    },
    {
      heading: 'Your content',
      body: ['You are responsible for the information you submit and confirm it is accurate and yours to share.'],
    },
    {
      heading: 'Our content',
      body: ['The site’s design, text and brand assets belong to Content Creation Company or its licensors. Stock footage is used under its respective licence.'],
    },
    {
      heading: 'Liability',
      body: ['The site is provided "as is". To the extent the law allows, we are not liable for indirect losses arising from its use.'],
    },
    {
      heading: 'Governing law',
      body: ['These terms are governed by the laws of India. Courts in the city of our registered office have jurisdiction.'],
    },
    {
      heading: 'Contact',
      body: ['hello@contentcreationcompany.in'],
    },
  ],
};

export const legalCopy = { updated: 'Last updated' } as const;
