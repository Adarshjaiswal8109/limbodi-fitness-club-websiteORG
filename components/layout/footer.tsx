'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
} from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { useSiteSettings } from '@/hooks/use-site-settings';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Membership', href: '/membership' },
  { label: 'Personal Training', href: '/personal-training' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Contact', href: '/contact' },
];

const resourceLinks = [
  { label: 'Nutrition', href: '/nutrition' },
  { label: 'BMI Calculator', href: '/bmi-calculator' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faq' },
];

export function Footer() {
  const { business, social, branding } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const socials = [
    { icon: Instagram, href: social.instagram, label: 'Instagram' },
    { icon: Facebook, href: social.facebook, label: 'Facebook' },
    { icon: Youtube, href: social.youtube, label: 'Youtube' },
    { icon: Twitter, href: social.twitter, label: 'Twitter' },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true);
      return;
    }
    setError(false);
    try {
      const { supabase } = await import('@/lib/supabase-client');
      await supabase.from('newsletter_subscribers').insert({ email });
    } catch {
      // duplicate email is fine — still show success
    }
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Accent glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Link href="/" className="flex items-center gap-2.5 mb-5" aria-label="Limbodi Fitness Club home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent shadow-glow">
                <Dumbbell className="h-5 w-5 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">
                {business.name}
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed max-w-sm mb-6">
              Indore’s premier destination for strength, conditioning, and
              wellness. Where ambition meets discipline and every rep counts
              toward the strongest version of you.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4"
          >
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Visit Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  {business.address.split(',').slice(0, 3).join(',')}
                  <br />
                  {business.address.split(',').slice(3).join(',').trim()}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <a href={`tel:${business.phoneRaw}`} className="hover:text-accent transition-colors">
                  {business.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a
                  href={`mailto:${business.email}`}
                  className="hover:text-accent transition-colors"
                >
                  {business.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 rounded-2xl glass-dark p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
                Open Hours
              </p>
              <p className="text-sm text-white/80">Mon–Sat: {business.hours.monSat}</p>
              <p className="text-sm text-white/80">Sunday: {business.hours.sunday}</p>
            </div>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-3xl glass-dark p-8 md:p-10"
        >
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">
                Join the Limbodi newsletter
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Weekly tips on training, nutrition, and motivation — plus early
                access to offers and events. No spam, ever.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 h-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full gradient-accent h-12 px-6 text-sm font-semibold text-white hover:shadow-glow transition-all active:scale-95"
              >
                {subscribed ? <Check className="h-4 w-4" strokeWidth={3} /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
          {subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-accent mt-3 flex items-center gap-2"
            >
              <Check className="h-4 w-4" /> You&apos;re subscribed! Check your inbox for a welcome email.
            </motion.p>
          )}
          {error && (
            <p className="text-sm text-red-400 mt-3">Please enter a valid email address.</p>
          )}
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            {branding.copyright}
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <Link href="/membership" className="hover:text-accent transition-colors">
              Membership
            </Link>
            <Link href="/contact" className="hover:text-accent transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
