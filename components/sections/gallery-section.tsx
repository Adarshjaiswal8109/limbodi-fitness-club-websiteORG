'use client';

import { Section, SectionHeader } from '@/components/ui/section';
import { GalleryPreview } from '@/components/shared/gallery-preview';

export function GallerySection() {
  return (
    <Section id="gallery" className="bg-secondary/40">
      <SectionHeader
        eyebrow="Inside the Club"
        title="A space designed to inspire"
        description="Step into 12,000 square feet of premium training space — every corner built to help you perform at your peak."
      />
      <GalleryPreview />
    </Section>
  );
}
