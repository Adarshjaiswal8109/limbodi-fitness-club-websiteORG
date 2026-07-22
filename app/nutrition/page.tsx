'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { CTA } from '@/components/shared/cta';
import { PageHero } from '@/components/shared/page-hero';
import { OptimizedImage } from '@/components/ui/optimized-image';
import {
  Flame, Dumbbell, Apple, Beef, Pill, Droplet, Zap, ChefHat,
} from 'lucide-react';

const categories = [
  {
    icon: Flame,
    title: 'Weight Loss',
    description: 'Sustainable fat loss starts with a modest calorie deficit, high protein intake, and consistent strength training to preserve muscle. Aim for 0.5–1% body weight loss per week.',
    tips: [
      'Create a 300–500 calorie daily deficit',
      'Eat 1.6–2.2g protein per kg body weight',
      'Fill half your plate with vegetables',
      'Track intake for the first 2 weeks',
    ],
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Dumbbell,
    title: 'Muscle Gain',
    description: 'Building muscle requires a calorie surplus, progressive overload, and adequate protein. Aim for 250–500 extra calories above maintenance and 1.6–2.2g protein per kg.',
    tips: [
      'Eat 250–500 calories above maintenance',
      'Prioritise compound lifts 3–4x per week',
      'Consume protein every 3–4 hours',
      'Sleep 7–9 hours for recovery',
    ],
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Apple,
    title: 'Healthy Eating',
    description: 'A balanced diet is 80% consistency, 20% flexibility. Build meals around whole foods — lean protein, complex carbs, healthy fats, and plenty of vegetables.',
    tips: [
      'Choose whole grains over refined',
      'Include a protein source in every meal',
      'Use healthy fats: olive oil, nuts, ghee',
      'Limit processed sugar and fried food',
    ],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Beef,
    title: 'Protein Guide',
    description: 'Protein is the building block of muscle, the most satiating macronutrient, and critical for recovery. Target 1.6–2.2g per kg of body weight daily.',
    tips: [
      'Chicken breast: 31g protein per 100g',
      'Paneer: 18g protein per 100g',
      'Eggs: 13g protein per 100g',
      'Whey protein: 25g per scoop',
    ],
    image: 'https://images.pexels.com/photos/416458/pexels-photo-416458.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Pill,
    title: 'Supplements',
    description: 'Supplements complement — never replace — a solid diet. Start with the essentials: whey protein, creatine, and vitamin D. Consult a nutritionist before stacking.',
    tips: [
      'Whey protein: convenient post-workout',
      'Creatine monohydrate: 5g daily',
      'Vitamin D3: 1000–2000 IU if deficient',
      'Omega-3: 1–2g EPA+DHA daily',
    ],
    image: 'https://images.pexels.com/photos/3689150/pexels-photo-3689150.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Droplet,
    title: 'Hydration',
    description: 'Even 2% dehydration reduces performance and mental clarity. Aim for 3–4 litres daily, more on training days, and add electrolytes during intense sessions.',
    tips: [
      'Drink 500ml water on waking',
      'Sip 200ml every 15 min during exercise',
      'Add a pinch of salt to post-workout water',
      'Monitor urine colour — pale yellow is ideal',
    ],
    image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Zap,
    title: 'Workout Nutrition',
    description: 'What you eat before and after training directly impacts performance and recovery. Pre-workout: carbs + protein. Post-workout: protein + carbs within 2 hours.',
    tips: [
      'Pre-workout: banana + whey, 60 min before',
      'Intra-workout: sip water with electrolytes',
      'Post-workout: 30g protein + 40g carbs',
      'Avoid heavy fats pre-workout — slow digestion',
    ],
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: ChefHat,
    title: 'Healthy Recipes',
    description: 'Healthy eating should never be boring. These recipes are high in protein, rich in flavour, and simple enough for busy weekdays.',
    tips: [
      'Paneer bhurji with whole-wheat roti',
      'Grilled chicken with quinoa and veggies',
      'Greek yoghurt parfait with berries and nuts',
      'Moong dal chilla with mint chutney',
    ],
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function NutritionPage() {
  return (
    <>
      <PageHero
        eyebrow="Nutrition"
        title="Fuel your body."
        highlight="Transform your results."
        description="You can’t out-train a bad diet. Our nutrition hub covers everything from fat loss to muscle gain, protein targets to hydration — with practical, India-friendly advice."
        image="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      {/* Categories grid */}
      <Section className="!pt-8">
        <SectionHeader
          eyebrow="Nutrition Hub"
          title="Eight pillars of better eating"
          description="Click through each category for actionable tips you can apply today — no fad diets, no extremes, just science-backed guidance."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {categories.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group rounded-3xl bg-white border border-black/[0.06] shadow-premium overflow-hidden hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <OptimizedImage
                  src={c.image}
                  alt={c.title}
                  fill
                  wrapperClassName="h-48"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl glass text-accent">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="absolute bottom-4 left-5 font-display text-xl font-bold text-white">
                  {c.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {c.description}
                </p>
                <ul className="space-y-2">
                  {c.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5 text-sm text-black/75">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-secondary/40">
        <CTA
          title="Get a nutrition plan built for you"
          description="Every membership at Limbodi includes a nutrition consultation. Book yours today and build a meal plan that actually fits your life."
          primaryLabel="Book Consultation"
          primaryHref="/contact"
          secondaryLabel="View Membership"
          secondaryHref="/membership"
        />
      </Section>
    </>
  );
}
