'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  image: string;
  align?: 'left' | 'center';
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  image,
  align = 'left',
}: PageHeroProps) {
  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 px-5 md:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <OptimizedImage
          src={image}
          alt=""
          fill
          priority
          wrapperClassName="absolute inset-0"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/95" />
      </div>
      <div className="pointer-events-none absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-accent/15 blur-[140px]" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={cn(
            'max-w-3xl',
            align === 'center' && 'mx-auto text-center'
          )}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-px w-8 bg-accent" />
            {eyebrow}
            {align === 'center' && <span className="h-px w-8 bg-accent" />}
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-balance">
            {title}
            {highlight && (
              <>
                <br />
                <span className="text-accent">{highlight}</span>
              </>
            )}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-black/70 leading-relaxed max-w-xl text-balance">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
