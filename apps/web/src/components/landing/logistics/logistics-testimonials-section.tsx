"use client";

import { motion } from "framer-motion";
import { Quote, TrendingUp } from "lucide-react";

export function LogisticsTestimonialsSection() {
  const stats = [
    {
      value: "90%",
      label: "Reduction in turnaround time"
    },
    {
      value: "50%",
      label: "Cost per interaction savings"
    },
    {
      value: "80%",
      label: "AI containment rate"
    }
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4">
              Trusted by Logistics Companies to Resolve Queries and Delight Customers
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              TinkerVoice&apos;s human-like AI Voice Agents help logistics companies to reduce turnaround time by 90%, cost per interaction by 50%, and achieve an 80% containment rate by AI.
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-4xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                {stat.value}
              </div>
              <div className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group relative transform-gpu rounded-2xl border border-border bg-transparent p-8 shadow-xl max-w-4xl mx-auto transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
              <Quote className="w-6 h-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
            </div>

            <blockquote className="text-xl text-foreground mb-8 leading-relaxed">
              &ldquo;TinkerVoice&apos;s AI voice agents have revolutionized our customer support operations. We&apos;ve seen dramatic improvements in response times and customer satisfaction while significantly reducing our operational costs. The seamless integration with our existing systems made the transition smooth and effortless.&rdquo;
            </blockquote>

            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4 transition-all duration-200 ease-out group-hover:scale-110">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  Sarah Johnson
                </div>
                <div className="text-muted-foreground">
                  Director of Customer Operations, Global Logistics Corp
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
