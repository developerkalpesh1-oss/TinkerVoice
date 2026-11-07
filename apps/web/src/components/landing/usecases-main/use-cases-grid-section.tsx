"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Headphones,
  TrendingUp,
  Calendar,
  Bell,
  Package,
  Settings,
  ArrowRight,
} from "lucide-react";

const useCases = [
  {
    name: "Customer Support Automation",
    href: "/use-cases/customer-support",
    icon: Headphones,
    description: "Automate customer inquiries, handle FAQs, and provide 24/7 support with AI-powered voice agents.",
  },
  {
    name: "Sales & Lead Generation",
    href: "/use-cases/sales-lead-gen",
    icon: TrendingUp,
    description: "Qualify leads, nurture prospects, and accelerate sales with intelligent voice automation.",
  },
  {
    name: "Appointment Scheduling",
    href: "/use-cases/appointment-scheduling",
    icon: Calendar,
    description: "Streamline booking processes and reduce no-shows with automated scheduling and reminders.",
  },
  {
    name: "Reminders & Collections",
    href: "/use-cases/reminders-collections",
    icon: Bell,
    description: "Send timely reminders and automate collection processes to improve cash flow and engagement.",
  },
  {
    name: "Order Status & Returns",
    href: "/use-cases/order-status-returns",
    icon: Package,
    description: "Provide instant order updates and handle return requests efficiently with voice automation.",
  },
  {
    name: "Operations Automation",
    href: "/use-cases/operations-automation",
    icon: Settings,
    description: "Automate routine operational tasks and streamline internal processes with AI voice agents.",
  },
];

export function UseCasesGridSection() {
  return (
    <section className="relative py-20 bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto max-w-2xl"
          >
            <div
              className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
              }}
            />
            <h2 className="relative z-10 font-geist text-3xl font-light tracking-tighter text-foreground sm:text-4xl lg:text-5xl mb-6">
              Explore Use Case Solutions
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto"
          >
            Each use case addresses specific business challenges. Discover how TinkerVoice delivers
            tailored AI voice agent solutions for your needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                y: { duration: 0.2, ease: "easeOut" }
              }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={useCase.href}
                className="group relative block h-full rounded-xl border border-border bg-transparent p-8 transition-all duration-200 hover:border-primary/30 overflow-hidden hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] hover:shadow-primary/50"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>

                {/* Enhanced glow effect for all cards on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    boxShadow: '0 0 40px rgba(var(--primary-rgb), 0.5), 0 0 80px rgba(var(--primary-rgb), 0.3)',
                  }}
                />

                {/* Standard vertical layout for all cards */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon and Title Section */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all duration-200 group-hover:bg-primary/20 group-hover:scale-110 relative group-hover:[box-shadow:0_0_20px_rgba(var(--primary-rgb),0.4)]">
                      <div className="absolute inset-0 rounded-xl blur-lg opacity-20 group-hover:opacity-35 transition-opacity duration-200"
                        style={{ background: 'rgba(var(--primary-rgb), 0.25)' }}
                      />
                      <useCase.icon className="h-8 w-8 text-primary relative z-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1 transition-colors duration-200 group-hover:text-primary leading-tight">
                        {useCase.name}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 transition-colors duration-200 group-hover:text-foreground/80 leading-relaxed flex-1">
                    {useCase.description}
                  </p>

                  {/* CTA Indicator with enhanced styling */}
                  <div className="flex items-center justify-between text-primary text-sm font-medium mt-auto pt-5 border-t border-border/50 group-hover:border-primary/40 transition-all duration-200">
                    <span className="group-hover:font-semibold transition-all duration-200">Explore solutions</span>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
