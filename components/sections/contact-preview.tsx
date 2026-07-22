'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

const contactItems = [
  {
    icon: MapPin,
    label: 'Visit Us',
    value: siteConfig.business.address,
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: siteConfig.business.phone,
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: siteConfig.business.email,
  },
  {
    icon: Clock,
    label: 'Open Hours',
    value: `Mon–Sat: ${siteConfig.business.hours.monSat} · Sun: ${siteConfig.business.hours.sunday}`,
  },
];

export function ContactPreview() {
  return (
    <Section className="bg-secondary/40">
      <SectionHeader
        eyebrow="Get in Touch"
        title="Come say hello"
        description="Drop by for a tour, call us, or send a message — we’d love to show you around and answer your questions."
      />

      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden min-h-[320px] shadow-premium border border-black/[0.06]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/0" />
          <div className="relative h-full flex flex-col justify-between p-8">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-accent shadow-glow">
                <MapPin className="h-6 w-6 text-white" />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold">
                  Limbodi Fitness Club
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Limbodi Main Road, Indore
                </p>
              </div>
            </div>
            <Button variant="accent" size="lg" className="w-full sm:w-auto" asChild>
              <a
                href="https://maps.google.com/?q=Limbodi+Indore"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium hover:shadow-glow transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {item.label}
              </p>
              <p className="text-sm font-medium text-black leading-relaxed">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
