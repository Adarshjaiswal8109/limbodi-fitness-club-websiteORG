'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { CTA } from '@/components/shared/cta';
import { PageHero } from '@/components/shared/page-hero';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const categories = ['All', 'Fitness', 'Nutrition', 'Workout', 'Motivation', 'Lifestyle', 'Strength', 'Cardio'];

const posts: Post[] = [
  {
    title: 'The Complete Beginner’s Guide to Strength Training',
    excerpt: 'Everything you need to know to start lifting safely — from choosing your first exercises to building a simple 3-day program that delivers real results in 12 weeks.',
    category: 'Strength',
    date: '15 Jul 2026',
    readTime: '8 min read',
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    title: '5 Indian Breakfasts That Pack 30g of Protein',
    excerpt: 'High-protein breakfasts don’t have to mean boiled chicken and eggs. These five Indian recipes are delicious, quick, and built for muscle.',
    category: 'Nutrition',
    date: '12 Jul 2026',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'How to Build a HIIT Routine That Actually Burns Fat',
    excerpt: 'High-intensity interval training is powerful — but only when programmed correctly. Here’s the science and a ready-to-use 20-minute workout.',
    category: 'Cardio',
    date: '10 Jul 2026',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Why You Keep Quitting (And How to Stop)',
    excerpt: 'Motivation is unreliable. Systems are not. Learn the 4-step framework our most consistent members use to show up even on the hard days.',
    category: 'Motivation',
    date: '8 Jul 2026',
    readTime: '7 min read',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'The Perfect Push Day: 6 Exercises for a Bigger Upper Body',
    excerpt: 'Chest, shoulders, and triceps — this push workout balances hypertrophy and strength, with regressions for every fitness level.',
    category: 'Workout',
    date: '5 Jul 2026',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Yoga for Lifters: 7 Poses That Improve Your Squat',
    excerpt: 'Mobility is the missing link in most strength programs. These seven poses target the hips, ankles, and thoracic spine for a deeper, safer squat.',
    category: 'Fitness',
    date: '3 Jul 2026',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'How Sleep Affects Muscle Growth (More Than You Think)',
    excerpt: 'You build muscle in bed, not in the gym. Here’s what happens to your gains when you sleep less than 6 hours — and how to fix it.',
    category: 'Lifestyle',
    date: '1 Jul 2026',
    readTime: '7 min read',
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Creatine Monohydrate: The One Supplement That Works',
    excerpt: 'The most researched, most effective, and most affordable supplement in fitness. Here’s how to take it, when, and what to expect.',
    category: 'Nutrition',
    date: '28 Jun 2026',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/3689150/pexels-photo-3689150.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Building a Home Workout That Doesn’t Suck',
    excerpt: 'No gym? No problem. This 30-minute bodyweight routine builds strength, burns calories, and needs zero equipment.',
    category: 'Workout',
    date: '25 Jun 2026',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/4664726/pexels-photo-4664726.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const featured = posts.find((p) => p.featured)!;
const recent = posts.filter((p) => !p.featured);

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return recent.filter((p) => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const matchesQuery =
        query === '' ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Train your mind."
        highlight="Transform your body."
        description="Evidence-based articles on fitness, nutrition, motivation, and lifestyle — written by the coaches at Limbodi Fitness Club. No fluff, just what works."
        image="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Featured article */}
      <Section className="!pt-8">
        <SectionHeader
          eyebrow="Featured Article"
          title="This week’s must-read"
          align="left"
        />
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="group relative overflow-hidden rounded-[2rem] bg-white border border-black/[0.06] shadow-premium grid lg:grid-cols-2 gap-0"
        >
          <div className="relative h-72 lg:h-auto min-h-[320px]">
            <OptimizedImage
              src={featured.image}
              alt={featured.title}
              fill
              wrapperClassName="absolute inset-0"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-7 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">{featured.category}</Badge>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {featured.readTime}
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 leading-tight">
              {featured.title}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{featured.date}</span>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all"
              >
                Read Article
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.article>
      </Section>

      {/* Search + categories + grid */}
      <Section className="bg-secondary/40">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md mx-auto mb-10"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full rounded-full border border-black/10 bg-white pl-12 pr-4 h-12 text-sm shadow-premium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </motion.div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                activeCategory === cat
                  ? 'gradient-accent text-white shadow-glow'
                  : 'bg-white border border-black/10 text-black/70 hover:border-accent hover:text-accent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + query}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {filtered.length > 0 ? (
              filtered.map((p, i) => (
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group rounded-3xl bg-white border border-black/[0.06] shadow-premium overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={p.image}
                      alt={p.title}
                      fill
                      wrapperClassName="h-48"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge variant="accent" className="absolute top-4 left-4">
                      {p.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span>{p.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {p.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 leading-snug group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {p.excerpt}
                    </p>
                    <a
                      href="/blog"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2.5 transition-all"
                    >
                      Read More
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* Recent posts strip */}
      <Section>
        <SectionHeader
          eyebrow="Recent Posts"
          title="Fresh off the press"
          align="left"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recent.slice(0, 4).map((p, i) => (
            <motion.a
              key={p.title}
              href="/blog"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col rounded-2xl border border-black/[0.06] bg-white p-4 shadow-premium hover:shadow-glow transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-accent" />
                {p.category}
              </div>
              <h4 className="font-display text-sm font-semibold leading-snug group-hover:text-accent transition-colors mb-2">
                {p.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-auto">{p.date}</span>
            </motion.a>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <CTA
          title="Ready to put this knowledge to work?"
          description="Book a free trial at Limbodi Fitness Club and train with coaches who turn articles into action."
          primaryLabel="Start Free Trial"
          primaryHref="/contact"
        />
      </Section>
    </>
  );
}
