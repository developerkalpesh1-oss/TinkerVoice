"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign } from "lucide-react";

export function ManufacturingBenefitsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Boost Productivity & Efficiency",
      description: "Automate routine tasks, streamline communication, and enable faster responses to drive significant improvements in operational efficiency and issue resolution.",
      stats: "35% higher operational efficiency, 85% faster issue resolution",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Enhance Customer & Workforce Experience",
      description: "Deliver 24/7 personalized support, real-time updates, and training guidance to improve satisfaction rates and reduce skill gaps across your workforce.",
      stats: "92% satisfaction rate, reduced skill gaps",
      color: "bg-green-500"
    },
    {
      icon: DollarSign,
      title: "Reduce Costs & Strengthen Compliance",
      description: "Cut downtime, minimize revenue leakage, and optimize resources while maintaining exceptional quality and security compliance standards.",
      stats: "40% lower operational costs, 99.7% quality compliance, 100% security compliance",
      color: "bg-purple-500"
    }
  ];


  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4">
              The Benefits of TinkerVoice
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              By leveraging our AI-powered voice agents, manufacturing companies can achieve
              unprecedented levels of efficiency, quality, and customer satisfaction.
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

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" }
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group relative transform-gpu space-y-4 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                {/* All stat badges in top-right corner, stacked vertically */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  {benefit.stats.split(',').map((stat, statIndex) => (
                    <span
                      key={statIndex}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20 whitespace-nowrap"
                    >
                      {stat.trim()}
                    </span>
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <Icon className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                  </div>

                  <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
                    {benefit.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Manufacturing Efficiency Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-primary p-8 lg:p-12"
        >
          <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
            <div className="absolute top-1/2 right-[-45%] aspect-square h-[800px] w-[800px] -translate-y-1/2">
              <div className="absolute inset-0 rounded-full bg-chart-2 opacity-30 dark:hidden"></div>
              <div className="absolute inset-0 scale-[0.8] rounded-full bg-chart-3 opacity-30 dark:hidden"></div>
              <div className="absolute inset-0 scale-[0.6] rounded-full bg-chart-4 opacity-30 dark:hidden"></div>
              <div className="absolute inset-0 rounded-full bg-chart-2 opacity-30 hidden dark:block"></div>
              <div className="absolute inset-0 scale-[0.8] rounded-full bg-chart-3 opacity-30 hidden dark:block"></div>
              <div className="absolute inset-0 scale-[0.6] rounded-full bg-chart-4 opacity-30 hidden dark:block"></div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="text-center text-white mb-8">
              <h3 className="text-2xl font-bold mb-4">
                Real-Time Manufacturing Intelligence
              </h3>
              <p className="text-white/80 max-w-2xl mx-auto">
                Transform your manufacturing operations with AI that understands your processes,
                anticipates needs, and delivers actionable insights in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50%</div>
                <div className="text-white/80">Faster Issue Resolution</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">30%</div>
                <div className="text-white/80">Reduced Downtime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">25%</div>
                <div className="text-white/80">Cost Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-white/80">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
