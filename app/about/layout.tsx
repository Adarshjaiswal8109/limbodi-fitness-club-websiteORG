import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Indore\'s Premier Fitness Destination',
  description:
    'Founded in 2017, Limbodi Fitness Club has grown into Indore\'s most trusted fitness destination. Learn our story, mission, vision, and values.',
  alternates: { canonical: 'https://limbodifitness.in/about' },
  openGraph: {
    title: 'About Us — Limbodi Fitness Club',
    description: 'More than a gym. A movement. Our story since 2017.',
    url: 'https://limbodifitness.in/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
