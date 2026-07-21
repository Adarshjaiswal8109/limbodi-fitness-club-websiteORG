'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { CTA } from '@/components/shared/cta';
import { PageHero } from '@/components/shared/page-hero';
import { OptimizedImage } from '@/components/ui/optimized-image';
import {
  Dumbbell, Waves, Bike, Flame, Flower2, Wind,
  ShieldCheck, ShowerHead, Car, ConciergeBell, ShoppingBag,
  Sofa, Droplets, Sparkles,
} from 'lucide-react';

const facilities = [
  { icon: Dumbbell, title: 'Imported Machines', description: 'Hammer Strength, Technogym, and Rogue equipment imported directly from the US and Italy.', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true },
  { icon: Dumbbell, title: 'Free Weight Area', description: 'Calibrated Olympic plates, dumbbells up to 50kg, and competition-grade power racks.', image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true },
  { icon: Sparkles, title: 'Functional Training Zone', description: 'Kettlebells, sled tracks, battle ropes, and open turf for CrossFit-style WODs.', image: 'https://images.pexels.com/photos/4664726/pexels-photo-4664726.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true },
  { icon: Bike, title: 'Cardio Zone', description: 'Premium treadmills, assault bikes, rowers, and stair climbers with personal entertainment screens.', image: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true },
  { icon: Flame, title: 'CrossFit Area', description: 'Dedicated rig space with pull-up bars, boxes, and bumper plates for high-intensity functional workouts.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true },
  { icon: Flower2, title: 'Yoga Studio', description: 'A soundproof, climate-controlled studio with premium mats, blocks, and ambient lighting.', image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true },
  { icon: Wind, title: 'Steam Room', description: 'Therapeutic steam sessions to relax muscles, open pores, and accelerate post-workout recovery.', image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
  { icon: ShieldCheck, title: 'Locker Rooms', description: 'Spacious, secure lockers with RFID access and daily-use options for all members.', image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
  { icon: ShowerHead, title: 'Showers', description: 'Hot showers with premium toiletries, fresh towels, and changing areas.', image: 'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
  { icon: Car, title: 'Parking', description: 'Ample secure parking for over 80 vehicles, with dedicated two-wheeler bays.', image: 'https://images.pexels.com/photos/3758915/pexels-photo-3758915.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
  { icon: ConciergeBell, title: 'Reception', description: 'Friendly front desk staff available during all open hours to assist with anything you need.', image: 'https://images.pexels.com/photos/3758056/pexels-photo-3758056.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
  { icon: ShoppingBag, title: 'Supplement Store', description: 'Curated protein, pre-workout, and recovery supplements from trusted brands at member prices.', image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
  { icon: Sofa, title: 'Waiting Lounge', description: 'Comfortable seating area with charging points and complimentary tea and coffee.', image: 'https://images.pexels.com/photos/3998020/pexels-photo-3998020.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
  { icon: Droplets, title: 'Drinking Water', description: 'Purified chilled water stations available across the training floor and lounge areas.', image: 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false },
];

export default function FacilitiesPage() {
  const featured = facilities.filter((f) => f.featured);
  const standard = facilities.filter((f) => !f.featured);

  return (
    <>
      <PageHero
        eyebrow="Facilities"
        title="World-class, every"
        highlight="square foot."
        description="14 purpose-built zones spread across 12,000 square feet — from imported strength machines to a therapeutic steam room. Every detail designed for performance and comfort."
        image="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Featured facilities */}
      <Section className="!pt-8">
        <SectionHeader
          eyebrow="Training Zones"
          title="Where champions are built"
          description="Our six core training zones cover every discipline — from heavy lifting to mindful recovery."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featured.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-premium border border-black/[0.06] hover:shadow-glow transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <OptimizedImage
                  src={f.image}
                  alt={f.title}
                  fill
                  wrapperClassName="h-56"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-2xl glass text-white">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="absolute bottom-4 left-5 font-display text-xl font-bold text-white">
                  {f.title}
                </h3>
              </div>
              <p className="p-5 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* Standard amenities */}
      <Section className="bg-secondary/40">
        <SectionHeader
          eyebrow="Amenities"
          title="Everything you need beyond the workout"
          description="Premium amenities that make every visit comfortable, convenient, and complete."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {standard.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium hover:shadow-glow hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-5 transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTA
          title="See it for yourself"
          description="Book a free tour of Limbodi Fitness Club and experience every zone in person."
          primaryLabel="Book a Tour"
          primaryHref="/contact"
          secondaryLabel="View Membership"
          secondaryHref="/membership"
        />
      </Section>
    </>
  );
}
