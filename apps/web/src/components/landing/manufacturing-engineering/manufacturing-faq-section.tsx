"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ManufacturingFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does TinkerVoice integrate with existing ERP and MES systems in manufacturing environments?",
      answer: "TinkerVoice offers seamless integration with leading ERP systems (SAP, Oracle, Microsoft Dynamics) and MES platforms through our robust API framework. Our AI agents can access real-time production data, inventory levels, work orders, and quality metrics to provide accurate responses and automate workflows. The integration typically takes 2-4 weeks and includes data synchronization, workflow mapping, and staff training."
    },
    {
      question: "Can AI voice agents handle complex technical inquiries about manufacturing processes and equipment?",
      answer: "Yes, TinkerVoice's AI is specifically trained on manufacturing terminology, processes, and technical documentation. Our agents can handle inquiries about equipment specifications, troubleshooting procedures, maintenance schedules, quality standards, and safety protocols. The system continuously learns from your technical documentation, SOPs, and expert knowledge to provide increasingly accurate responses."
    },
    {
      question: "How does TinkerVoice ensure compliance with manufacturing industry regulations and quality standards?",
      answer: "TinkerVoice is designed with compliance at its core, supporting ISO 9001, ISO 14001, FDA regulations, and other industry-specific standards. Our system maintains detailed audit trails, ensures data integrity, and can automatically generate compliance reports. All interactions are logged and can be reviewed for quality assurance, regulatory audits, and continuous improvement initiatives."
    },
    {
      question: "What security measures are in place to protect sensitive manufacturing data and intellectual property?",
      answer: "TinkerVoice employs enterprise-grade security including end-to-end encryption, role-based access controls, and compliance with SOC 2 Type II, ISO 27001, and GDPR standards. All data is processed in secure, isolated environments with regular security audits. We offer on-premises deployment options for organizations with strict data sovereignty requirements."
    },
    {
      question: "How quickly can TinkerVoice be deployed across multiple manufacturing facilities and production lines?",
      answer: "TinkerVoice supports rapid, scalable deployment across multiple facilities. Our cloud-native architecture allows for quick provisioning of new instances, while our configuration management tools enable consistent setup across locations. Typically, a single facility can be operational within 1-2 weeks, with additional facilities added incrementally based on your rollout timeline and change management requirements."
    },
    {
      question: "Can TinkerVoice handle multilingual support for global manufacturing operations with diverse workforces?",
      answer: "Absolutely. TinkerVoice supports over 100 languages and dialects, making it ideal for global manufacturing operations. The AI can automatically detect worker language preferences, provide culturally appropriate responses, and ensure accurate translation of technical terms and safety instructions. This capability is essential for multinational manufacturers with diverse teams and global supply chains."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center"
        >
          <Badge
            variant="outline"
            className="border-primary mb-4 px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            FAQs
          </Badge>

          <h2 className="text-foreground mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to everything you need to know about TinkerVoice&apos;s AI Voice Agents
            and how they can revolutionize your manufacturing operations.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={cn(
                  'border-border h-fit overflow-hidden rounded-xl border transition-all duration-300',
                  openIndex === index
                    ? 'shadow-3xl bg-card/50 border-primary/30'
                    : 'bg-card/50 hover:border-primary/20',
                )}
                style={{ minHeight: '88px' }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-card/70"
                >
                  <h3 className="text-foreground text-lg font-medium">
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    {openIndex === index ? (
                      <MinusIcon className="text-primary h-5 w-5" />
                    ) : (
                      <PlusIcon className="text-primary h-5 w-5" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-border border-t px-6 pt-2 pb-6">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
