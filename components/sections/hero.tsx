'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Star, Sparkles, Users, Dumbbell, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { FreeTrialModal } from '@/components/shared/free-trial-modal';
import { useSiteSettings } from '@/hooks/use-site-settings';

function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime: number | null = null;
          const animate = (ts: number) => {
            if (startTime === null) startTime = ts;
            const progress = Math.min((ts - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(value);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function Hero() {
  const { stats, rating } = useSiteSettings();
  const [trialOpen, setTrialOpen] = useState(false);

  const heroStats = [
    { icon: Users, value: stats.members, label: 'Active Members' },
    { icon: Dumbbell, value: stats.trainers, label: 'Expert Trainers' },
    { icon: Award, value: stats.years, label: 'Years Strong' },
  ];
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 200]);
  const yContent = useTransform(scrollY, [0, 800], [0, 80]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <>
      <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 px-5 md:px-8 overflow-hidden">
        {/* Layered background */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
          <OptimizedImage
            src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Athlete training in a premium gym"
            fill
            priority
            wrapperClassName="absolute inset-0"
            className="object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/80 to-white/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
          {/* Animated accent gradient */}
          <div className="absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[140px] animate-float-slow" />
          <div className="absolute bottom-1/4 -left-40 h-96 w-96 rounded-full bg-orange-300/15 blur-[120px] animate-float" />
        </motion.div>

        <motion.div style={{ y: yContent, opacity }} className="mx-auto max-w-7xl w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6 shadow-premium"
            >
              <span className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-br from-accent to-orange-400"
                  />
                ))}
              </span>
              <span className="text-sm font-medium text-black/70">
                {stats.members} members training daily
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-balance"
            >
              Train Hard.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-gradient-accent">Live Strong.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute bottom-2 left-0 h-3 w-full bg-accent/20 -z-0 origin-left rounded-full"
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg md:text-xl text-black/70 leading-relaxed max-w-xl text-balance"
            >
              Indore&apos;s premier fitness destination in the heart of Limbodi.
              World-class equipment, elite coaching, and a community that pushes
              you to be unstoppable.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-9 flex flex-col sm:flex-row items-center gap-4"
            >
              <Button variant="accent" size="lg" onClick={() => setTrialOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link href="/about">
                  <Play className="mr-2 h-4 w-4 fill-accent text-accent" />
                  Watch Tour
                </Link>
              </Button>
            </motion.div>

            {/* Rating + stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-black/60">
                  <span className="font-semibold text-black">{rating.value}</span> from {rating.count}+
                  Google reviews
                </p>
              </div>

              {/* Stat counters */}
              <div className="hidden sm:flex items-center gap-6 pl-6 border-l border-black/10">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <stat.icon className="h-4 w-4 text-accent" />
                    <div>
                      <p className="font-display text-lg font-bold text-black leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-black/20 p-1.5">
            <motion.span
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-2 w-1 rounded-full bg-accent"
            />
          </div>
        </motion.div>
      </section>

      <FreeTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </>
  );
}
