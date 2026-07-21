import { Hero } from '@/components/sections/hero';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { FeaturedServices } from '@/components/sections/featured-services';
import { FeaturedClasses } from '@/components/sections/featured-classes';
import { TrainerPreview } from '@/components/sections/trainer-preview';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { GallerySection } from '@/components/sections/gallery-section';
import { CTASection } from '@/components/sections/cta-section';
import { ContactPreview } from '@/components/sections/contact-preview';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <FeaturedServices />
      <FeaturedClasses />
      <TrainerPreview />
      <TestimonialsSection />
      <GallerySection />
      <CTASection />
      <ContactPreview />
    </>
  );
}
