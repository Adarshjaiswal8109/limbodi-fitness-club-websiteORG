'use client';

import { motion } from 'framer-motion';
import { Dumbbell, HeartPulse, Users, Clock } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Stats } from '@/components/shared/stats';

const features = [
  {
    icon: Dumbbell,
    title: 'Premium Equipment',
    description:
      'Imported Hammer Strength, Technogym, and Rogue gear across a 12,000 sq ft training floor.',
  },
  {
    icon: HeartPulse,
    title: 'Personalised Plans',
    description:
      'Every member gets a custom training and nutrition blueprint built around their goals.',
  },
  {
    icon: Users,
    title: 'Expert Coaching',
    description:
      'Certified trainers with national-level experience guiding you every step of the way.',
  },
  {
    icon: Clock,
    title: 'Open 18 Hours Daily',
    description:
      'From 5 AM to 11 PM, your gym is ready when you are — even on the busiest days.',
  },
];

export function WhyChooseUs() {
  return (
    <Section id="why">
      <SectionHeader
        eyebrow="Why Choose Us"
        title="Built different, so you can be too"
        description="We obsess over the details that matter — equipment, coaching, atmosphere — so you can focus entirely on showing up and putting in the work."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group rounded-3xl border border-black/[0.06] bg-white p-6 md:p-7 shadow-premium hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>

      <Stats />
    </Section>
  );
}
