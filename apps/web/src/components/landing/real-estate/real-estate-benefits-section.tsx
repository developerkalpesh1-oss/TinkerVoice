"use client";

import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Users, CheckCircle, TrendingUp } from "lucide-react";

export function RealEstateBenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: "No-Code Builder",
      description: "Rapid go-live with our intuitive no-code platform that requires no technical expertise."
    },
    {
      icon: Shield,
      title: "Seamless Integrations",
      description: "Connect with MLS, CRM, and PMS systems for unified data management and workflow automation."
    },
    {
      icon: BarChart3,
      title: "Local Caller IDs",
      description: "Enhanced customer engagement with local caller IDs for better connection rates and trust."
    },
    {
      icon: Users,
      title: "TCPA Compliance",
      description: "TCPA-friendly consent capture ensuring full compliance with telemarketing regulations."
    },
    {
      icon: CheckCircle,
      title: "Recordings & Analytics",
      description: "Comprehensive recordings and analytics out of the box for data-driven insights and optimization."
    },
    {
      icon: TrendingUp,
      title: "Scalable Solutions",
      description: "Grow your business without adding headcount - scale operations efficiently with AI automation."
    }
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl"
            >
              Why Choose TinkerVoice for Real Estate?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-foreground/60 mt-3"
            >
              Experience the power of AI-driven solutions designed specifically for the real estate industry.
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
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />

        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
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
                className="group transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <benefit.icon
                      className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-geist text-lg font-bold tracking-tighter text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    {benefit.description}
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
