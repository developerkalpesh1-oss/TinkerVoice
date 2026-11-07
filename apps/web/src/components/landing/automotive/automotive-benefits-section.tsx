"use client";

import { motion } from "framer-motion";
import { Clock, Heart, DollarSign, Shield, CheckCircle, TrendingUp, Zap, BarChart3, Users } from "lucide-react";

export function AutomotiveBenefitsSection() {
  const keyBenefits = [
    {
      icon: Clock,
      title: "Reduced Sales Cycle Time",
      description: "AI-powered lead qualification and automated follow-ups accelerate your sales process, getting customers from inquiry to purchase faster than ever before.",
      stat: "40% faster"
    },
    {
      icon: Heart,
      title: "Increased Customer Satisfaction",
      description: "Seamless scheduling experiences and personalized interactions create memorable customer journeys that build loyalty and drive repeat business.",
      stat: "95% satisfaction"
    },
    {
      icon: DollarSign,
      title: "Cost Savings",
      description: "Reduced consultation scheduling time and initial lead qualification process costs while maintaining high-quality customer service standards.",
      stat: "30% cost reduction"
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "SOC 2 Certification",
      description: "Top-tier data security and privacy protection ensuring your customer data is always safe and secure."
    },
    {
      icon: CheckCircle,
      title: "HIPAA Compliance",
      description: "Safely manage sensitive customer data with enterprise-grade compliance standards for healthcare and beyond."
    },
    {
      icon: TrendingUp,
      title: "GDPR Compliance",
      description: "Ensure full compliance with global privacy laws and regulations for international automotive operations."
    }
  ];

  const whyTinkerVoice = [
    {
      icon: Zap,
      title: "No-code Builder",
      description: "Rapid go-live with intuitive configuration"
    },
    {
      icon: Shield,
      title: "DMS/CRM Integration",
      description: "Seamless connectivity with existing systems"
    },
    {
      icon: BarChart3,
      title: "Local Caller IDs",
      description: "TCPA-friendly consent for compliant operations"
    },
    {
      icon: Users,
      title: "Analytics & Recordings",
      description: "Data-driven insights out of the box"
    }
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Main Header */}
        <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl"
            >
              Why Choose TinkerVoice for Automotive?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-foreground/60 mt-3"
            >
              Experience the power of AI-driven solutions designed specifically for the automotive industry.
              Transform your operations, enhance customer experience, and drive business growth.
            </motion.p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2 mb-12" />

        {/* Key Benefits Grid */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="font-geist text-2xl font-normal tracking-tighter text-foreground sm:text-3xl">
              Key Benefits
            </h3>
          </motion.div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {keyBenefits.map((benefit, index) => (
              <motion.li
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" }
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                {/* Stat badge in top-right corner */}
                {benefit.stat && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                      {benefit.stat}
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <benefit.icon
                      className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-geist text-lg font-bold tracking-tighter text-foreground mt-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80 mt-2">
                    {benefit.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Security & Compliance Grid */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="font-geist text-2xl font-normal tracking-tighter text-foreground sm:text-3xl">
              Enterprise-Grade Security and Compliance
            </h3>
          </motion.div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {securityFeatures.map((feature, index) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" }
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <feature.icon
                      className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-geist text-lg font-bold tracking-tighter text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    {feature.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Why TinkerVoice Grid */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="font-geist text-2xl font-normal tracking-tighter text-foreground sm:text-3xl">
              Platform Features
            </h3>
          </motion.div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyTinkerVoice.map((feature, index) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" }
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <feature.icon
                      className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-geist text-lg font-bold tracking-tighter text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    {feature.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
