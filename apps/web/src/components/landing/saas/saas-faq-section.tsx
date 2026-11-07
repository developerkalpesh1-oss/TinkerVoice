"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SaasFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How can AI voice agents improve customer onboarding for SaaS companies?",
      answer: "AI voice agents can significantly streamline SaaS customer onboarding by providing instant support during setup, answering common configuration questions, guiding users through feature tutorials, and scheduling personalized demo calls. This reduces time-to-value for new customers and decreases support ticket volume by up to 70% during the critical onboarding phase."
    },
    {
      question: "Can TinkerVoice integrate with popular SaaS platforms like Salesforce, HubSpot, and Zendesk?",
      answer: "Yes, TinkerVoice offers native integrations with all major SaaS platforms including Salesforce, HubSpot, Zendesk, Intercom, and many others. Our API-first approach ensures seamless data synchronization, allowing AI voice agents to access customer information, update records, and trigger workflows across your entire tech stack in real-time."
    },
    {
      question: "How does AI call software handle complex technical support queries for SaaS products?",
      answer: "Our AI voice agents are trained on technical documentation and can handle complex SaaS support queries including API troubleshooting, integration issues, billing questions, and feature explanations. When queries exceed the AI's capabilities, it seamlessly escalates to human agents with full context, ensuring customers always receive appropriate support."
    },
    {
      question: "What security measures does TinkerVoice implement for SaaS companies handling sensitive customer data?",
      answer: "TinkerVoice implements enterprise-grade security including SOC 2 Type II compliance, end-to-end encryption, secure data centers, and comprehensive audit logs. We offer Business Associate Agreements (BAA) for healthcare SaaS companies and maintain strict data privacy protocols to ensure your customer data remains secure and compliant with industry regulations."
    },
    {
      question: "How can SaaS companies use AI voice agents for customer success and retention?",
      answer: "AI voice agents excel at proactive customer success by conducting health checks, identifying at-risk accounts, scheduling renewal calls, and gathering feedback. They can automatically reach out to customers showing low engagement, offer personalized training sessions, and ensure customers are getting maximum value from your SaaS platform, ultimately improving retention rates."
    },
    {
      question: "Does TinkerVoice support multi-tenant SaaS architectures and customer isolation?",
      answer: "Absolutely. TinkerVoice is designed for multi-tenant SaaS environments with complete customer data isolation. Each tenant's AI voice agents operate independently with their own knowledge base, call routing, and analytics. Our platform ensures strict data segregation and provides tenant-specific customization options while maintaining scalability and performance."
    }
  ];

  const toggleFAQ = (index: number) => {
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
            Everything you need to know about using AI voice agents in the SaaS industry
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
                onClick={() => toggleFAQ(index)}
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
