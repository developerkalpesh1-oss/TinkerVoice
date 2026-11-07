"use client";

import { motion } from "framer-motion";
import { Calendar, UserCheck, Clock, Target, TrendingUp, CheckCircle } from "lucide-react";
import Image from "next/image";
import automotiveImages from "@/data/industries/automotive-images.json";

export function AutomotiveFeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Streamline Test Drive Scheduling and Customer Screening with AI",
      description: "Direct integration with your scheduling system for effortless test drive and service appointment booking. Efficient lead qualification through AI-powered initial screenings and key information gathering. Automated reminders and prep checklists to reduce no-shows and enhance customer satisfaction.",
      image: automotiveImages.testDriveScheduling.url,
      imageAlt: automotiveImages.testDriveScheduling.alt,
      benefits: [
        "Direct scheduling system integration",
        "AI-powered lead qualification",
        "Automated reminders and prep checklists",
        "Reduced no-shows and enhanced satisfaction"
      ]
    },
    {
      icon: TrendingUp,
      title: "Boost Sales and Customer Satisfaction with TinkerVoice",
      description: "Around-the-clock customer engagement with 24/7 hotline support. Instant lead response and qualification to capture high-quality leads. Personalized customer interactions through context-aware technology, pulling VIN, RO, and customer history from your DMS/CRM.",
      image: automotiveImages.boostSales.url,
      imageAlt: automotiveImages.boostSales.alt,
      benefits: [
        "24/7 hotline support availability",
        "Instant lead response and qualification",
        "Context-aware personalized interactions",
        "DMS/CRM integration for customer history"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: UserCheck,
      title: "Lead Qualification",
      description: "AI-powered initial screenings capture high-quality leads and gather key customer information automatically."
    },
    {
      icon: Clock,
      title: "Automated Reminders",
      description: "Reduce no-shows with automated test drive reminders and prep checklists sent to customers."
    },
    {
      icon: Target,
      title: "Context-Aware Technology",
      description: "Pull VIN, RO, and customer history from your DMS/CRM for personalized interactions."
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
              Transform Your Automotive Business Operations
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              Discover how TinkerVoice&apos;s AI voice assistants can revolutionize your dealership&apos;s customer engagement and sales processes
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

        <div className="space-y-24 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl p-8 transition-all duration-300 ease-out border border-transparent hover:border-primary/20 hover:bg-gradient-to-br hover:from-primary/5 hover:via-transparent hover:to-primary/5 hover:shadow-xl hover:shadow-primary/10 ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center mb-6">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 mr-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
                  </div>
                  <h3 className="font-geist text-2xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-out group-hover:text-primary">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6 transition-colors duration-300 ease-out group-hover:text-foreground/90">
                  {feature.description}
                </p>

                {feature.benefits && (
                  <div className="space-y-3">
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110" />
                          <span className="text-muted-foreground transition-colors duration-300 ease-out group-hover:text-foreground/90">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-out group-hover:shadow-primary/20 group-hover:scale-[1.02]">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                default: { duration: 0.6, delay: index * 0.1 },
                y: { duration: 0.2, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative transform-gpu space-y-4 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                  <feature.icon className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>

                <h4 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
                  {feature.title}
                </h4>

                <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
