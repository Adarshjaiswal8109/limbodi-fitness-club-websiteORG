'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Lock, ArrowRight, AlertCircle, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase-client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { changePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error } = await changePassword(password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 2000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 md:px-8 overflow-hidden bg-black">
      <div className="pointer-events-none absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[140px] animate-float-slow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-dark rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent shadow-glow mb-4">
              <Dumbbell className="h-7 w-7 text-white" strokeWidth={2.5} />
            </span>
            <h1 className="font-display text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-sm text-white/50 mt-1">Enter your new password</p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
                <Check className="h-8 w-8 text-green-400" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">Password Updated</h3>
              <p className="text-sm text-white/50 mb-6">Redirecting to dashboard...</p>
            </motion.div>
          ) : (
            <>
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
                  <label htmlFor="new-password" className="text-sm font-semibold text-white/70 mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      id="new-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 h-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="text-sm font-semibold text-white/70 mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 h-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>

                <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Updating...</>
                  ) : (
                    <>Update Password <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
