'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { CTA } from '@/components/shared/cta';
import { PageHero } from '@/components/shared/page-hero';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Heart, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Gender = 'male' | 'female';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  bg: string;
  recommendations: string[];
}

function calculateBMI(weight: number, heightCm: number, age: number, gender: Gender): BMIResult | null {
  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  let category: string;
  let color: string;
  let bg: string;
  let recommendations: string[];

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-blue-600';
    bg = 'bg-blue-50';
    recommendations = [
      'Increase your calorie intake with nutrient-dense foods like nuts, dairy, whole grains, and lean protein.',
      'Add 3–4 strength training sessions per week to build healthy muscle mass.',
      'Consider booking a nutrition consultation to build a structured weight-gain plan.',
    ];
  } else if (bmi < 25) {
    category = 'Healthy Weight';
    color = 'text-green-600';
    bg = 'bg-green-50';
    recommendations = [
      'Excellent — you are in a healthy weight range. Maintain your current routine.',
      'Aim for 150 minutes of moderate activity or 75 minutes of vigorous activity per week.',
      'Continue strength training 2–3 times per week to preserve muscle and bone density.',
    ];
  } else if (bmi < 30) {
    category = 'Overweight';
    color = 'text-orange-600';
    bg = 'bg-orange-50';
    recommendations = [
      'Create a modest calorie deficit of 300–500 calories per day for sustainable fat loss.',
      'Prioritise 4–5 sessions of mixed cardio and strength training per week.',
      'Focus on protein intake (1.6–2g per kg body weight) to preserve muscle during weight loss.',
    ];
  } else {
    category = 'Obese';
    color = 'text-red-600';
    bg = 'bg-red-50';
    recommendations = [
      'Start with low-impact activity like walking, swimming, or cycling for 30 minutes daily.',
      'Book a consultation with our trainers to build a safe, structured exercise plan.',
      'Work with a nutritionist to develop a calorie-controlled, whole-food meal plan.',
    ];
  }

  // Age & gender context
  if (age > 50) {
    recommendations.push('As we age, muscle preservation becomes critical — include resistance training even if your primary goal is weight loss.');
  }
  if (gender === 'female') {
    recommendations.push('Women naturally carry more essential body fat; focus on body composition rather than BMI alone.');
  }

  return { bmi: Math.round(bmi * 10) / 10, category, color, bg, recommendations };
}

export default function BMICalculatorPage() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<Gender>('male');
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(
    () => (calculated ? calculateBMI(weight, height, age, gender) : null),
    [calculated, weight, height, age, gender]
  );

  const handleCalculate = () => setCalculated(true);

  return (
    <>
      <PageHero
        eyebrow="BMI Calculator"
        title="Know your numbers."
        highlight="Own your health."
        description="Body Mass Index is a quick screening tool that helps you understand whether your weight is in a healthy range for your height. Calculate yours in seconds."
        image="https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <Section className="!pt-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Calculator form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-black/[0.06] bg-white p-7 md:p-8 shadow-premium"
          >
            <h3 className="font-display text-2xl font-bold mb-6">Enter your details</h3>

            {/* Gender */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-black/70 mb-2 block">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={cn(
                      'rounded-2xl border py-3 text-sm font-semibold capitalize transition-all',
                      gender === g
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-black/10 text-black/60 hover:border-black/20'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-black/70">Age</label>
                <span className="text-sm font-bold text-black">{age} years</span>
              </div>
              <input
                type="range"
                min={14}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-orange-500"
                aria-label="Age in years"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>14</span>
                <span>90</span>
              </div>
            </div>

            {/* Height */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-black/70">Height</label>
                <span className="text-sm font-bold text-black">{height} cm</span>
              </div>
              <input
                type="range"
                min={120}
                max={220}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-orange-500"
                aria-label="Height in centimeters"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>120 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            {/* Weight */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-black/70">Weight</label>
                <span className="text-sm font-bold text-black">{weight} kg</span>
              </div>
              <input
                type="range"
                min={30}
                max={200}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-orange-500"
                aria-label="Weight in kilograms"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>30 kg</span>
                <span>200 kg</span>
              </div>
            </div>

            <Button variant="accent" size="lg" className="w-full" onClick={handleCalculate}>
              <Activity className="mr-2 h-5 w-5" />
              Calculate BMI
            </Button>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            {result ? (
              <div className="rounded-3xl border border-black/[0.06] bg-white p-7 md:p-8 shadow-premium overflow-hidden">
                <div className={cn('rounded-2xl p-6 mb-6', result.bg)}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-2">Your BMI</p>
                  <p className="font-display text-6xl font-bold text-black">{result.bmi}</p>
                  <p className={cn('text-lg font-semibold mt-2', result.color)}>{result.category}</p>
                </div>

                {/* Scale bar */}
                <div className="mb-6">
                  <div className="relative h-3 rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-blue-200" />
                    <div className="flex-1 bg-green-200" />
                    <div className="flex-1 bg-orange-200" />
                    <div className="flex-1 bg-red-200" />
                  </div>
                  <div className="relative mt-1">
                    <div
                      className="absolute -top-7 w-1 h-10 bg-black rounded-full -translate-x-1/2 transition-all duration-700"
                      style={{ left: `${Math.min(Math.max((result.bmi / 40) * 100, 2), 98)}%` }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-accent" />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                      <span>Under</span>
                      <span>Healthy</span>
                      <span>Over</span>
                      <span>Obese</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Recommendations
                  </p>
                  <ul className="space-y-3">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-black/75 leading-relaxed">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent mt-0.5">
                          <Heart className="h-3 w-3" />
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground bg-black/[0.02] rounded-2xl p-4">
                  <AlertCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  BMI is a screening tool and does not account for muscle mass, bone density, or body composition. Consult a trainer for a complete assessment.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-black/15 bg-secondary/30 p-10 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/10 text-accent mb-5">
                  <Activity className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Your result will appear here</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter your height, weight, age, and gender, then tap Calculate to see your BMI and personalised recommendations.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeader
          eyebrow="Understanding BMI"
          title="What your BMI means"
          description="Body Mass Index estimates body fat based on height and weight. It’s a useful starting point — but not the whole story."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { range: 'Below 18.5', label: 'Underweight', color: 'bg-blue-100 text-blue-700' },
            { range: '18.5 – 24.9', label: 'Healthy Weight', color: 'bg-green-100 text-green-700' },
            { range: '25.0 – 29.9', label: 'Overweight', color: 'bg-orange-100 text-orange-700' },
            { range: '30.0 and above', label: 'Obese', color: 'bg-red-100 text-red-700' },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium text-center"
            >
              <span className={cn('inline-block rounded-full px-4 py-1 text-xs font-semibold mb-3', c.color)}>
                {c.range}
              </span>
              <p className="font-display text-lg font-semibold">{c.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <CTA
          title="Want a full body composition analysis?"
          description="BMI is just the start. Book a free InBody scan and consultation at Limbodi Fitness Club for a complete picture of your health."
          primaryLabel="Book Free Assessment"
          primaryHref="/contact"
        />
      </Section>
    </>
  );
}
