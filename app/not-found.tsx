'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 md:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-secondary/30" />
      <div className="pointer-events-none absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-accent/15 blur-[140px] animate-float-slow" />
      <div className="pointer-events-none absolute bottom-1/4 -left-40 h-96 w-96 rounded-full bg-orange-300/10 blur-[120px] animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group" aria-label="Limbodi Fitness Club home">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-accent shadow-glow transition-transform group-hover:scale-110">
            <Dumbbell className="h-6 w-6 text-white" strokeWidth={2.5} />
          </span>
        </Link>

        <h1 className="font-display text-8xl md:text-9xl font-extrabold tracking-tight text-gradient-accent mb-4">
          404
        </h1>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
          Page not found
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="accent" size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="glass" size="lg" asChild>
            <Link href="/contact">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
