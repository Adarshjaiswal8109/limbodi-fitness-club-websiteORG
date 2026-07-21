import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Visit Limbodi Fitness Club in Indore',
  description:
    'Get in touch with Limbodi Fitness Club. Call, WhatsApp, email, or visit us on Limbodi Main Road, Indore. Open 5 AM – 11 PM, six days a week.',
  alternates: { canonical: 'https://limbodifitness.in/contact' },
  openGraph: {
    title: 'Contact — Limbodi Fitness Club',
    description: 'Call, WhatsApp, email, or visit us. We respond within a few hours.',
    url: 'https://limbodifitness.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
