"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, DollarSign, Users, Code, Plug, BarChart3, Globe } from "lucide-react";

const whyFeatures = [
  {
    icon: Code,
    title: "No-Code Builder",
    description: "Deploy AI agents without any technical expertise. Our intuitive drag-and-drop interface makes it easy for anyone to create sophisticated conversational AI solutions.",
    benefits: ["Drag-and-drop interface", "Pre-built templates", "Visual workflow builder", "No coding required"]
  },
  {
    icon: Zap,
    title: "Rapid Go-Live",
    description: "Get your AI agents up and running in minutes, not months. Our streamlined deployment process ensures you can start serving customers immediately.",
    benefits: ["2-minute deployment", "Instant activation", "Pre-configured solutions", "Quick customization"]
  },
  {
    icon: Plug,
    title: "Seamless Integrations",
    description: "Connect with your existing PMS/CRS/GDS/POS systems effortlessly. Our robust API and pre-built connectors ensure smooth data flow.",
    benefits: ["PMS integration", "CRS connectivity", "GDS compatibility", "POS synchronization"]
  }
];

const businessOutcomes = [
  {
    icon: TrendingUp,
    title: "Raise RevPAR/Occupancy",
    description: "Increase revenue per available room and occupancy rates through intelligent pricing and demand management",
    metric: "+25% RevPAR"
  },
  {
    icon: DollarSign,
    title: "Cut Cost-to-Serve",
    description: "Reduce operational costs by automating routine tasks and improving efficiency",
    metric: "-40% Costs"
  },
  {
    icon: Users,
    title: "Delight Guests",
    description: "Enhance guest satisfaction without adding headcount through AI-powered personalization",
    metric: "+35% CSAT"
  }
];

export function TravelHospitalityWhySection() {
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
              Why TinkerVoice for Travel & Hospitality
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              Our no-code builder, rapid go-live, and seamless integrations with PMS/CRS/GDS/POS systems enable you to transform your business operations.
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

        {/* Why Features Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
          {whyFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
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

                <div className="relative z-10 text-center">
                  <div className="text-primary w-fit mx-auto transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <Icon className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                  </div>

                  <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center justify-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Business Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-geist text-2xl font-normal tracking-tighter text-center text-foreground mb-12">
            Transform Your Business Operations
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {businessOutcomes.map((outcome, index) => {
              const Icon = outcome.icon;

              return (
                <motion.div
                  key={outcome.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                    y: { duration: 0.2, ease: "easeOut" }
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                  {/* Stat badge in top-right corner */}
                  {outcome.metric && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                        {outcome.metric}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <Icon className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>

                    <h4 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-3">
                      {outcome.title}
                    </h4>

                    <p className="text-muted-foreground mb-4 transition-colors duration-200 ease-out group-hover:text-foreground/80">
                      {outcome.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Integration Showcase */}
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
                Seamless System Integration
              </h3>
              <p className="text-white/80 max-w-2xl mx-auto">
                Connect with your existing hospitality technology stack for unified operations
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="text-white font-medium">PMS</div>
                <div className="text-white/80 text-sm">Property Management</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-white font-medium">CRS</div>
                <div className="text-white/80 text-sm">Central Reservation</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div className="text-white font-medium">GDS</div>
                <div className="text-white/80 text-sm">Global Distribution</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="text-white font-medium">POS</div>
                <div className="text-white/80 text-sm">Point of Sale</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
