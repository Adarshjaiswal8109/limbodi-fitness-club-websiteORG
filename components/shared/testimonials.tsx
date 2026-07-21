'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { supabase } from '@/lib/supabase-client';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  quote: string;
  transformation?: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    name: 'Aarav Mehta',
    role: 'Member since 2021',
    image: 'https://images.pexels.com/photos/6456142/pexels-photo-6456142.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    quote: 'I dropped 18 kilos in seven months at Limbodi Fitness Club. The trainers actually care — they built a plan around my schedule and checked in every single week. This place changed how I see fitness.',
    transformation: '-18 kg in 7 months',
  },
  {
    name: 'Priya Sharma',
    role: 'Yoga & Strength Member',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    quote: 'The energy here is unmatched. I came in nervous and out of shape, and the community made me feel at home from day one. The morning HIIT sessions have become the best part of my routine.',
    transformation: 'Consistent for 2+ years',
  },
  {
    name: 'Rohan Kapoor',
    role: 'Powerlifter',
    image: 'https://images.pexels.com/photos/4944972/pexels-photo-4944972.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    quote: 'Best equipment in Indore, hands down. The strength zone has everything a serious lifter needs — competition racks, calibrated plates, and coaches who know their craft. My total went up 60kg in a year.',
    transformation: '+60 kg powerlifting total',
  },
  {
    name: 'Sneha Verma',
    role: 'Member since 2022',
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    quote: 'Clean, spacious, and genuinely premium. The locker rooms feel like a five-star hotel and the trainers treat every member like a VIP. Worth every rupee of the membership.',
    transformation: 'Lost 12 kg, gained confidence',
  },
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });
        if (data && data.length > 0) {
          setTestimonials(data.map((t: any) => ({
            name: t.name,
            role: t.role || 'Member',
            image: t.image || 'https://images.pexels.com/photos/6456142/pexels-photo-6456142.jpeg?auto=compress&cs=tinysrgb&w=200',
            rating: t.rating || 5,
            quote: t.quote,
            transformation: t.transformation,
          })));
        }
      } catch { /* keep fallback */ }
    })();
  }, []);

  const active = testimonials[index];

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(1), 5000);
    return () => clearInterval(timer);
  }, [paused, go]);

  return (
    <div
      className="mx-auto max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-[2rem] border border-black/[0.06] bg-white p-8 md:p-12 shadow-premium overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/5 blur-2xl" />
        <Quote className="absolute top-8 right-8 h-16 w-16 text-accent/10" />

        {/* Google rating badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1.5">
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            <span className="text-sm font-semibold text-black">4.9</span>
            <span className="text-xs text-muted-foreground">· Google</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="flex gap-1 mb-6">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>

            <blockquote className="font-display text-xl md:text-2xl font-medium leading-relaxed text-balance text-black/90 mb-8">
              &ldquo;{active.quote}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-accent/20">
                  <OptimizedImage
                    src={active.image}
                    alt={active.name}
                    fill
                    wrapperClassName="absolute inset-0"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display font-semibold text-black flex items-center gap-1.5">
                    {active.name}
                    <BadgeCheck className="h-4 w-4 text-accent" />
                  </p>
                  <p className="text-sm text-muted-foreground">{active.role}</p>
                </div>
              </div>
              {active.transformation && (
                <div className="rounded-full bg-accent/10 px-4 py-2">
                  <p className="text-sm font-semibold text-accent">{active.transformation}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/[0.06]">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-8 bg-accent' : 'w-2 bg-black/15 hover:bg-black/30'
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 hover:bg-black hover:text-white transition-all active:scale-90"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 hover:bg-black hover:text-white transition-all active:scale-90"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
