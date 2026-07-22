'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  src: string;
  label: string;
  category: string;
  span?: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  categories: string[];
}

export function GalleryLightbox({ images, categories }: GalleryLightboxProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
  }, [filtered.length]);
  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
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

      {/* Masonry grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((img, i) => (
            <motion.button
              key={img.src}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setLightboxIndex(i)}
              className={cn(
                'group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer',
                img.span || ''
              )}
            >
              <OptimizedImage
                src={img.src}
                alt={img.label}
                fill
                wrapperClassName="absolute inset-0"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              {/* Zoom icon */}
              <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full glass text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <ZoomIn className="h-4 w-4" />
              </div>
              {/* Label */}
              <div className="absolute bottom-0 left-0 p-4 md:p-5">
                <p className="font-display text-sm md:text-base font-semibold text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {img.label}
                </p>
                <p className="text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.category}
                </p>
              </div>
              <div className="absolute inset-0 ring-2 ring-inset ring-accent/0 group-hover:ring-accent/40 rounded-2xl md:rounded-3xl transition-all duration-300" />
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
              className="absolute left-4 md:left-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
              className="absolute right-4 md:right-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-[70vh] rounded-2xl overflow-hidden"
            >
              <OptimizedImage
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].label}
                fill
                wrapperClassName="absolute inset-0"
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="font-display text-xl font-bold text-white">
                  {filtered[lightboxIndex].label}
                </p>
                <p className="text-sm text-white/60 mt-1">
                  {filtered[lightboxIndex].category} · {lightboxIndex + 1} / {filtered.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
