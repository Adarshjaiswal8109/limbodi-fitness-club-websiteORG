'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

interface CTAProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTA({
  title = 'Your Strongest Self Starts Today',
  description = 'Join Limbodi Fitness Club and train in a space built for champions. Your first session is on us — walk in, and we’ll handle the rest.',
  primaryLabel = 'Claim Free Trial',
  primaryHref = '/membership',
  secondaryLabel = 'Call Us',
  secondaryHref = `tel:${siteConfig.business.phoneRaw}`,
}: CTAProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-black text-white px-6 py-16 md:px-16 md:py-24">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/30 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-px w-8 bg-accent" />
          Start Now
          <span className="h-px w-8 bg-accent" />
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-balance mb-5">
          {title}
        </h2>
        <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-9 text-balance">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="accent" size="lg" asChild>
            <Link href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="glass" size="lg" asChild>
            <a href={secondaryHref}>
              <Phone className="mr-2 h-4 w-4" />
              {secondaryLabel}
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
