'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryLightbox, type GalleryImage } from '@/components/shared/gallery-lightbox';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

const defaultCategories = ['All', 'Strength', 'Cardio', 'Classes', 'Recovery', 'Studio'];

const fallbackImages: GalleryImage[] = [
  { src: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800', label: 'Strength Zone', category: 'Strength', span: 'md:col-span-2 md:row-span-2' },
  { src: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Cardio Deck', category: 'Cardio' },
  { src: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Group Classes', category: 'Classes' },
  { src: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Free Weights', category: 'Strength' },
  { src: 'https://images.pexels.com/photos/4664726/pexels-photo-4664726.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Recovery Lounge', category: 'Recovery' },
  { src: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Yoga Studio', category: 'Studio' },
  { src: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Olympic Platform', category: 'Strength' },
  { src: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Locker Rooms', category: 'Recovery' },
];

export function GalleryPreview() {
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);
  const [categories, setCategories] = useState<string[]>(defaultCategories);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });
        if (data && data.length > 0) {
          setImages(data.map((g: any) => ({ src: g.image, label: g.label, category: g.category || 'All', span: g.span || '' })));
          const cats = ['All', ...Array.from(new Set(data.map((g: any) => g.category).filter(Boolean)))];
          if (cats.length > 1) setCategories(cats);
        }
      } catch { /* keep fallback */ }
    })();
  }, []);

  return (
    <div>
      <GalleryLightbox images={images} categories={categories} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mt-8"
      >
        <Button variant="outline" size="lg" asChild>
          <Link href="/facilities">
            View Full Gallery
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
