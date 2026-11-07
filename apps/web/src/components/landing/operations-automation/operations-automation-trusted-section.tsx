"use client";

import { motion } from "framer-motion";

export function OperationsAutomationTrustedSection() {
  const stats = [
    {
      value: "90%",
      label: "reduction in turnaround time",
    },
    {
      value: "50%",
      label: "reduction in cost per interaction",
    },
    {
      value: "80%",
      label: "Containment Rate by AI",
    },
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats Grid - Primary Background Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-primary p-8 lg:p-12 mb-16"
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

          <div className="relative z-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-6">
              Trusted by Enterprises
                  </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              See how enterprise support teams use TinkerVoice to resolve queries and delight customers.
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
            ))}
            </div>
            </div>
          </motion.div>

        {/* CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/95 p-8 text-foreground shadow-[0_22px_70px_rgba(15,23,42,0.7)] backdrop-blur-2xl sm:p-10"
        >
          {/* subtle glow */}
          <div className="pointer-events-none absolute inset-px rounded-3xl bg-gradient-to-r from-primary/14 via-transparent to-primary/10 opacity-80" />

          <div className="relative text-center">
            <h3 className="mb-4 text-2xl font-semibold sm:text-3xl">
              Join Leading Enterprises
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-sm sm:text-base text-foreground/75">
              Discover how TinkerVoice is transforming customer support operations
              across industries with measurable results and proven ROI.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Fortune 500 Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>Global Enterprises</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span>Industry Leaders</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
