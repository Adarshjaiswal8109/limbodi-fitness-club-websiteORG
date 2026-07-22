'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function Counter({ value, suffix = '', prefix = '', duration = 2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
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
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 1200, suffix: '+', label: 'Active Members' },
  { value: 15, suffix: '+', label: 'Expert Trainers' },
  { value: 40, suffix: '+', label: 'Weekly Classes' },
  { value: 8, suffix: '', label: 'Years of Excellence' },
];

export function Stats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative rounded-3xl border border-black/[0.06] bg-white p-6 md:p-8 shadow-premium overflow-hidden group"
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/5 transition-transform duration-500 group-hover:scale-150" />
          <div className="relative">
            <p className="font-display text-4xl md:text-5xl font-bold tracking-tight text-black">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
