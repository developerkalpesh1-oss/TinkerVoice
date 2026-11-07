"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  BookOpen,
  Clock,
  TrendingUp,
  Lock,
  CheckCircle
} from "lucide-react";
import Image from "next/image";
import Img from "@/data/use-cases/order-status-returns.json";

const features = [
  {
    icon: Shield,
    title: "Data Privacy and Security",
    description:
      "Ensure customer data is safe with industry-standard security protocols and compliance measures.",
  },
  {
    icon: Zap,
    title: "Easy Integration",
    description:
      "Integrate with current logistics systems for instant access to updates and seamless workflow.",
  },
  {
    icon: BookOpen,
    title: "Educational Content",
    description:
      "Provide users with step-by-step guidance on how to track their orders and manage returns.",
  },
  {
    icon: Clock,
    title: "Always On",
    description:
      "Run order tracking continuously for timely updates and 24/7 customer support availability.",
  },
  {
    icon: TrendingUp,
    title: "Scalable and Secure",
    description:
      "Maintain 99.9% uptime and sub-500ms latency for seamless operations across all scales.",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Security",
    description:
      "SOC2, HIPAA, and PCI compliant solutions for maximum data protection and compliance.",
  },
];

const enterpriseFeatures = [
  {
    title: "Reliable",
    description: "99.9% uptime for uninterrupted service",
    icon: CheckCircle,
  },
  {
    title: "Scalable",
    description: "Seamlessly integrate with your existing systems",
    icon: TrendingUp,
  },
  {
    title: "Secure",
    description: "SOC2, HIPAA, and PCI compliant for data protection",
    icon: Shield,
  },
];

export function OrderStatusReturnsFeaturesSection() {
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
            <h2 className="mb-4 font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Features and Benefits of{" "}
              <span className="text-primary">
                TinkerVoice AI
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-foreground/70">
              Discover how our AI voice agents transform order status experience
              with modern, scalable automation.
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

        {/* Features Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
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

                <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Feature Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background/90 p-10 shadow-[0_22px_70px_rgba(15,23,42,0.6)] backdrop-blur-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(var(--primary-rgb),0.45)] [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
        >
          {/* Subtle gradient background on hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">

            {/* Left Content */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Enterprise-Grade Solutions
              </h3>
              <p className="text-lg text-foreground/70 mb-8 max-w-xl">
                Designed for businesses operating at scale — secure, reliable and future-ready.
              </p>

              <div className="space-y-6">
                {enterpriseFeatures.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4"
                  >
                    <div className="inline-flex items-center justify-center rounded-full border border-border bg-primary/10 p-3 transition-all duration-200 ease-out group-hover:scale-110 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <item.icon className="h-5 w-5 text-primary transition-transform duration-200 ease-out" />
                    </div>
                    <div>
                      <h4 className="font-bold tracking-tighter text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src={Img.useCases.url}
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={Img.useCases.alt}
                className="rounded-2xl shadow-2xl ring-1 ring-border/60 object-cover w-full"
              />
            </motion.div>

          </div>
        </motion.div>

        {/* Voice Sample */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="mt-16 group"
        >
          <div className="rounded-3xl border border-border bg-transparent p-10 transition-all duration-300 hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]">
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative z-10 text-center mb-6">
              <div className="mb-3 inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/60">
                🎤
              </div>

              <h3 className="text-2xl font-bold tracking-tighter text-foreground">
                Voice Samples
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Hear our natural conversational AI
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-lg rounded-2xl border border-border/70 bg-background/90 p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background font-bold text-sm shadow-md">
                      AI
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium flex items-center gap-1">
                        Live Demo
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                      </p>
                      <p className="text-xs text-foreground/60">TinkerVoice Agent</p>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    {[4,3,5,3].map((h,i)=>(
                      <div
                        key={i}
                        className={`h-${h} w-1 bg-primary rounded-full animate-pulse`}
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>

                </div>

                <div className="rounded-xl border border-border/70 bg-background/90 px-4 py-3">
                  <p className="text-base text-foreground italic">
                    &quot;Hey there, I&apos;m Elliot. How can I help?&quot;
                  </p>
                  <p className="mt-1 text-xs text-foreground/60">
                    Friendly & soothing voice
                  </p>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
