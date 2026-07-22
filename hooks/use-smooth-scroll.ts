'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Returns a handler that performs smooth scrolling to a section,
 * navigating to the home page first if needed.
 */
export function useSmoothScroll() {
  const pathname = usePathname();

  const scrollTo = useCallback(
    (sectionId: string) => {
      const doScroll = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      if (pathname !== '/') {
        // Navigate home first, then scroll after route renders
        window.location.href = `/#${sectionId}`;
      } else {
        doScroll();
      }
    },
    [pathname]
  );

  return scrollTo;
}
