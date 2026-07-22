'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { CTA } from '@/components/shared/cta';
import { PageHero } from '@/components/shared/page-hero';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, Calendar, ArrowRight, Check, Instagram, Linkedin, Twitter, Trophy } from 'lucide-react';

const trainers = [
  {
    name: 'Arjun Rathore',
    role: 'Head Strength Coach',
    experience: '12+ years',
    bio: 'Former national-level powerlifter and S&C specialist. Arjun has coached over 500 members from beginner to competitive level, with a reputation for building raw, functional strength safely.',
    certifications: ['NSCA Certified Strength & Conditioning Specialist', 'ACE Personal Trainer', 'Kettlebell Level 2'],
    expertise: ['Powerlifting', 'Olympic Lifting', 'Strength Conditioning'],
    achievements: ['National Powerlifting Bronze 2015', 'Coached 3 state champions', '500+ clients trained'],
    image: 'https://images.pexels.com/photos/4944972/pexels-photo-4944972.jpeg?auto=compress&cs=tinysrgb&w=800',
    schedule: 'Mon–Fri · 6:00 AM – 12:00 PM',
    socials: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  },
  {
    name: 'Diya Nair',
    role: 'HIIT & Conditioning Coach',
    experience: '8+ years',
    bio: 'Diya brings infectious energy to every session. A former state-level sprinter, she specialises in fat loss, metabolic conditioning, and helping members build cardiovascular engines that last.',
    certifications: ['ACE Group Fitness Instructor', 'CrossFit Level 2 Trainer', 'Precision Nutrition L1'],
    expertise: ['HIIT', 'Fat Loss', 'Metabolic Conditioning'],
    achievements: ['State 100m Silver 2014', '200+ transformation stories', 'Featured in FitIndia 2023'],
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
    schedule: 'Mon–Sat · 4:00 PM – 9:00 PM',
    socials: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  },
  {
    name: 'Isha Gupta',
    role: 'Yoga & Mobility Specialist',
    experience: '10+ years',
    bio: 'Isha blends traditional yoga with modern mobility science. Her sessions help members move better, recover faster, and build the kind of flexibility that translates into every other lift.',
    certifications: ['RYT 500 Yoga Alliance', 'FMS Level 2', 'Mobility Specialist Certification'],
    expertise: ['Vinyasa Yoga', 'Mobility', 'Recovery'],
    achievements: ['RYT 500 certified', 'Conducted 50+ workshops', 'Specialist in injury rehab'],
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800',
    schedule: 'Tue–Sun · 7:00 AM – 11:00 AM',
    socials: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  },
  {
    name: 'Karan Singh',
    role: 'CrossFit & Functional Coach',
    experience: '7+ years',
    bio: 'Karan competed at the CrossFit Games Semifinals in 2022. He coaches members through high-intensity functional workouts with an obsessive focus on technique and injury prevention.',
    certifications: ['CrossFit Level 3 Trainer', 'USAW Sports Performance Coach', 'Precision Nutrition L1'],
    expertise: ['CrossFit', 'Gymnastics', 'Olympic Lifting'],
    achievements: ['CrossFit Games Semifinalist 2022', 'USAW certified', 'Coached 150+ CrossFit athletes'],
    image: 'https://images.pexels.com/photos/6456142/pexels-photo-6456142.jpeg?auto=compress&cs=tinysrgb&w=800',
    schedule: 'Mon–Sat · 10:00 AM – 6:00 PM',
    socials: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  },
];

const benefits = [
  'Personalised training program built around your goals',
  'Weekly progress tracking with body composition analysis',
  'Nutrition guidance tailored to your lifestyle',
  'Flexible scheduling that works around your routine',
  'Direct WhatsApp access to your trainer between sessions',
];

export default function PersonalTrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Personal Training"
        title="One-on-one coaching."
        highlight="Real results."
        description="Work directly with Indore’s most experienced trainers. Every program is built around your body, your goals, and your timeline — with weekly accountability built in."
        image="https://images.pexels.com/photos/6456142/pexels-photo-6456142.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Why PT */}
      <Section className="!pt-8">
        <SectionHeader
          eyebrow="Why Personal Training"
          title="The fastest path to your goals"
          description="Group classes are great. But if you want to break through a plateau, recover from an injury, or simply get there faster — personal training is the answer."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-3 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white mt-0.5">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <p className="text-sm text-black/75 leading-relaxed font-medium">{b}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Trainer profiles */}
      <Section className="bg-secondary/40">
        <SectionHeader
          eyebrow="Meet the Trainers"
          title="Coaches who live and breathe fitness"
          description="Every trainer at Limbodi is certified, experienced, and genuinely invested in your progress."
        />
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {trainers.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group rounded-3xl bg-white border border-black/[0.06] shadow-premium overflow-hidden hover:shadow-glow transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative sm:w-2/5 h-64 sm:h-auto shrink-0">
                  <OptimizedImage
                    src={t.image}
                    alt={t.name}
                    fill
                    wrapperClassName="absolute inset-0"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 md:p-7 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="accent-soft">{t.experience}</Badge>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-1">{t.name}</h3>
                  <p className="text-sm text-accent font-medium mb-4">{t.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.bio}</p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-1.5">
                      {t.expertise.map((e) => (
                        <span key={e} className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-medium text-black/70">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-2">Certifications</p>
                    <ul className="space-y-1">
                      {t.certifications.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Award className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-2">Achievements</p>
                    <ul className="space-y-1">
                      {t.achievements.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Trophy className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    <a href={t.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${t.name} on Instagram`} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.04] text-black/60 hover:bg-accent hover:text-white transition-all duration-300">
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a href={t.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t.name} on LinkedIn`} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.04] text-black/60 hover:bg-accent hover:text-white transition-all duration-300">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href={t.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${t.name} on Twitter`} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.04] text-black/60 hover:bg-accent hover:text-white transition-all duration-300">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-black/70 mb-5">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{t.schedule}</span>
                  </div>

                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center w-full rounded-full h-11 px-6 text-sm font-semibold gradient-accent text-white hover:shadow-glow transition-all duration-300 active:scale-[0.97]"
                  >
                    Book Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTA
          title="Ready to train with the best?"
          description="Book a free consultation with any of our trainers and discover what personalised coaching can do for you."
          primaryLabel="Book a Consultation"
          primaryHref="/contact"
          secondaryLabel="View Membership"
          secondaryHref="/membership"
        />
      </Section>
    </>
  );
}
