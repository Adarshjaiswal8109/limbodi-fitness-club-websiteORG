'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { Stats } from '@/components/shared/stats';
import { CTA } from '@/components/shared/cta';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Target, Eye, Heart, Shield, Zap, Award, Users, Dumbbell } from 'lucide-react';

const story = {
  title: 'Our Story',
  paragraphs: [
    'Limbodi Fitness Club was born in 2017 from a simple belief: that world-class fitness should be accessible to everyone in Indore, not just those who could afford to travel abroad for it. What started as a 2,000 sq ft studio with three machines has grown into a 12,000 sq ft training destination that over 1,200 members call their second home.',
    'Our founder, a former national-level powerlifter, saw too many people in Limbodi give up on fitness because the local options were either under-equipped or overpriced. He set out to build a space where a first-timer and a competitive athlete could train side by side — where the equipment is premium, the coaching is genuine, and the atmosphere pushes you to show up even on the hard days.',
    'Eight years later, that vision is alive in every corner of the club. We have guided hundreds of members through transformations, trained state-level athletes, and built a community that celebrates every personal best — big or small.',
  ],
};

const mission = {
  title: 'Our Mission',
  description:
    'To empower every member of the Limbodi community to become the strongest, healthiest version of themselves — through expert coaching, premium facilities, and an environment that makes showing up the best part of the day.',
};

const vision = {
  title: 'Our Vision',
  description:
    'To be the most trusted fitness destination in Indore — known not just for equipment and classes, but for the lives we change and the community we build around discipline, respect, and relentless progress.',
};

const values = [
  { icon: Heart, title: 'Member First', description: 'Every decision we make starts with one question: does this help our members succeed?' },
  { icon: Shield, title: 'Integrity', description: 'We do what we say. No gimmicks, no shortcuts — just honest coaching and real results.' },
  { icon: Zap, title: 'Excellence', description: 'From equipment to cleanliness to coaching, we hold ourselves to the highest standard.' },
  { icon: Users, title: 'Community', description: 'We train hard together and celebrate together. No one succeeds alone at Limbodi.' },
  { icon: Award, title: 'Discipline', description: 'Consistency beats intensity. We help you build habits that last a lifetime.' },
  { icon: Dumbbell, title: 'Progress', description: 'We measure success in personal bests, not just in kilos lost or gained.' },
];

const facilities = [
  { title: 'Strength Zone', description: 'Competition-grade power racks, Olympic platforms, calibrated plates, and a full range of Hammer Strength machines.', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Cardio Deck', description: 'Premium treadmills, assault bikes, rowers, and stair climbers with personal screens and a view of the training floor.', image: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Functional Training Area', description: 'Kettlebells, sled tracks, battle ropes, and open turf for CrossFit-style WODs and mobility work.', image: 'https://images.pexels.com/photos/4664726/pexels-photo-4664726.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Group Studio', description: 'A dedicated soundproof studio for HIIT, yoga, dance fitness, and spin classes with a premium sound system.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Recovery Lounge', description: 'Foam rollers, massage guns, a stretching area, and a hydration station to help you recover and refuel.', image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Locker Rooms', description: 'Spacious, climate-controlled locker rooms with hot showers, fresh towels, and daily-use lockers.', image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 px-5 md:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <OptimizedImage
            src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Premium gym interior"
            fill
            priority
            wrapperClassName="absolute inset-0"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/95" />
        </div>
        <div className="pointer-events-none absolute top-1/4 -left-40 h-96 w-96 rounded-full bg-accent/15 blur-[140px]" />

        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
              <span className="h-px w-8 bg-accent" />
              About Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-balance">
              More than a gym.
              <br />
              <span className="text-accent">A movement.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-black/70 leading-relaxed max-w-xl text-balance">
              We are Limbodi Fitness Club — Indore’s home for serious training,
              genuine community, and the kind of results that speak for
              themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-premium h-[420px]">
              <OptimizedImage
                src="https://images.pexels.com/photos/6456142/pexels-photo-6456142.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Limbodi Fitness Club training"
                fill
                wrapperClassName="absolute inset-0"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-3xl glass shadow-premium p-5 hidden md:block">
              <p className="font-display text-3xl font-bold text-accent">2017</p>
              <p className="text-sm text-muted-foreground">Founded in Limbodi</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
              <span className="h-px w-8 bg-accent" />
              {story.title}
            </span>
            <div className="space-y-4">
              {story.paragraphs.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-black/75 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="bg-secondary/40 !py-16">
        <Stats />
      </Section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] bg-black text-white p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/20 blur-[100px]" />
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent shadow-glow mb-5">
                <Target className="h-7 w-7 text-white" />
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                {mission.title}
              </h2>
              <p className="text-white/70 leading-relaxed text-balance">
                {mission.description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-8 md:p-10 shadow-premium"
          >
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-[100px]" />
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-5">
                <Eye className="h-7 w-7" />
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                {vision.title}
              </h2>
              <p className="text-black/70 leading-relaxed text-balance">
                {vision.description}
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Core Values */}
      <Section className="bg-secondary/40">
        <SectionHeader
          eyebrow="Core Values"
          title="What we stand for"
          description="These aren’t words on a wall — they are the principles that guide every coaching cue, every equipment choice, and every member interaction at Limbodi."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-3xl border border-black/[0.06] bg-white p-6 md:p-7 shadow-premium hover:shadow-glow hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-5 transition-transform duration-300 group-hover:scale-110">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {v.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Facilities */}
      <Section>
        <SectionHeader
          eyebrow="Facilities"
          title="World-class, every square foot"
          description="Six purpose-built zones designed to cover every aspect of your training — from heavy lifting to mindful recovery."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {facilities.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-premium border border-black/[0.06]"
            >
              <div className="relative h-52 overflow-hidden">
                <OptimizedImage
                  src={f.image}
                  alt={f.title}
                  fill
                  wrapperClassName="h-52"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-5 font-display text-xl font-bold text-white">
                  {f.title}
                </h3>
              </div>
              <p className="p-5 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTA
          title="Ready to be part of the story?"
          description="The next chapter of Limbodi Fitness Club is yours to write. Walk in for a free trial and see why 1,200 members call this home."
        />
      </Section>
    </>
  );
}
