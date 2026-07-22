import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator — Check Your Body Mass Index',
  description:
    'Calculate your BMI instantly with our free tool. Get personalised health recommendations based on your height, weight, age, and gender.',
  alternates: { canonical: 'https://limbodifitness.in/bmi-calculator' },
  openGraph: {
    title: 'BMI Calculator — Limbodi Fitness Club',
    description: 'Know your numbers. Own your health. Free BMI calculator with recommendations.',
    url: 'https://limbodifitness.in/bmi-calculator',
  },
};

export default function BMICalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
