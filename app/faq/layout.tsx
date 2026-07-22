import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description:
    'Answers to 25+ common questions about Limbodi Fitness Club — memberships, training, facilities, nutrition, and more. Searchable and categorized.',
  alternates: { canonical: 'https://limbodifitness.in/faq' },
  openGraph: {
    title: 'FAQ — Limbodi Fitness Club',
    description: '25+ answers to your most common questions. Search by keyword or category.',
    url: 'https://limbodifitness.in/faq',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
