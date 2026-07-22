'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  wrapperClassName?: string;
}

export function OptimizedImage({
  alt,
  className,
  wrapperClassName,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-black/[0.03]',
        wrapperClassName
      )}
    >
      <Image
        alt={alt}
        className={cn(
          'transition-opacity duration-700',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        sizes={
          sizes ||
          '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        }
        onLoad={() => setLoaded(true)}
        {...props}
      />
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-black/[0.04]" />
      )}
    </div>
  );
}
