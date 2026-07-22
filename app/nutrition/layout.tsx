import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nutrition Guide — Expert Diet & Supplement Advice',
  description:
    'Your complete nutrition hub — weight loss, muscle gain, protein guides, supplements, hydration, workout nutrition, and healthy Indian recipes.',
  alternates: { canonical: 'https://limbodifitness.in/nutrition' },
  openGraph: {
    title: 'Nutrition Guide — Limbodi Fitness Club',
    description: 'Science-backed nutrition advice for every goal. India-friendly meal plans.',
    url: 'https://limbodifitness.in/nutrition',
  },
};

export default function NutritionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
