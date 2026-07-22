'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Dumbbell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useActiveSection } from '@/hooks/use-active-section';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { useSiteSettings } from '@/hooks/use-site-settings';

interface NavLink {
  label: string;
  href: string;
  sectionId?: string;
}

const mainLinks: NavLink[] = [
  { label: 'Home', href: '/', sectionId: 'hero' },
  { label: 'About', href: '/about' },
  { label: 'Membership', href: '/membership' },
  { label: 'Trainers', href: '/personal-training' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Nutrition', href: '/nutrition' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact', sectionId: 'contact' },
];

const moreLinks: NavLink[] = [
  { label: 'BMI Calculator', href: '/bmi-calculator' },
];

const sectionIds = ['hero', 'contact'];

export function Navbar() {
  const { business, branding } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection(sectionIds);
  const scrollTo = useSmoothScroll();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, link: NavLink) => {
      if (link.sectionId && pathname === '/') {
        e.preventDefault();
        scrollTo(link.sectionId);
        setOpen(false);
      }
    },
    [pathname, scrollTo]
  );

  const isActive = (link: NavLink) => {
    if (link.href === '/') return pathname === '/' && (activeSection === 'hero' || activeSection === '');
    if (link.sectionId) return pathname === '/' && activeSection === link.sectionId;
    return pathname === link.href;
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled ? 'py-3' : 'py-5'
      )}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <nav
          aria-label="Main navigation"
          className={cn(
            'flex items-center justify-between rounded-full transition-all duration-500 px-5 md:px-7 h-16',
            scrolled
              ? 'glass shadow-premium'
              : 'bg-transparent border border-transparent'
          )}
        >
          {/* Logo + title */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Limbodi Fitness Club home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-accent shadow-glow transition-transform group-hover:scale-110">
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt={business.name} className="h-7 w-7 object-contain" />
              ) : (
                <Dumbbell className="h-5 w-5 text-white" strokeWidth={2.5} />
              )}
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-tight">
                {business.name}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                {business.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-0.5">
            {mainLinks.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium rounded-full transition-colors duration-300 group',
                    active
                      ? 'text-accent'
                      : 'text-black/70 hover:text-black'
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-accent/10 -z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-accent transition-all duration-300 group-hover:w-5" />
                </Link>
              );
            })}
            {/* More dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full text-black/70 hover:text-black transition-colors"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen(!moreOpen)}
              >
                More
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', moreOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl p-2 shadow-premium"
                  >
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                          pathname === link.href
                            ? 'bg-accent/10 text-accent'
                            : 'hover:bg-accent/10 hover:text-accent'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="accent"
              size="sm"
              className="hidden sm:inline-flex"
              asChild
            >
              <Link href="/membership">Join Now</Link>
            </Button>
            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden fixed inset-0 top-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden mx-auto max-w-7xl px-5 md:px-8 mt-3 relative z-50"
            >
              <div className="glass rounded-3xl p-5 shadow-premium max-h-[80vh] overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {[...mainLinks, ...moreLinks].map((link) => {
                    const active = isActive(link);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'px-4 py-3 rounded-2xl text-base font-medium transition-colors',
                          active
                            ? 'bg-accent/10 text-accent'
                            : 'hover:bg-accent/10 hover:text-accent'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <Button variant="accent" size="lg" className="mt-3" asChild>
                    <Link href="/membership">Join Now</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
