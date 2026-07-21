'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { PageHero } from '@/components/shared/page-hero';
import { Button } from '@/components/ui/button';
import {
  MapPin, Phone, Mail, Clock, Send, MessageCircle,
  Instagram, Facebook, Youtube, Twitter, Check, AlertCircle,
} from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

const contactInfo = [
  { icon: MapPin, label: 'Visit Us', value: siteConfig.business.address },
  { icon: Phone, label: 'Call Us', value: siteConfig.business.phone, href: `tel:${siteConfig.business.phoneRaw}` },
  { icon: Mail, label: 'Email Us', value: siteConfig.business.email, href: `mailto:${siteConfig.business.email}` },
  { icon: Clock, label: 'Open Hours', value: `Mon–Sat: ${siteConfig.business.hours.monSat} · Sun: ${siteConfig.business.hours.sunday}` },
];

const socials = [
  { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram', color: 'hover:bg-pink-500 hover:border-pink-500' },
  { icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook', color: 'hover:bg-blue-600 hover:border-blue-600' },
  { icon: Youtube, href: siteConfig.social.youtube, label: 'YouTube', color: 'hover:bg-red-600 hover:border-red-600' },
  { icon: Twitter, href: siteConfig.social.twitter, label: 'Twitter', color: 'hover:bg-sky-500 hover:border-sky-500' },
];

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email';
    if (!form.message.trim()) return 'Please enter a message';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setStatus('error');
      setErrorMsg(error);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const { supabase } = await import('@/lib/supabase-client');
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      });
      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or call us directly.');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk."
        highlight="We’re here for you."
        description="Questions about membership, training, or just want a tour? Reach out — we respond within a few hours during open times, and we’d love to meet you in person."
        image="https://images.pexels.com/photos/3758056/pexels-photo-3758056.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Contact info cards */}
      <Section className="!pt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {contactInfo.map((item, i) => {
            const content = (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-black leading-relaxed">
                  {item.value}
                </p>
              </>
            );
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="block rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium hover:shadow-glow transition-all duration-300">
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Form + Map */}
      <Section className="bg-secondary/40">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-black/[0.06] bg-white p-7 md:p-8 shadow-premium"
          >
            <h3 className="font-display text-2xl font-bold mb-2">Send us a message</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in the form and our team will get back to you within a few hours.
            </p>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 p-4 mb-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-green-800">Message sent successfully!</p>
                  <p className="text-xs text-green-700 mt-0.5">Thank you for reaching out. We&apos;ll get back to you within a few hours.</p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 mb-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
                  <AlertCircle className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium text-red-800">{errorMsg}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-black/70 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-semibold text-black/70 mb-1.5 block">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-black/70 mb-1.5 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="subject" className="text-sm font-semibold text-black/70 mb-1.5 block">
                  Subject
                </label>
                <select
                  id="subject"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option value="">Select a topic</option>
                  <option value="membership">Membership Enquiry</option>
                  <option value="trial">Free Trial</option>
                  <option value="personal-training">Personal Training</option>
                  <option value="corporate">Corporate Membership</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-semibold text-black/70 mb-1.5 block">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                />
              </div>
              <Button type="submit" variant="accent" size="lg" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Sending...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" />Send Message</>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Map + Socials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Map */}
            <div className="relative rounded-3xl overflow-hidden shadow-premium border border-black/[0.06] flex-1 min-h-[300px]">
              <iframe
                title="Limbodi Fitness Club location on Google Maps"
                src={siteConfig.business.mapsEmbed}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0, minHeight: '300px' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${siteConfig.business.phoneRaw.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-3xl border border-green-200 bg-green-50 p-6 shadow-premium hover:shadow-glow transition-all duration-300 group"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white group-hover:scale-110 transition-transform">
                <MessageCircle className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-green-900">
                  Chat on WhatsApp
                </h3>
                <p className="text-sm text-green-700">
                  Fastest way to reach us — typically replies in minutes.
                </p>
              </div>
              <Send className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Socials */}
            <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Follow Us
              </p>
              <div className="grid grid-cols-4 gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`flex h-14 items-center justify-center rounded-2xl border border-black/10 bg-white text-black/60 hover:text-white transition-all duration-300 ${s.color}`}
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
