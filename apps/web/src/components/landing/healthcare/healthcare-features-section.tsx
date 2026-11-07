"use client";

import { motion } from "framer-motion";
import { Route, Settings, Zap, Shield, Database, Users } from "lucide-react";

export function HealthcareFeaturesSection() {
  const features = [
    {
      icon: Route,
      title: "Advanced Routing",
      description: "Transfer calls based on ZIP code, spoken location, or department without IVR trees or operator handoffs."
    },
    {
      icon: Settings,
      title: "Centralized Management",
      description: "Manage hundreds of clinic or office numbers from a single dashboard with flexible API options."
    },
    {
      icon: Zap,
      title: "Seamless Integrations",
      description: "Update routing logic through the API and integrate with leading healthcare systems like Epic, Cerner, and athenahealth."
    },
    {
      icon: Database,
      title: "Effortless Configuration",
      description: "Configure and update routing logic without relying on developers or external support."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Enjoy top-tier data security and privacy protection with HIPAA compliance and BAA."
    },
    {
      icon: Users,
      title: "Patient Data Protection",
      description: "Safely manage sensitive patient data with PHI redaction, consent capture, and full audit logs."
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
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4"
            >
              Key Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto"
            >
              TinkerVoice delivers enterprise-grade Voice AI Agents designed to automate call routing,
              scheduling, and patient interactions with advanced healthcare-specific features.
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
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
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
                  className="group relative transform-gpu space-y-4 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <Icon
                        className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                      {feature.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
