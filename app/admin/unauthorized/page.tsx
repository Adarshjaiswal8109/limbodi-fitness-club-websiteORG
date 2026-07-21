'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 md:px-8 overflow-hidden bg-black">
      <div className="pointer-events-none absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[140px] animate-float-slow" />
      <div className="pointer-events-none absolute bottom-1/4 -left-40 h-96 w-96 rounded-full bg-orange-300/10 blur-[120px] animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md text-center"
      >
        <div className="glass-dark rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 mb-6"
          >
            <ShieldAlert className="h-10 w-10 text-red-400" strokeWidth={2} />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-white/50 mb-8 max-w-sm mx-auto">
            You don&apos;t have permission to access this page. Please sign in with an authorized admin account to continue.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/admin/login">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                <Lock className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Website
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
