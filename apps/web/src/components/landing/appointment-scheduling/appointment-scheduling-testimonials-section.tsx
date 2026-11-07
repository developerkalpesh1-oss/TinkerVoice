"use client";

import { motion } from "framer-motion";
import { Star, Quote, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Daniel Lefanov",
    role: "Implementation Manager",
    company: "Smartcat",
    content:
      "TinkerVoice's Voice AI Agents help us book more demos faster. We increased the conversion rates in the top of our lead pipeline: the number of contacts dialed by 31% and the number of answered calls, 24%. With more people dialed, we re-focused the sales team on high-value signals.",
    rating: 5,
    metrics: {
      icon: TrendingUp,
      value: "31%",
      label: "More Contacts Dialed",
    },
  },
  {
    name: "Leander De Laporte",
    role: "CEO & Co-Founder",
    company: "Medbelle",
    content:
      "TinkerVoice's platform is incredibly user-friendly and versatile. Whether it's for handling customer support queries or managing appointments, the AI delivers consistent, high-quality interactions that our patients appreciate.",
    rating: 5,
    metrics: {
      icon: Users,
      value: "24%",
      label: "More Answered Calls",
    },
  },
  {
    name: "Collins W.",
    role: "Mortgage Protection Specialist",
    company: "Financial Services",
    content:
      "I am about to reach out to a lot more people that are interested in my product. Before I was calling 100s of people per day but now I can do that in just a few minutes of my time. Saves me so much time and from doing the dreadful time spent on the phone.",
    rating: 5,
    metrics: {
      icon: Clock,
      value: "90%",
      label: "Time Saved",
    },
  },
];

export function AppointmentSchedulingTestimonialsSection() {
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
            <div className="mb-6 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <CheckCircle className="mr-2 h-4 w-4" />
              User Feedback
            </div>
            <h2 className="mb-4 font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Hear What Our Users Are Saying
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              See how businesses are transforming their appointment scheduling with AI-powered automation.
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

        {/* Testimonials Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-transparent shadow-[0_18px_55px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(var(--primary-rgb),0.45)] [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              {/* Inner crystal glow overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Card Body */}
              <div className="relative flex-1 p-8">
                {/* Stars & Quote Icon */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-primary/20" />
                </div>

                {/* Quote Text */}
                <blockquote className="mb-8 leading-relaxed text-foreground/80">
                  &quot;{testimonial.content}&quot;
                </blockquote>

                {/* Author Info */}
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground shadow-md ring-2 ring-background/80">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <div className="truncate text-xs text-foreground/60">
                      {testimonial.role} <span className="px-1 text-primary">•</span>{" "}
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Footer */}
              <div className="relative rounded-b-2xl border-t border-border/60 bg-background/80 dark:bg-background/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/90 text-primary shadow-sm ring-1 ring-border/80">
                    <testimonial.metrics.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-primary leading-none">
                      {testimonial.metrics.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-foreground/60">
                      {testimonial.metrics.label}
                    </div>
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
