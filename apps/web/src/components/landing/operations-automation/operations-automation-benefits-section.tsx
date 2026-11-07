"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Tag,
  FileText,
  Bell,
  History,
  AlertCircle,
  Mail,
  MessageSquare
} from "lucide-react";

export function OperationsAutomationBenefitsSection() {
  const benefits = [
    {
      icon: Brain,
      title: "Natural-language intent detection via Voice AI",
      description: "Advanced AI understands customer intent and context in natural conversations"
    },
    {
      icon: Tag,
      title: "Dynamic priority & sentiment tagging",
      description: "Automatically prioritize and tag tickets based on sentiment and urgency"
    },
    {
      icon: FileText,
      title: "Context-rich ticket creation in your CRM or helpdesk",
      description: "Seamlessly create detailed tickets with full conversation context"
    },
    {
      icon: Bell,
      title: "Automated follow-ups for missing information",
      description: "Intelligently follow up to gather missing details and complete requests"
    },
    {
      icon: History,
      title: "Automated context packaging with conversation summary",
      description: "Package complete conversation history for seamless handoffs"
    },
    {
      icon: AlertCircle,
      title: "Priority tagging based on sentiment and SLA rules",
      description: "Smart prioritization ensures urgent issues get immediate attention"
    },
    {
      icon: Mail,
      title: "Real-time agent notifications via email, SMS, or in-app alerts",
      description: "Keep your team informed with instant notifications across all channels"
    },
    {
      icon: MessageSquare,
      title: "Smooth channel switch between voice and chat without losing history",
      description: "Customers can switch between channels seamlessly while maintaining context"
    }
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
              Benefits of TinkerVoice&apos;s AI-Powered Support
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-foreground/70">
              Experience the full power of AI-driven customer support with
              comprehensive automation and intelligent features
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

        {/* Benefits Grid - 4x2 Formation */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative transform-gpu overflow-hidden rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center rounded-full border border-border bg-primary/10 p-3 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/20 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                  <benefit.icon className="h-5 w-5 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>
                <h3 className="font-geist mb-2 text-base font-bold tracking-tighter text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats / Metrics - Primary Background Box */}
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

          <div className="relative z-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-6">
              Proven Results
            </h3>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { value: "90%", label: "Reduction in Turnaround Time", description: "Faster issue resolution" },
                { value: "50%", label: "Reduction in Cost per Interaction", description: "Significant cost savings" },
                { value: "80%", label: "Containment Rate by AI", description: "Automated resolution" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
