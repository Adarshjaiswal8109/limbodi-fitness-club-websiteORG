'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { CTA } from '@/components/shared/cta';
import { MembershipEnquiryForm } from '@/components/shared/membership-enquiry-form';
import { PageHero } from '@/components/shared/page-hero';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Check, Crown, Users, GraduationCap, Building2, Dumbbell, Calendar, Sparkles, Heart, Shield, Clock, TrendingUp, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const benefits = [
  { icon: Dumbbell, title: 'Unlimited Equipment Access', description: 'Full access to 12,000 sq ft of premium imported strength and cardio equipment.' },
  { icon: Users, title: 'Expert Coaching', description: '15+ certified trainers covering strength, HIIT, yoga, and CrossFit disciplines.' },
  { icon: Heart, title: 'Nutrition Guidance', description: 'Personalised meal plans built around Indian dietary habits and your specific goals.' },
  { icon: Clock, title: '18 Hours Daily', description: 'Open 5 AM to 11 PM, six days a week — train when it suits your schedule.' },
  { icon: Shield, title: 'Safe & Hygienic', description: 'Daily sanitised equipment, spacious layout, and dedicated cleaning staff.' },
  { icon: TrendingUp, title: 'Progress Tracking', description: 'Monthly body composition analysis to keep you accountable and motivated.' },
];

const whyJoin = [
  { stat: '1,200+', label: 'Active members who train with us weekly' },
  { stat: '4.9★', label: 'Average Google rating from 300+ reviews' },
  { stat: '15+', label: 'Certified trainers across every discipline' },
  { stat: '12,000', label: 'Square feet of premium training space' },
];

const plans = [
  {
    name: 'Monthly',
    price: '₹2,999',
    period: '/month',
    icon: Calendar,
    description: 'Maximum flexibility — pay as you go.',
    features: [
      'Full gym floor access',
      'Locker room & showers',
      '4 group classes / week',
      '1 fitness assessment',
    ],
    highlighted: false,
  },
  {
    name: 'Quarterly',
    price: '₹7,999',
    period: '/3 months',
    icon: Sparkles,
    description: 'Save 11% versus monthly billing.',
    features: [
      'Everything in Monthly',
      'Unlimited group classes',
      '1 PT session / month',
      'Body composition analysis',
    ],
    highlighted: false,
  },
  {
    name: 'Half-Yearly',
    price: '₹14,999',
    period: '/6 months',
    icon: Dumbbell,
    description: 'Best balance of value and commitment.',
    features: [
      'Everything in Quarterly',
      '2 PT sessions / month',
      'Nutrition consultation',
      'Recovery lounge access',
    ],
    highlighted: true,
  },
  {
    name: 'Annual',
    price: '₹26,999',
    period: '/year',
    icon: Crown,
    description: 'Maximum savings — 25% off monthly.',
    features: [
      'Everything in Half-Yearly',
      '4 PT sessions / month',
      'Custom nutrition plan',
      '2 guest passes / month',
      'Priority class booking',
    ],
    highlighted: false,
  },
  {
    name: 'Student',
    price: '₹1,999',
    period: '/month',
    icon: GraduationCap,
    description: 'Discounted pricing for full-time students.',
    features: [
      'Full gym floor access',
      'Off-peak hours access',
      '3 group classes / week',
      'Valid student ID required',
    ],
    highlighted: false,
  },
  {
    name: 'Couple',
    price: '₹4,999',
    period: '/month',
    icon: Users,
    description: 'Two memberships, one great price.',
    features: [
      '2 full memberships',
      'Unlimited group classes',
      'Shared locker access',
      '1 PT session / month (shared)',
    ],
    highlighted: false,
  },
  {
    name: 'Corporate',
    price: 'Custom',
    period: '',
    icon: Building2,
    description: 'Tailored plans for teams of 10+.',
    features: [
      'Volume pricing',
      'Dedicated account manager',
      'On-site wellness workshops',
      'Flexible billing cycles',
    ],
    highlighted: false,
  },
  {
    name: 'Personal Training',
    price: '₹5,999',
    period: '/12 sessions',
    icon: Dumbbell,
    description: 'One-on-one coaching package.',
    features: [
      '12 PT sessions',
      'Custom training program',
      'Weekly progress tracking',
      'Nutrition guidance included',
    ],
    highlighted: false,
  },
];

