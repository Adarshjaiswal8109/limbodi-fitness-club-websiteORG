import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership Plans — Premium Gym Memberships in Indore',
  description:
    'Choose from 8 flexible membership plans at Limbodi Fitness Club — Monthly, Quarterly, Annual, Student, Couple, Corporate, and Personal Training. 7-day free trial included.',
  alternates: { canonical: 'https://limbodifitness.in/membership' },
  openGraph: {
    title: 'Membership Plans — Limbodi Fitness Club',
    description: '8 flexible plans with a 7-day free trial. No contracts, no pressure.',
    url: 'https://limbodifitness.in/membership',
  },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
