'use client';

import { Section } from '@/components/ui/section';
import { Testimonials } from '@/components/shared/testimonials';

export function TestimonialsSection() {
  return (
    <Section id="testimonials">
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-8 bg-accent" />
          Member Stories
          <span className="h-px w-8 bg-accent" />
        </span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4 text-balance">
          Real people, real transformations
        </h2>
      </div>
      <Testimonials />
    </Section>
  );
}