const comparisonRows = [
  { feature: 'Gym floor access', monthly: true, quarterly: true, halfYearly: true, annual: true, student: true, couple: true, corporate: true, pt: false },
  { feature: 'Group classes', monthly: '4/wk', quarterly: 'Unlimited', halfYearly: 'Unlimited', annual: 'Unlimited', student: '3/wk', couple: 'Unlimited', corporate: 'Unlimited', pt: false },
  { feature: 'Personal training', monthly: false, quarterly: '1/mo', halfYearly: '2/mo', annual: '4/mo', student: false, couple: '1/mo', corporate: 'Add-on', pt: '12 sessions' },
  { feature: 'Nutrition consultation', monthly: false, quarterly: false, halfYearly: true, annual: 'Custom plan', student: false, couple: false, corporate: true, pt: true },
  { feature: 'Recovery lounge', monthly: false, quarterly: false, halfYearly: true, annual: true, student: false, couple: false, corporate: true, pt: true },
  { feature: 'Guest passes', monthly: false, quarterly: false, halfYearly: false, annual: '2/mo', student: false, couple: false, corporate: 'Custom', pt: false },
  { feature: 'Priority booking', monthly: false, quarterly: false, halfYearly: false, annual: true, student: false, couple: false, corporate: true, pt: true },
  { feature: 'Free trial', monthly: '7 days', quarterly: '7 days', halfYearly: '7 days', annual: '7 days', student: '7 days', couple: '7 days', corporate: 'Custom', pt: '1 session' },
];

const membershipFaqs = [
  { q: 'Can I freeze my membership if I travel or fall ill?', a: 'Yes. Quarterly, Half-Yearly, and Annual members can freeze their membership for up to 30 days per year at no extra cost. Just inform the front desk 48 hours in advance.' },
  { q: 'Is there a joining fee?', a: 'There is a one-time ₹999 joining fee that covers your fitness assessment, access card, and onboarding session. This fee is waived during promotional periods.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, all major credit and debit cards, net banking, and cash. Annual members can also opt for a 3-month EMI plan at no interest.' },
  { q: 'Can I upgrade or downgrade my plan mid-term?', a: 'Yes. You can upgrade at any time and only pay the prorated difference. Downgrades take effect at the start of your next billing cycle.' },
  { q: 'Do you offer refunds?', a: 'We offer a 7-day free trial so you can experience the club before committing. After purchase, memberships are non-refundable but can be transferred to another person for a ₹500 admin fee.' },
  { q: 'What is the student membership eligibility?', a: 'Any full-time student aged 16 and above with a valid student ID from a recognised institution qualifies. Bring your ID during enrolment to activate the discounted rate.' },
  { q: 'How does the couple membership work?', a: 'The couple membership covers two individuals at the same residential address. Both members get independent access cards and full benefits. Proof of shared address is required.' },
  { q: 'Can my company get a corporate membership?', a: 'Yes. We offer custom corporate plans for teams of 10 or more with volume discounts, dedicated account management, and optional on-site wellness workshops. Contact us for a tailored quote.' },
];

