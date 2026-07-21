'use client';

import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

const fallbackClasses = [
  {
    name: 'Power Hour',
    category: 'Strength',
    schedule: 'Mon, Wed, Fri — 6:00 AM',
    trainer: 'Coach Arjun',
    intensity: 'High',
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'HIIT Inferno',
    category: 'Cardio',
    schedule: 'Tue, Thu — 7:00 PM',
    trainer: 'Coach Diya',
    intensity: 'Very High',
    image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Flow & Mobility',
    category: 'Yoga',
    schedule: 'Sat, Sun — 8:00 AM',
    trainer: 'Coach Isha',
    intensity: 'Low',
    image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'CrossFit WOD',
    category: 'Functional',
    schedule: 'Daily — 6:00 PM',
    trainer: 'Coach Karan',
    intensity: 'High',
    image: 'https://images.pexels.com/photos/4664726/pexels-photo-4664726.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export function FeaturedClasses() {
  const [classes, setClasses] = useState(fallbackClasses);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('classes')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .limit(4);
        if (data && data.length > 0) {
          setClasses(data.map((c: any) => ({
            name: c.name,
            category: c.difficulty || 'All Levels',
            schedule: `${c.day_of_week || ''} ${c.start_time || ''}`.trim() || 'TBD',
            trainer: 'Coach',
            intensity: c.difficulty || 'All Levels',
            image: c.image || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
          })));
        }
      } catch { /* keep fallback */ }
    })();
  }, []);
  return (
    <Section id="classes">
      <SectionHeader
        eyebrow="Featured Classes"
        title="Find a class that moves you"
        description="Over 40 classes every week, from sunrise strength to evening yoga. Every session is designed to challenge, energise, and reward."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {classes.map((c, i) => (
          <motion.article
            key={c.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-premium border border-black/[0.06]"
          >
            <div className="relative h-52 overflow-hidden">
              <OptimizedImage
                src={c.image}
                alt={c.name}
                fill
                wrapperClassName="h-52"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <Badge
                variant="accent"
                className="absolute top-4 left-4"
              >
                {c.category}
              </Badge>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display text-xl font-bold text-white">
                  {c.name}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-accent" />
                <span>{c.schedule}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4 text-accent" />
                  <span>{c.trainer}</span>
                </div>
                <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">
                  {c.intensity}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
