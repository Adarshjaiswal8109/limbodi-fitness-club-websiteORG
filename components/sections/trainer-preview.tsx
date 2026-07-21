'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { supabase } from '@/lib/supabase-client';
import type { Trainer } from '@/lib/types';

const fallbackTrainers = [
  { name: 'Arjun Rathore', role: 'Head Strength Coach', experience: '12+ years', image: 'https://images.pexels.com/photos/4944972/pexels-photo-4944972.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Diya Nair', role: 'HIIT & Conditioning', experience: '8+ years', image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Isha Gupta', role: 'Yoga & Mobility', experience: '10+ years', image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Karan Singh', role: 'CrossFit & Functional', experience: '7+ years', image: 'https://images.pexels.com/photos/6456142/pexels-photo-6456142.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export function TrainerPreview() {
  const [trainers, setTrainers] = useState<Trainer[]>([] as any);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('trainers')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .limit(4);
        if (data && data.length > 0) setTrainers(data as Trainer[]);
        else setTrainers(fallbackTrainers as any);
      } catch {
        setTrainers(fallbackTrainers as any);
      }
    })();
  }, []);

  return (
    <Section id="trainers" className="bg-secondary/40">
      <SectionHeader
        eyebrow="Meet the Team"
        title="Coaches who care about your results"
        description="Our trainers are athletes, educators, and motivators. They bring national-level experience and genuine passion to every session."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {trainers.map((t: any, i) => (
          <motion.article
            key={t.id || t.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-premium border border-black/[0.06]"
          >
            <div className="relative h-72 overflow-hidden">
              <OptimizedImage
                src={t.image}
                alt={t.name}
                fill
                wrapperClassName="h-72"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                  {t.experience}
                </p>
                <h3 className="font-display text-xl font-bold text-white">
                  {t.name}
                </h3>
                <p className="text-sm text-white/70">{t.role}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mt-10"
      >
        <Button variant="outline" size="lg" asChild>
          <Link href="/personal-training">
            Meet All Trainers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </Section>
  );
}
