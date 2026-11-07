"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Users, ArrowRight, Phone } from "lucide-react";
import { REGISTER_URL } from "@/lib/links";

const successStory = {
  company: "Medbelle",
  industry: "Healthcare",
  location: "UK & EU",
  size: "51-200",
  description:
    "Medbelle integrated TinkerVoice's AI customer service agents to optimize appointment management and minimize patient wait times. By automating scheduling and follow-ups, Medbelle achieved a 60% boost in scheduling efficiency and saw 2.5x more booked appointments—transforming patient experiences and operational productivity.",
  useCases: ["Appointment Booking", "Lead Qualification", "Handling FAQ"],
  metrics: [
    { value: "98%", label: "Answered Calls", icon: Phone },
    { value: "2.5x", label: "Lead Reactivation", icon: TrendingUp },
    { value: "2%", label: "No-show Rates", icon: Clock },
    { value: "87%", label: "Patient Satisfaction", icon: Users },
  ],
};

export function CustomerSupportSuccessSection() {
  return (
    <section className="relative py-20 bg-background">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
              How AI Customer Service Agents Add Business ROI
            </h2>
            <p className="text-base text-foreground/70 sm:text-lg">
              You don&apos;t have to choose between cost, speed, and quality
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

        {/* Success Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="group relative rounded-3xl border border-border/70 bg-background/70 dark:bg-background/20 p-6 lg:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(var(--primary-rgb),0.35)] [box-shadow:0_-22px_90px_-24px_rgba(var(--primary-rgb),0.18)_inset] dark:[box-shadow:0_-22px_90px_-24px_rgba(var(--primary-rgb),0.14)_inset]"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>
          <div className="relative z-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
              {/* Left Column - Story */}
              <div>
              {/* Company Header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/70 text-lg font-bold text-primary-foreground shadow-md sm:h-14 sm:w-14">
                  M
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {successStory.company}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-foreground/70 sm:text-sm">
                    <span>{successStory.industry}</span>
                    <span className="hidden text-foreground/40 sm:inline">•</span>
                    <span>{successStory.location}</span>
                    <span className="hidden text-foreground/40 sm:inline">•</span>
                    <span>{successStory.size}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mb-6 text-sm leading-relaxed text-foreground/70 sm:text-[15px]">
                {successStory.description}
              </p>

              {/* Use Cases */}
              <div>
                <h4 className="mb-3 text-base font-semibold text-foreground sm:text-lg">
                  Use Cases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {successStory.useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:text-sm"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Metrics */}
            <div className="rounded-2xl border border-border/70 bg-background/70 dark:bg-background/10 p-4 sm:p-5">
              <h4 className="mb-5 text-base font-semibold text-foreground sm:text-lg">
                Results
              </h4>
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {successStory.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="group/metric flex flex-col items-center rounded-xl border border-border/60 bg-background/90 p-4 text-center shadow-sm dark:bg-background/30 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(var(--primary-rgb),0.25)]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 sm:h-11 sm:w-11 transition-all duration-300 group-hover/metric:bg-primary/20 group-hover/metric:ring-primary/35 group-hover/metric:shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)] group-hover/metric:scale-110">
                      <metric.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover/metric:scale-110" />
                    </div>
                    <div className="mb-1 text-xl font-semibold text-primary sm:text-2xl">
                      {metric.value}
                    </div>
                    <div className="text-xs text-foreground/70 sm:text-sm">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center sm:mt-12"
        >
          <Link
            href={REGISTER_URL}
            className="group inline-flex items-center rounded-full bg-primary px-8 py-4 text-primary-foreground font-semibold shadow-lg shadow-[rgba(var(--primary-rgb),0.35)] hover:bg-primary/90 hover:shadow-[0_18px_60px_rgba(var(--primary-rgb),0.45)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200"
          >
            Try Demo Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}