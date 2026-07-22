/**
 * Central site configuration — all editable placeholders.
 * In production, these values are fetched from the `site_settings` Supabase table
 * via the Admin Dashboard. These defaults serve as fallbacks and initial seed values.
 */

export const siteConfig = {
  business: {
    name: 'Limbodi Fitness Club',
    tagline: 'Premium Fitness Club · Indore',
    phone: '+91 98260 00000',
    phoneRaw: '+919826000000',
    email: 'hello@limbodifitness.in',
    address: 'Limbodi Main Road, Near Sapphire Square, Limbodi, Indore, Madhya Pradesh 452010',
    addressShort: 'Limbodi Main Road, Indore',
    mapsLink: 'https://maps.google.com/?q=Limbodi+Indore',
    mapsEmbed: 'https://www.google.com/maps?q=Limbodi,Indore,Madhya+Pradesh&output=embed',
    hours: {
      monSat: '5:00 AM – 11:00 PM',
      sunday: '7:00 AM – 9:00 PM',
    },
  },
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  stats: {
    members: '1,200+',
    trainers: '15+',
    classes: '40+',
    years: '8',
  },
  rating: {
    value: '4.9',
    count: '300',
  },
  seo: {
    title: 'Limbodi Fitness Club — Premium Gym in Limbodi, Indore',
    description:
      'Indore\'s premier destination for strength, conditioning, and wellness. World-class equipment, elite trainers, and a community built for results.',
  },
} as const;

export type SiteConfig = typeof siteConfig;
