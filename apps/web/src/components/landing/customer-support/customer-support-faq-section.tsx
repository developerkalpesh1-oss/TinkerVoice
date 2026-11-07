"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does AI voice agent technology work in customer support?",
    answer:
      "AI voice agents use advanced natural language processing (NLP) and machine learning to understand customer inquiries, process requests in real-time, and provide human-like responses. They can handle complex conversations, access customer data, and seamlessly escalate to human agents when needed.",
  },
  {
    question: "What types of customer support tasks can AI voice agents handle?",
    answer:
      "AI voice agents excel at handling order inquiries, account management, billing questions, product information, appointment scheduling, troubleshooting, and FAQ responses. They can also process returns, cancellations, and provide personalized recommendations based on customer history.",
  },
  {
    question: "How do AI voice agents maintain conversation context and memory?",
    answer:
      "AI voice agents maintain conversation context through advanced memory systems that track customer interactions, preferences, and history. They can reference previous conversations, remember customer details, and provide personalized responses throughout multi-turn conversations.",
  },
  {
    question: "Can AI voice agents integrate with existing CRM and support systems?",
    answer:
      "Yes, AI voice agents seamlessly integrate with 200+ platforms including Salesforce, HubSpot, Zendesk, and other CRM systems. They can access customer data, update records, create tickets, and sync information across your entire tech stack in real-time.",
  },
  {
    question: "What security measures protect customer data in AI voice interactions?",
    answer:
      "AI voice agents implement enterprise-grade security including end-to-end encryption, SOC2 compliance, HIPAA compliance for healthcare, and GDPR compliance for EU customers. All data is encrypted in transit and at rest, with strict access controls and audit trails.",
  },
  {
    question: "How do AI voice agents handle complex or emotional customer situations?",
    answer:
      "AI voice agents are trained to recognize emotional cues and complex situations. They can express empathy, provide reassurance, and automatically escalate to human agents when dealing with sensitive issues, complaints, or situations requiring human judgment and emotional intelligence.",
  },
];

export function CustomerSupportFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Find answers to everything you need to know about TinkerVoice&apos;s AI Customer Service solution.
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