function renderCell(value: string | boolean) {
  if (value === true) return <Check className="h-4 w-4 text-accent mx-auto" strokeWidth={3} />;
  if (value === false) return <span className="text-black/30">—</span>;
  return <span className="text-xs font-medium text-black/70">{value}</span>;
}

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Choose your plan."
        highlight="Start your journey."
        description="Eight flexible plans designed to match every goal, schedule, and budget. Every membership includes a 7-day free trial — no contracts, no pressure."
        image="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Plans grid */}
      <Section className="!pt-8">
        <SectionHeader
          eyebrow="Pricing Plans"
          title="Find the plan that fits your life"
          description="From flexible monthly access to all-inclusive annual memberships — pick what works for you and upgrade anytime."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className={cn(
                'relative rounded-3xl p-6 md:p-7 transition-all duration-500 flex flex-col',
                plan.highlighted
                  ? 'bg-black text-white shadow-glow lg:-translate-y-2'
                  : 'bg-white border border-black/[0.06] shadow-premium hover:-translate-y-1'
              )}
            >
              {plan.highlighted && (
                <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/20 blur-[100px]" />
              )}
              <div className="relative flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-2xl',
                      plan.highlighted
                        ? 'gradient-accent shadow-glow'
                        : 'bg-accent/10 text-accent'
                    )}
                  >
                    <plan.icon className={cn('h-5 w-5', plan.highlighted ? 'text-white' : 'text-accent')} />
                  </span>
                  {plan.highlighted && <Badge variant="accent">Most Popular</Badge>}
                </div>

                <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
                <p className={cn('text-sm mb-4', plan.highlighted ? 'text-white/60' : 'text-muted-foreground')}>
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-5">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={cn('text-sm', plan.highlighted ? 'text-white/50' : 'text-muted-foreground')}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5',
                          plan.highlighted ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                        )}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className={cn(plan.highlighted ? 'text-white/80' : 'text-black/75')}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/contact"
                  className={cn(
                    'inline-flex w-full items-center justify-center rounded-full h-11 px-6 text-sm font-semibold transition-all duration-300 active:scale-[0.97]',
                    plan.highlighted
                      ? 'gradient-accent text-white hover:shadow-glow'
                      : 'border border-black/15 text-black hover:bg-black hover:text-white'
                  )}
                >
                  Join Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Comparison table */}
      <Section className="bg-secondary/40">
        <SectionHeader
          eyebrow="Compare Plans"
          title="Side-by-side comparison"
          description="Every detail, laid out clearly so you can choose with confidence."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="overflow-x-auto rounded-3xl border border-black/[0.06] bg-white shadow-premium"
        >
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left p-5 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Feature</th>
                {plans.map((p) => (
                  <th key={p.name} className={cn('p-5 text-center text-sm font-semibold', p.highlighted ? 'text-accent' : 'text-black')}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.feature} className={cn('border-b border-black/[0.04]', i % 2 === 1 && 'bg-black/[0.015]')}>
                  <td className="p-5 text-sm font-medium text-black/80">{row.feature}</td>
                  <td className="p-5 text-center">{renderCell(row.monthly)}</td>
                  <td className="p-5 text-center">{renderCell(row.quarterly)}</td>
                  <td className="p-5 text-center">{renderCell(row.halfYearly)}</td>
                  <td className="p-5 text-center">{renderCell(row.annual)}</td>
                  <td className="p-5 text-center">{renderCell(row.student)}</td>
                  <td className="p-5 text-center">{renderCell(row.couple)}</td>
                  <td className="p-5 text-center">{renderCell(row.corporate)}</td>
                  <td className="p-5 text-center">{renderCell(row.pt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Section>

      {/* Membership Benefits */}
      <Section>
        <SectionHeader
          eyebrow="Membership Benefits"
          title="Everything included in your membership"
          description="One membership unlocks the full Limbodi experience — no hidden fees, no locked zones, no surprises."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-3xl border border-black/[0.06] bg-white p-6 md:p-7 shadow-premium hover:shadow-glow hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-5 transition-transform duration-300 group-hover:scale-110">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Why Join */}
      <Section className="bg-secondary/40">
        <SectionHeader
          eyebrow="Why Join Limbodi"
          title="The numbers speak for themselves"
          description="We are not just another gym. We are a community built on results, and the results are measurable."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {whyJoin.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl border border-black/[0.06] bg-white p-6 md:p-8 shadow-premium overflow-hidden group"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/5 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <p className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient-accent">
                  {item.stat}
                </p>
                <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Membership FAQs */}
      <Section>
        <SectionHeader
          eyebrow="Membership FAQs"
          title="Questions about memberships"
          description="Everything you need to know before you join."
        />
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="rounded-3xl border border-black/[0.06] bg-white shadow-premium px-6">
            {membershipFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-black/[0.06]">
                <AccordionTrigger className="text-left text-base font-display font-semibold hover:text-accent">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Membership Enquiry Form */}
      <Section>
        <SectionHeader
          eyebrow="Get Started"
          title="Ready to join? Enquire now"
          description="Fill in the form below and our team will reach out to guide you through the membership process."
        />
        <div className="mx-auto max-w-2xl">
          <MembershipEnquiryForm />
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTA
          title="Still deciding? Try us free for 7 days"
          description="Walk into Limbodi Fitness Club, meet the trainers, and experience the space — no commitment required."
          primaryLabel="Claim Free Trial"
          primaryHref="/contact"
        />
      </Section>
    </>
  );
}
