import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Training — Expert Coaches in Indore',
  description:
    'Work one-on-one with certified personal trainers at Limbodi Fitness Club. Strength, HIIT, yoga, and CrossFit coaching tailored to your goals.',
  alternates: { canonical: 'https://limbodifitness.in/personal-training' },
  openGraph: {
    title: 'Personal Training — Limbodi Fitness Club',
    description: 'Certified trainers, personalised programs, real results.',
    url: 'https://limbodifitness.in/personal-training',
  },
};

export default function PersonalTrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
