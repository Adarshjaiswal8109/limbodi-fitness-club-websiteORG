import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facilities — 14 Premium Training Zones in Indore',
  description:
    'Explore 12,000 sq ft of world-class facilities at Limbodi Fitness Club — imported machines, free weights, functional training, cardio, CrossFit, yoga studio, steam room, and more.',
  alternates: { canonical: 'https://limbodifitness.in/facilities' },
  openGraph: {
    title: 'Facilities — Limbodi Fitness Club',
    description: '14 purpose-built zones across 12,000 sq ft of premium training space.',
    url: 'https://limbodifitness.in/facilities',
  },
};

export default function FacilitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
