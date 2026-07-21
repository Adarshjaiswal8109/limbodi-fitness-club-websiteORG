import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://limbodifitness.in';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/membership`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/personal-training`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/facilities`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/nutrition`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/bmi-calculator`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/admin`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/admin/login`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
