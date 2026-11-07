"use client";

import { motion } from "framer-motion";
import { Star, Quote, Users } from "lucide-react";

const testimonials = [
  {
    name: "Leander de Laporte",
    role: "CEO",
    company: "Medbelle",
    content:
      "TinkerVoice's solution has given our patients the flexibility they need. Being able to handle their inquiries via phone has made a real difference in reducing wait times and improving care access.",
    rating: 5,
    metrics: {
      icon: Users,
      value: "60%",
      label: "Reduced Wait Times",
    },
  },
];

export function CustomerSupportTestimonialsSection() {
  return (
    <section className="relative py-20 bg-background">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="mb-4 font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              What Our Clients Say About AI Customer Service Agents
            </h2>
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

        {/* Testimonials */}
        <div className="grid gap-8 lg:grid-cols-1">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-border/70 bg-background/80 dark:bg-background/25 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl [box-shadow:0_-22px_90px_-24px_rgba(var(--primary-rgb),0.18)_inset] dark:[box-shadow:0_-22px_90px_-24px_rgba(var(--primary-rgb),0.14)_inset] transition-all hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(var(--primary-rgb),0.35)] hover:border-primary/30"
            >
              {/* Quote Icon */}
              <div className="absolute right-6 top-6 rounded-full border border-border/60 bg-background/80 p-2 backdrop-blur-md">
                <Quote className="h-6 w-6 text-primary opacity-50" />
              </div>

              {/* Rating + Metrics */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Metrics */}
                <div className="inline-flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                    <testimonial.metrics.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-primary">
                      {testimonial.metrics.value}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-foreground/70">
                      {testimonial.metrics.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <blockquote className="mb-6 text-lg leading-relaxed text-foreground/80">
                &quot;{testimonial.content}&quot;
              </blockquote>

              {/* Author */}
              <div className="mt-4 flex items-center gap-4 border-t border-border/70 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70">
                  <span className="text-lg font-semibold text-primary-foreground">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-foreground/70">
                    {testimonial.role}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}