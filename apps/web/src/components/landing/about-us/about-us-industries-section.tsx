'use client';

import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  CreditCard,
  Home,
  Car,
  Plane,
  GraduationCap,
  Wrench,
  Cloud,
  Truck,
  Users,
  Cog
} from 'lucide-react';
import type { ElementType } from 'react';

// Industry icons mapping
const industryIcons: Record<string, ElementType> = {
  'Retail & E-commerce': ShoppingBag,
  Healthcare: Heart,
  'Financial Services': CreditCard,
  'Real Estate': Home,
  Automotive: Car,
  'Travel & Hospitality': Plane,
  Education: GraduationCap,
  'Home Services': Wrench,
  SaaS: Cloud,
  Logistics: Truck,
  'HR & Recruiting': Users,
  Manufacturing: Cog
};

export function AboutUsIndustriesSection() {
  return (
    <section className="relative py-20 bg-background">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
              Empowering Businesses Across Industries
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              TinkerVoice&apos;s AI-powered voice automation solutions simplify operations and enhance customer
              experience across various sectors.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </motion.div>
        <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-4">
          {Object.entries(industryIcons).map(([industry, Icon], index) => (
            <motion.div
              key={industry}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.07 }}
              viewport={{ once: true }}
              className="group relative flex flex-col items-center rounded-xl border border-border/70 bg-background/80 dark:bg-background/20 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(var(--primary-rgb),0.35)] backdrop-blur-xl [box-shadow:0_-18px_70px_-24px_rgba(var(--primary-rgb),0.18)_inset] dark:[box-shadow:0_-18px_70px_-24px_rgba(var(--primary-rgb),0.14)_inset]"
            >
              {/* Icon */}
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/35 group-hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)]">
                <Icon className="h-6 w-6 text-primary" />
              </div>

              <span className="text-sm font-medium text-foreground text-center transition-colors duration-300 group-hover:text-primary">
                {industry}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
