import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Fitness, Nutrition & Training Tips',
  description:
    'Evidence-based articles on fitness, nutrition, workouts, motivation, and lifestyle — written by the certified coaches at Limbodi Fitness Club.',
  alternates: { canonical: 'https://limbodifitness.in/blog' },
  openGraph: {
    title: 'Blog — Limbodi Fitness Club',
    description: 'No fluff, just what works. Fitness articles by certified coaches.',
    url: 'https://limbodifitness.in/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
