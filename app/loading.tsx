'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-5 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero skeleton */}
        <div className="max-w-3xl">
          <div className="h-8 w-48 shimmer rounded-full mb-6" />
          <div className="h-16 md:h-20 w-full shimmer rounded-2xl mb-4" />
          <div className="h-16 md:h-20 w-2/3 shimmer rounded-2xl mb-8" />
          <div className="h-6 w-full shimmer rounded-lg mb-3" />
          <div className="h-6 w-5/6 shimmer rounded-lg mb-10" />
          <div className="flex gap-4">
            <div className="h-14 w-40 shimmer rounded-full" />
            <div className="h-14 w-32 shimmer rounded-full" />
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium">
              <div className="h-12 w-12 shimmer rounded-2xl mb-5" />
              <div className="h-5 w-3/4 shimmer rounded-lg mb-3" />
              <div className="h-4 w-full shimmer rounded-lg mb-2" />
              <div className="h-4 w-5/6 shimmer rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
