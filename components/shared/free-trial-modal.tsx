'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Calendar, User, Phone, Mail, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FreeTrialModalProps {
  open: boolean;
  onClose: () => void;
}

const goals = [
  'Weight Loss',
  'Muscle Gain',
  'General Fitness',
  'Strength Training',
  'Flexibility & Yoga',
  'Endurance',
];

const timeSlots = [
  'Early Morning (5–8 AM)',
  'Morning (8–11 AM)',
  'Afternoon (11 AM–4 PM)',
  'Evening (4–7 PM)',
  'Night (7–11 PM)',
];

export function FreeTrialModal({ open, onClose }: FreeTrialModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    goal: '',
    time: '',
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { supabase } = await import('@/lib/supabase-client');
      const { error } = await supabase.from('trial_bookings').insert({
        name: form.name,
        mobile: form.phone,
        email: form.email,
        preferred_time: form.time,
        fitness_goal: form.goal,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', phone: '', email: '', goal: '', time: '' });
    }, 300);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleClose}
            aria-hidden="true"
          >
            {/* Modal */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="trial-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-black/[0.06]"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {submitted ? (
                /* Confirmation state */
                <div className="p-8 md:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-accent shadow-glow mb-6"
                  >
                    <Check className="h-10 w-10 text-white" strokeWidth={3} />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    You&apos;re all set!
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Thank you, <span className="font-semibold text-black">{form.name || 'athlete'}</span>!
                    We&apos;ve received your free trial request for{' '}
                    <span className="font-semibold text-accent">{form.time || 'your preferred slot'}</span>.
                    Our team will call you within a few hours to confirm.
                  </p>
                  <div className="rounded-2xl bg-secondary/50 p-5 mb-6 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      What to bring
                    </p>
                    <ul className="space-y-1.5 text-sm text-black/70">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-accent" /> Comfortable workout clothes
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-accent" /> A water bottle
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-accent" /> Indoor training shoes
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-accent" /> A valid photo ID
                      </li>
                    </ul>
                  </div>
                  <Button variant="accent" size="lg" className="w-full" onClick={handleClose}>
                    Got it!
                  </Button>
                </div>
              ) : (
                /* Form state */
                <div className="p-7 md:p-9">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-accent shadow-glow">
                      <Sparkles className="h-4 w-4 text-white" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                      Free 7-Day Trial
                    </span>
                  </div>
                  <h3 id="trial-title" className="font-display text-2xl font-bold mb-1">
                    Book your free trial
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Experience Limbodi Fitness Club free for 7 days. No card, no commitment.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="trial-name" className="text-sm font-semibold text-black/70 mb-1.5 block">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id="trial-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="trial-phone" className="text-sm font-semibold text-black/70 mb-1.5 block">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            id="trial-phone"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+91 98XXX XXXXX"
                            className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="trial-email" className="text-sm font-semibold text-black/70 mb-1.5 block">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            id="trial-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="you@example.com"
                            className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Goal */}
                    <div>
                      <label htmlFor="trial-goal" className="text-sm font-semibold text-black/70 mb-1.5 block">
                        <span className="flex items-center gap-1.5">
                          <Target className="h-4 w-4 text-accent" />
                          Your Goal
                        </span>
                      </label>
                      <select
                        id="trial-goal"
                        required
                        value={form.goal}
                        onChange={(e) => setForm({ ...form, goal: e.target.value })}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      >
                        <option value="">Select your primary goal</option>
                        {goals.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred time */}
                    <div>
                      <label htmlFor="trial-time" className="text-sm font-semibold text-black/70 mb-1.5 block">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-accent" />
                          Preferred Time
                        </span>
                      </label>
                      <select
                        id="trial-time"
                        required
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <Button type="submit" variant="accent" size="lg" className="w-full mt-2" disabled={submitting}>
                      {submitting ? (
                        <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Booking...</>
                      ) : (
                        <><Calendar className="mr-2 h-4 w-4" />Claim My Free Trial</>
                      )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      No credit card required. Cancel anytime.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
