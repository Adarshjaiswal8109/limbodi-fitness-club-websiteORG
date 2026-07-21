'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
        >
          {/* Expanded action buttons */}
          <AnimatePresence>
            {expanded && (
              <>
                <motion.a
                  href={`https://wa.me/${siteConfig.business.phoneRaw.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 hover:scale-110 transition-transform"
                >
                  <MessageCircle className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href={`tel:${siteConfig.business.phoneRaw}`}
                  aria-label="Call us"
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 10 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white shadow-glow hover:scale-110 transition-transform"
                >
                  <Phone className="h-5 w-5" />
                </motion.a>
              </>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Close quick actions' : 'Open quick actions'}
            aria-expanded={expanded}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl"
          >
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
