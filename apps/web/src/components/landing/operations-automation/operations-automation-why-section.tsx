"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  History,
  Zap,
  Shield,
  MessageSquare,
  Phone,
  ArrowRight
} from "lucide-react";
import Image from "next/image";

export function OperationsAutomationWhySection() {
  const features = [
    {
      icon: BarChart3,
      title: "Unified Insights Dashboard",
      description: "Consolidate voice and chat transcripts into one place. Gain real-time metrics on CSAT, deflection rates, peak volumes, & more to continuously optimize support."
    },
    {
      icon: History,
      title: "Seamless Context Continuity",
      description: "Agents pick up where the last interaction left off. No more starting over or losing context when customers switch between channels."
    },
    {
      icon: Zap,
      title: "Effortless Integration into Your Stack",
      description: "Get up and running in days, not months. Our platform integrates seamlessly with your existing tools and workflows."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why TinkerVoice
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet your customers wherever they are, with natural, human-like conversations that flow seamlessly across voice and text channels. Our platform preserves conversation history as customers switch channels, ensuring no &quot;starting over.&quot;
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

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-[500px]">
              <Image
                src="/images/ecommerce-ai-dashboard.png"
                alt="TinkerVoice unified dashboard showing voice and chat analytics, customer insights, and performance metrics"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain rounded-2xl"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Seamless Channel Integration</h3>
              <p className="text-blue-100 mb-6">
                Customers can start a conversation on voice and continue on chat, or vice versa, without losing any context or having to repeat information.
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>Voice Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  <span>Seamless Switch</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
