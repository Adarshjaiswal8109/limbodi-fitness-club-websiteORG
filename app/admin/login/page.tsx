'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Mail, Lock, ArrowRight, AlertCircle, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setSubmitting(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 md:px-8 overflow-hidden bg-black">
      <div className="pointer-events-none absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[140px] animate-float-slow" />
      <div className="pointer-events-none absolute bottom-1/4 -left-40 h-96 w-96 rounded-full bg-orange-300/10 blur-[120px] animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-dark rounded-[2rem] p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent shadow-glow mb-4">
              <Dumbbell className="h-7 w-7 text-white" strokeWidth={2.5} />
            </span>
            <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-sm text-white/50 mt-1">Limbodi Fitness Club Dashboard</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 mb-5"
              >
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="text-sm font-semibold text-white/70 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@limbodifitness.in"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 h-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="text-sm font-semibold text-white/70 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 h-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer">
                <input type="checkbox" className="accent-orange-500" />
                Remember me
              </label>
              <Link href="/admin/forgot-password" className="text-accent hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>
          </div>


        </div>
      </motion.div>
    </section>
  );
}
