"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Clock,
  Route,
  Users,
  CheckCircle
} from "lucide-react";
import Image from "next/image";
import Img from "@/data/use-cases/operations-automation.json";

export function OperationsAutomationWorkflowSection() {
  const workflowSteps = [
    {
      icon: ShoppingCart,
      title: "Comprehensive Order Management & Support",
      description:
        "Instantly resolve order tracking, changes, and returns via AI—offering real-time, voice/chat assistance without agent bottlenecks.",
      features: [
        "Real-time order tracking",
        "Automated returns processing",
        "Voice and chat support",
      ],
    },
    {
      icon: Clock,
      title: "Peak and Off-Hours Management",
      description:
        "Ensure uninterrupted support coverage during off-hours and busy periods through 24/7 AI response and smart load distribution.",
      features: ["24/7 availability", "Smart load distribution", "Peak hour management"],
    },
    {
      icon: Route,
      title: "Intelligent Inquiry Routing & Triage",
      description:
        "Automate top-of-funnel support with AI-driven voice and chat interactions that understand customer intent, capture key details, and route tickets instantly.",
      features: ["Intent recognition", "Automatic routing", "Context capture"],
    },
    {
      icon: Users,
      title: "Escalation & Human Handoff Coordination",
      description:
        "Seamlessly escalate cases to human agents with full context and real-time alerts—ensuring continuity and reduced resolution times.",
      features: ["Seamless handoff", "Context preservation", "Real-time alerts"],
    },
  ];

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
            <h2 className="mb-6 font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Optimize Your Support Workflow
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-foreground/70">
              From inbound queries to proactive engagement, TinkerVoice&apos;s conversational AI
              agents optimize every step, across voice and chat.
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

        <div className="space-y-16">
          {/* First 2 items combined */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative grid items-center gap-12 lg:grid-cols-2 rounded-3xl border border-border bg-transparent p-8 lg:p-10 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>

            {/* Text Content - Combined */}
            <div className="relative z-10 space-y-8">
              {workflowSteps.slice(0, 2).map((step, idx) => (
                <div key={step.title} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-3 flex-shrink-0 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <step.icon className="h-5 w-5 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-geist mb-2 text-lg font-bold tracking-tighter text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                        {step.title}
                      </h3>
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80"
                          >
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {idx < 1 && <hr className="border-border/50" />}
                </div>
              ))}
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-border/70 bg-background/80 shadow-[0_22px_70px_rgba(15,23,42,0.7)] backdrop-blur-2xl [box-shadow:0_-20px_80px_-24px_rgba(var(--primary-rgb),0.18)_inset] dark:[box-shadow:0_-20px_80px_-24px_rgba(var(--primary-rgb),0.14)_inset]">
                <Image
                  src={Img.useCases1.url}
                  alt={Img.useCases1.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-3xl object-cover"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Next 2 items combined */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative grid items-center gap-12 lg:grid-cols-2 lg:grid-flow-dense rounded-3xl border border-border bg-transparent p-8 lg:p-10 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative z-10 lg:col-start-1 lg:row-start-1"
            >
              <div className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-border/70 bg-background/80 shadow-[0_22px_70px_rgba(15,23,42,0.7)] backdrop-blur-2xl [box-shadow:0_-20px_80px_-24px_rgba(var(--primary-rgb),0.18)_inset] dark:[box-shadow:0_-20px_80px_-24px_rgba(var(--primary-rgb),0.14)_inset]">
                <Image
                  src={Img.useCases3.url}
                  alt={Img.useCases3.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-3xl object-cover"
                />
              </div>
            </motion.div>

            {/* Text Content - Combined */}
            <div className="relative z-10 space-y-8 lg:col-start-2">
              {workflowSteps.slice(2, 4).map((step, idx) => (
                <div key={step.title} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-3 flex-shrink-0 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <step.icon className="h-5 w-5 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-geist mb-2 text-lg font-bold tracking-tighter text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                        {step.title}
                      </h3>
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80"
                          >
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {idx < 1 && <hr className="border-border/50" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
