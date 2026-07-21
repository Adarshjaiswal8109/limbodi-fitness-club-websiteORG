'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, Check, AlertCircle, User, Phone, Mail, Calendar, Target, Clock, MessageSquare } from 'lucide-react';

const plans = [
  'Monthly',
  'Quarterly',
  'Half-Yearly',
  'Annual',
  'Student',
  'Couple',
  'Corporate',
  'Personal Training',
];

const goals = [
  'Weight Loss',
  'Muscle Gain',
  'General Fitness',
  'Strength Training',
  'Endurance',
  'Flexibility & Yoga',
];

const timeSlots = [
  'Early Morning (5–8 AM)',
  'Morning (8–11 AM)',
  'Afternoon (11 AM–4 PM)',
  'Evening (4–7 PM)',
  'Night (7–11 PM)',
];

const genders = ['Male', 'Female', 'Other'];

export function MembershipEnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    fitness_goal: '',
    preferred_plan: '',
    preferred_time: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validate = (): string | null => {
    if (!form.full_name.trim()) return 'Please enter your full name';
    if (!form.phone.trim() || form.phone.length < 10) return 'Please enter a valid phone number';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email';
    if (!form.fitness_goal) return 'Please select a fitness goal';
    if (!form.preferred_plan) return 'Please select a preferred plan';
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
      const { error } = await supabase.from('membership_enquiries').insert({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || null,
        fitness_goal: form.fitness_goal || null,
        preferred_plan: form.preferred_plan || null,
        preferred_time: form.preferred_time || null,
        message: form.message || null,
      });

      if (error) throw error;

      setStatus('success');
      setForm({ full_name: '', phone: '', email: '', age: '', gender: '', fitness_goal: '', preferred_plan: '', preferred_time: '', message: '' });
      setTimeout(() => setStatus('idle'), 8000);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or call us directly.');
    }
  };

  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white p-7 md:p-8 shadow-premium">
      <h3 className="font-display text-2xl font-bold mb-2">Membership Enquiry</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Fill in the form below and our team will reach out within a few hours.
      </p>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 p-4 mb-6"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            <div>
              <p className="text-sm font-semibold text-green-800">Enquiry submitted successfully!</p>
              <p className="text-xs text-green-700 mt-0.5">We&apos;ll contact you within a few hours to discuss your membership.</p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 mb-6"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shrink-0">
              <AlertCircle className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-red-800">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label htmlFor="me-name" className="text-sm font-semibold text-black/70 mb-1.5 block">Full Name *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input id="me-name" type="text" required value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} placeholder="Your full name"
                className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label htmlFor="me-phone" className="text-sm font-semibold text-black/70 mb-1.5 block">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input id="me-phone" type="tel" required value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98XXX XXXXX"
                className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label htmlFor="me-email" className="text-sm font-semibold text-black/70 mb-1.5 block">Email *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input id="me-email" type="email" required value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@example.com"
                className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
            </div>
          </div>
          {/* Age */}
          <div>
            <label htmlFor="me-age" className="text-sm font-semibold text-black/70 mb-1.5 block">Age</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input id="me-age" type="number" min="14" max="100" value={form.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="25"
                className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
            </div>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-semibold text-black/70 mb-1.5 block">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {genders.map((g) => (
              <button key={g} type="button" onClick={() => handleChange('gender', g)}
                className={`rounded-2xl border py-3 text-sm font-semibold transition-all ${form.gender === g ? 'border-accent bg-accent/10 text-accent' : 'border-black/10 text-black/60 hover:border-black/20'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Fitness Goal */}
          <div>
            <label htmlFor="me-goal" className="text-sm font-semibold text-black/70 mb-1.5 block">
              <span className="flex items-center gap-1.5"><Target className="h-4 w-4 text-accent" />Fitness Goal *</span>
            </label>
            <select id="me-goal" required value={form.fitness_goal} onChange={(e) => handleChange('fitness_goal', e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
              <option value="">Select your goal</option>
              {goals.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {/* Preferred Plan */}
          <div>
            <label htmlFor="me-plan" className="text-sm font-semibold text-black/70 mb-1.5 block">Preferred Plan *</label>
            <select id="me-plan" required value={form.preferred_plan} onChange={(e) => handleChange('preferred_plan', e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
              <option value="">Select a plan</option>
              {plans.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Preferred Time */}
        <div>
          <label htmlFor="me-time" className="text-sm font-semibold text-black/70 mb-1.5 block">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />Preferred Time</span>
          </label>
          <select id="me-time" value={form.preferred_time} onChange={(e) => handleChange('preferred_time', e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 h-12 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
            <option value="">Select a time slot</option>
            {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="me-message" className="text-sm font-semibold text-black/70 mb-1.5 block">
            <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-accent" />Message</span>
          </label>
          <textarea id="me-message" rows={3} value={form.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Anything else we should know?"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none" />
        </div>

        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Submitting...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" />Submit Enquiry</>
          )}
        </Button>
      </form>
    </div>
  );
}
