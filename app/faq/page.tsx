'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { CTA } from '@/components/shared/cta';
import { PageHero } from '@/components/shared/page-hero';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { HelpCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['All', 'Membership', 'Training', 'Facilities', 'Nutrition', 'General'];

const faqs = [
  { category: 'Membership', q: 'What are your membership options?', a: 'We offer Monthly, Quarterly, Half-Yearly, Annual, Student, Couple, Corporate, and Personal Training packages. Each plan is designed to fit different goals, schedules, and budgets. Visit our Membership page for full pricing and feature details.' },
  { category: 'Membership', q: 'Is there a free trial available?', a: 'Yes. Every membership includes a 7-day free trial with full access to the gym floor, group classes, and locker rooms. No card required — just walk in with a valid photo ID.' },
  { category: 'Membership', q: 'Can I freeze my membership?', a: 'Quarterly, Half-Yearly, and Annual members can freeze their membership for up to 30 days per year at no extra cost. Inform the front desk 48 hours in advance to activate a freeze.' },
  { category: 'Membership', q: 'Do you charge a joining fee?', a: 'There is a one-time ₹999 joining fee that covers your fitness assessment, access card, and onboarding session. This fee is often waived during promotional periods.' },
  { category: 'Membership', q: 'What payment methods do you accept?', a: 'We accept UPI, all major credit and debit cards, net banking, and cash. Annual members can also opt for a 3-month EMI plan at zero interest.' },
  { category: 'Membership', q: 'Can I get a refund if I cancel?', a: 'We offer a 7-day free trial so you can experience the club before committing. After purchase, memberships are non-refundable but can be transferred to another person for a ₹500 admin fee.' },
  { category: 'Membership', q: 'Is there a student discount?', a: 'Yes. Full-time students aged 16 and above with a valid student ID qualify for our Student Membership at ₹1,999/month — a 33% discount on the standard monthly rate.' },

  { category: 'Training', q: 'Do I need to be fit to join?', a: 'Absolutely not. The majority of our members started as complete beginners. Our trainers are experienced in working with all fitness levels, from first-timers to competitive athletes.' },
  { category: 'Training', q: 'How often should I train as a beginner?', a: 'For beginners, we recommend 3 sessions per week with at least one rest day between workouts. This allows your body to adapt and recover while building a consistent habit.' },
  { category: 'Training', q: 'Do you offer personal training?', a: 'Yes. We have 4 certified personal trainers covering strength, HIIT, yoga, and CrossFit. You can book individual sessions or purchase a 12-session package at a discounted rate.' },
  { category: 'Training', q: 'What should I bring to my first session?', a: 'Bring comfortable workout clothes, a water bottle, a small towel, and indoor training shoes. We provide lockers, towels, and shower amenities. Arrive 10 minutes early for your first assessment.' },
  { category: 'Training', q: 'Can I switch trainers if it’s not a good fit?', a: 'Of course. Every trainer has a different style, and finding the right fit matters. Speak to the front desk and we’ll arrange a session with a different coach at no extra cost.' },
  { category: 'Training', q: 'Do you train people with injuries or medical conditions?', a: 'Yes, but we require clearance from your physician first. Our trainers are certified to modify exercises around injuries and will build a program that works with — not against — your condition.' },

  { category: 'Facilities', q: 'What are your operating hours?', a: 'We are open Monday to Saturday from 5:00 AM to 11:00 PM and Sunday from 7:00 AM to 9:00 PM. We are closed on major national holidays — check our Instagram for holiday schedules.' },
  { category: 'Facilities', q: 'Is parking available?', a: 'Yes. We have secure parking for over 80 vehicles, including dedicated two-wheeler bays. Parking is free for all members during their visit.' },
  { category: 'Facilities', q: 'Do you have showers and locker rooms?', a: 'Yes. We have spacious, climate-controlled locker rooms with hot showers, premium toiletries, and fresh towels. Lockers are available for daily use at no extra charge.' },
  { category: 'Facilities', q: 'Is there a steam room?', a: 'Yes, our steam room is available to Half-Yearly, Annual, and Personal Training members. It’s a great way to relax muscles and accelerate recovery after an intense session.' },
  { category: 'Facilities', q: 'Do you have a supplement store?', a: 'Yes. Our in-house supplement store stocks whey protein, creatine, vitamins, and recovery supplements from trusted brands — all at member-exclusive prices.' },
  { category: 'Facilities', q: 'Is the gym air-conditioned?', a: 'Yes. The entire training floor, studios, and locker rooms are climate-controlled for comfort and safety, with dedicated ventilation in the cardio and CrossFit zones.' },

  { category: 'Nutrition', q: 'Do you offer nutrition coaching?', a: 'Yes. Half-Yearly and Annual memberships include a nutrition consultation. We also offer standalone nutrition coaching packages for members on any plan.' },
  { category: 'Nutrition', q: 'Can you make a diet plan for Indian food?', a: 'Absolutely. Our nutritionists specialise in Indian dietary patterns — vegetarian, vegan, and non-vegetarian. Your plan will include local, affordable ingredients you actually enjoy eating.' },
  { category: 'Nutrition', q: 'Do I need supplements to see results?', a: 'No. Supplements are optional and complement — never replace — a solid diet. We recommend starting with whey protein and creatine, but only after your nutrition and training are consistent.' },
  { category: 'Nutrition', q: 'How much water should I drink?', a: 'Aim for 3–4 litres per day as a baseline, and add 500ml–1L for every hour of intense training. Pale yellow urine is the simplest indicator of good hydration.' },

  { category: 'General', q: 'Where exactly is Limbodi Fitness Club located?', a: 'We are on Limbodi Main Road, near Sapphire Square, in Limbodi, Indore, Madhya Pradesh 452010. Search “Limbodi Fitness Club” on Google Maps for turn-by-turn directions.' },
  { category: 'General', q: 'How do I contact the club?', a: 'You can call us at +91 98260 00000, email hello@limbodifitness.in, or message us on WhatsApp. Our front desk is available during all open hours for walk-in enquiries.' },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = faqs.filter((f) => {
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    const matchesQuery =
      query === '' ||
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions? We have"
        highlight="the answers."
        description="Everything you need to know about Limbodi Fitness Club — memberships, training, facilities, nutrition, and more. Can’t find what you’re looking for? Reach out anytime."
        image="https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <Section className="!pt-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            aria-label="Search FAQs"
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

        {/* Accordion */}
        <div className="mx-auto max-w-3xl">
          {filtered.length > 0 ? (
            <Accordion type="single" collapsible className="rounded-3xl border border-black/[0.06] bg-white shadow-premium px-6">
              {filtered.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-black/[0.06]">
                  <AccordionTrigger className="text-left text-base font-display font-semibold hover:text-accent">
                    <span className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pl-8">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-16 rounded-3xl border border-dashed border-black/15 bg-secondary/30">
              <p className="text-muted-foreground">No questions match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <CTA
          title="Still have questions?"
          description="Our front desk team is happy to help. Call, WhatsApp, or visit us — we’ll answer everything you need to know."
          primaryLabel="Contact Us"
          primaryHref="/contact"
          secondaryLabel="View Membership"
          secondaryHref="/membership"
        />
      </Section>
    </>
  );
}
