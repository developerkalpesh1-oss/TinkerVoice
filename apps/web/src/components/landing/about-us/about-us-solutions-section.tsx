'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Zap, Users, TrendingUp, BarChart3 } from 'lucide-react';
import Img from "@/data/company/about-us.json";

export function AboutUsSolutionsSection() {
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
              Transform Business Operations with AI Voice Agents
            </h2>
            <p className="text-lg text-foreground/70 max-w-7xl mx-auto leading-relaxed">
              Reimagine efficiency, engagement, and scalability across every business function with TinkerVoice. Our
              intelligent AI voice agents help automate repetitive tasks, streamline workflows, and enhance
              communication — empowering teams to focus on growth and innovation.
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background/80 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] hover:shadow-primary/50 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 rounded-b-3xl bg-gradient-to-t from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="grid grid-cols-1 gap-6">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group/card relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>
                  <div className="relative z-10 flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/25">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        1. Automate Customer Support
                      </h3>
                      <p className="text-sm text-foreground/75">
                        Deliver seamless, 24/7 customer assistance through AI-powered voice agents that handle FAQs,
                        complaints, and service requests. Reduce wait times, improve satisfaction, and ensure consistent,
                        high-quality responses across every interaction.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="group/card relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>
                  <div className="relative z-10 flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/25">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        2. Accelerate Sales and Lead Management
                      </h3>
                      <p className="text-sm text-foreground/75">
                        Boost conversions with AI voice agents that engage leads instantly, qualify prospects through
                        natural conversations, schedule demos, and send reminders — ensuring no opportunity is missed.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="group/card relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>
                  <div className="relative z-10 flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/25">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        3. Streamline Operations and Scheduling
                      </h3>
                      <p className="text-sm text-foreground/75">
                        Simplify daily workflows like appointment booking, order tracking, feedback collection, and
                        internal coordination. Free up your team&apos;s time from repetitive calls and enable them to focus
                        on strategic, high-value tasks.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="group/card relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>
                  <div className="relative z-10 flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/25">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        4. Gain Actionable Insights and Scalability
                      </h3>
                      <p className="text-sm text-foreground/75">
                        Access valuable call analytics and performance data to refine your strategies and improve
                        decision-making. Scale your operations effortlessly — handling thousands of calls simultaneously
                        without additional staffing or cost.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[600px] overflow-hidden rounded-3xl border border-border/70 bg-background/80 shadow-[0_22px_70px_rgba(15,23,42,0.7)] backdrop-blur-xl">
                <Image
                  src={Img.useCases2.url}
                  alt={Img.useCases2.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
