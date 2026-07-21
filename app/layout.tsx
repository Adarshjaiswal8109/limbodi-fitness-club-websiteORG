import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { PublicChrome } from '@/components/layout/public-chrome';
import { AuthProvider } from '@/lib/auth-context';
import { siteConfig } from '@/lib/site-config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://limbodifitness.in'),
  title: {
    default: siteConfig.seo.title,
    template: '%s · Limbodi Fitness Club',
  },
  description: siteConfig.seo.description,
  keywords: [
    'gym in Indore',
    'fitness club Limbodi',
    'personal training Indore',
    'group classes Indore',
    'luxury gym',
    'CrossFit Indore',
    'yoga studio Indore',
  ],
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    type: 'website',
    url: 'https://limbodifitness.in',
    siteName: 'Limbodi Fitness Club',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'HealthClub',
  name: siteConfig.business.name,
  description: siteConfig.seo.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Limbodi Main Road, Near Sapphire Square',
    addressLocality: 'Limbodi, Indore',
    addressRegion: 'Madhya Pradesh',
    postalCode: '452010',
    addressCountry: 'IN',
  },
  telephone: siteConfig.business.phone,
  email: siteConfig.business.email,
  url: 'https://limbodifitness.in',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '05:00',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '07:00',
      closes: '21:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: siteConfig.rating.value,
    reviewCount: siteConfig.rating.count,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans bg-white text-black min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-black focus:text-white focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold"
          >
            Skip to content
          </a>
          <PublicChrome>{children}</PublicChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
