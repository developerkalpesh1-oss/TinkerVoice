"use client";

import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  Users
} from "lucide-react";
import Image from "next/image";
import logisticsImages from "@/data/industries/logistics-images.json";

export function LogisticsFeaturesSection() {
  const features = [
    {
      icon: Package,
      title: "Comprehensive Order Management & Support",
      description: "Instantly resolve order tracking, changes, and returns via AI—offering real-time, voice/chat assistance without agent bottlenecks.",
      image: logisticsImages.orderManagement.url,
      imageAlt: logisticsImages.orderManagement.alt,
      benefits: [
        "Instant resolution of order inquiries, modifications, tracking, and installations via voice or chat",
        "Efficient handling of returns and exchanges",
        "Automated status updates and proactive customer notifications",
        "Smart escalation to human agents for complex scenarios"
      ]
    },
    {
      icon: Clock,
      title: "Peak and Off-Hours Management",
      description: "Ensure uninterrupted support coverage during off-hours and busy periods through 24/7 AI response and smart load distribution.",
      image: logisticsImages.peakHours.url,
      imageAlt: logisticsImages.peakHours.alt,
      benefits: [
        "24/7 availability to handle off-hours and high-volume spikes",
        "Automated queue smoothing to prevent backlogs",
        "Proactive engagement to manage peak demand periods seamlessly"
      ]
    },
    {
      icon: Users,
      title: "Escalation & Human Handoff Coordination",
      description: "Seamlessly escalate cases to human agents with full context and real-time alerts—ensuring continuity and reduced resolution times.",
      image: logisticsImages.escalation.url,
      imageAlt: logisticsImages.escalation.alt,
      benefits: [
        "Automated context packaging with conversation summary",
        "Priority tagging based on sentiment and SLA rules",
        "Real-time agent notifications via email, SMS, or in-app alerts",
        "Smooth channel switch between voice and chat without losing history"
      ]
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
              Streamline Your Support Workflow with AI Voice Agents
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              From inbound queries to proactive engagement, TinkerVoice&apos;s conversational AI agents optimize every step of your support workflow, across voice and chat.
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
              </div>

              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-out group-hover:shadow-primary/20 group-hover:scale-[1.02]">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt || `${feature.title} illustration`}
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
      </div>
    </section>
  );
}
