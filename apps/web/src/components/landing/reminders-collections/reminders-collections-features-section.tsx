"use client";

import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  CreditCard,
  Building2,
  Car,
  Plane,
  GraduationCap,
  Wrench,
} from "lucide-react";
import type { ElementType } from "react";

type IndustryBase = {
  icon: ElementType;
  title: string;
  features: string[];
};

type IndustryCard = IndustryBase & {
  description: string;
};

const industries: IndustryCard[] = [
  {
    icon: Heart,
    title: "Healthcare",
    description:
      "Send appointment reminders, medication reminders, and patient follow-ups, allowing staff to focus on care.",
    features: ["Appointment reminders", "Medication reminders", "Patient follow-ups"],
  },
  {
    icon: ShoppingCart,
    title: "Retail & E-commerce",
    description:
      "Remind customers of abandoned carts or pending payments, reducing cart abandonment and increasing revenue.",
    features: ["Abandoned cart reminders", "Payment reminders", "Order status updates"],
  },
  {
    icon: CreditCard,
    title: "Financial Services",
    description:
      "Follow up on loan EMIs or credit card dues, ensuring timely payments and reducing delinquencies.",
    features: ["Loan EMI follow-ups", "Credit card due reminders", "Payment confirmations"],
  },
  {
    icon: Building2,
    title: "Real Estate",
    description:
      "Remind clients of site visits or rent collections, streamlining property management and improving cash flow.",
    features: ["Site visit reminders", "Rent collection reminders", "Property maintenance alerts"],
  },
];

const additionalIndustries: IndustryBase[] = [
  { icon: Car, title: "Automotive", features: ["Service renewal reminders"] },
  {
    icon: Plane,
    title: "Travel & Hospitality",
    features: ["Booking reminders", "Payment reminders"],
  },
  {
    icon: GraduationCap,
    title: "Education",
    features: ["Fee deadline reminders", "Class schedule reminders"],
  },
  {
    icon: Wrench,
    title: "Home Services",
    features: ["Upcoming appointment reminders"],
  },
];

const tableIndustries: IndustryBase[] = [...industries, ...additionalIndustries];

export function RemindersCollectionsFeaturesSection() {
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
              Industry-Specific Solutions with TinkerVoice
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Automate reminders and collections across multiple industries with personalized,
              AI-powered voice interactions that drive results.
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

        {/* Main Industries Grid - 2x2 */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                default: { duration: 0.6, delay: index * 0.1 },
                y: { duration: 0.2, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative transform-gpu space-y-4 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                  <industry.icon className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>

                <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
                  {industry.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80 mb-4">
                  {industry.description}
                </p>

                <ul className="space-y-2">
                  {industry.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Industries We Serve Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="mb-4 font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Industries We Serve
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Discover more about how TinkerVoice can help your industry with AI-powered reminders and collections solutions.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}
          ></div>
        </motion.div>
        <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

        {/* Industries Grid - 2x4 */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-4">
          {tableIndustries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.07 }}
              viewport={{ once: true }}
              className="group relative flex flex-col items-center rounded-xl border border-border/70 bg-background/80 dark:bg-background/20 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(var(--primary-rgb),0.35)] backdrop-blur-xl [box-shadow:0_-18px_70px_-24px_rgba(var(--primary-rgb),0.18)_inset] dark:[box-shadow:0_-18px_70px_-24px_rgba(var(--primary-rgb),0.14)_inset]"
            >
              {/* Icon */}
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/35 group-hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)]">
                <industry.icon className="h-6 w-6 text-primary" />
              </div>

              <span className="text-sm font-medium text-foreground text-center transition-colors duration-300 group-hover:text-primary">
                {industry.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}