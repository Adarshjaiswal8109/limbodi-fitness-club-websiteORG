'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { OptimizedImage } from '@/components/ui/optimized-image';

const services = [
  {
    title: 'Strength Training',
    description:
      'Build raw power with competition-grade racks, plates, and free weights in our dedicated strength zone.',
    image:
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Most Popular',
  },
  {
    title: 'Personal Training',
    description:
      'One-on-one coaching tailored to your body, your goals, and your timeline with dedicated accountability.',
    image:
      'https://images.pexels.com/photos/6456142/pexels-photo-6456142.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: '1-on-1',
  },
  {
    title: 'Nutrition Coaching',
    description:
      'Sustainable meal plans designed by certified nutritionists to fuel performance and accelerate results.',
    image:
      'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'New',
  },
];

export function FeaturedServices() {
  return (
    <Section id="services" className="bg-secondary/40">
      <SectionHeader
        eyebrow="Featured Services"
        title="Everything you need under one roof"
        description="From strength and conditioning to nutrition and recovery, our services cover the full spectrum of fitness."
      />

      <div className="grid md:grid-cols-3 gap-5 md:gap-6">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-premium border border-black/[0.06]"
          >
            <div className="relative h-60 overflow-hidden">
              <OptimizedImage
                src={s.image}
                alt={s.title}
                fill
                wrapperClassName="h-60"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black backdrop-blur-sm">
                {s.tag}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
