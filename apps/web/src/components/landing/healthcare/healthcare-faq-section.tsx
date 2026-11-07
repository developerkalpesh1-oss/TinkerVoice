"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function HealthcareFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does TinkerVoice ensure HIPAA compliance for healthcare organizations?",
      answer: "TinkerVoice is fully HIPAA compliant with comprehensive Business Associate Agreements (BAA), automatic PHI redaction from call recordings, encrypted data transmission, and complete audit logs. We maintain SOC 2 Type II certification and follow strict data handling protocols to protect patient information."
    },
    {
      question: "Can TinkerVoice integrate with our existing EHR system like Epic or Cerner?",
      answer: "Yes, TinkerVoice offers native integrations with leading EHR systems including Epic, Cerner, athenahealth, Allscripts, NextGen, and eClinicalWorks. Our API-first approach allows seamless data synchronization for patient scheduling, appointment management, and call routing based on patient records."
    },
    {
      question: "How does the AI-powered call routing work for multiple clinic locations?",
      answer: "TinkerVoice uses advanced AI to route calls based on patient ZIP code, spoken location preferences, department needs, and clinic availability. The system can automatically transfer patients to the nearest available clinic, schedule appointments at the most convenient location, and handle complex multi-location routing scenarios without human intervention."
    },
    {
      question: "What kind of patient data security measures are in place?",
      answer: "We implement enterprise-grade security including end-to-end encryption, automatic PHI redaction, consent capture for all recordings, role-based access controls, and comprehensive audit trails. All data is stored in HIPAA-compliant data centers with regular security assessments and compliance monitoring."
    },
    {
      question: "How quickly can we implement TinkerVoice in our healthcare organization?",
      answer: "TinkerVoice offers rapid deployment with our no-code configuration platform. Most healthcare organizations can be up and running within 2-4 weeks, including EHR integration, staff training, and workflow optimization. Our dedicated healthcare implementation team ensures smooth transition with minimal disruption to patient care."
    },
    {
      question: "Does TinkerVoice support multilingual patient communication?",
      answer: "Yes, TinkerVoice supports over 100 languages and dialects, making it ideal for diverse patient populations. The AI can automatically detect patient language preferences, provide culturally appropriate responses, and ensure accurate medical terminology translation for better patient understanding and care coordination."
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
            Frequently Asked Questions About AI Voice Agents in Healthcare
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to everything you need to know about TinkerVoice&apos;s AI Voice Agents
            and how they can revolutionize your healthcare communication.
          </p>
        </motion.div>

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
