"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question:
      "How does TinkerVoice ensure personalized reminders for different customer segments?",
    answer:
      "TinkerVoice uses advanced AI to analyze customer data and behavior patterns, automatically personalizing reminder content, timing, and delivery method for each individual. The system can segment customers based on payment history, preferences, and demographics to deliver the most effective reminders that drive action.",
  },
  {
    question:
      "Can TinkerVoice handle complex collection scenarios like payment plans and negotiations?",
    answer:
      "Yes, TinkerVoice is equipped with sophisticated conversation flows that can handle payment plan discussions, negotiate payment terms, and escalate to human agents when needed. The AI can process payment arrangements, confirm new due dates, and automatically update your systems with agreed-upon terms.",
  },
  {
    question:
      "What compliance measures are in place for debt collection and reminder calls?",
    answer:
      "TinkerVoice is fully compliant with FDCPA, TCPA, and other relevant regulations. The system maintains detailed call logs, respects opt-out requests, adheres to calling time restrictions, and includes required disclosures. All interactions are recorded and auditable for compliance reporting.",
  },
  {
    question:
      "How does the AI voice agent integrate with existing CRM and billing systems?",
    answer:
      "TinkerVoice offers seamless integration with popular CRM platforms, billing systems, and payment processors through APIs and webhooks. The system can automatically pull customer data, update payment statuses, schedule follow-ups, and sync all interaction history back to your existing systems in real-time.",
  },
  {
    question:
      "What happens if a customer has questions the AI cannot answer during a reminder call?",
    answer:
      "When TinkerVoice encounters complex queries beyond its knowledge base, it can seamlessly transfer the call to a human agent with full context of the conversation. The system can also schedule callbacks, take messages, or direct customers to appropriate self-service options while maintaining a smooth customer experience.",
  },
  {
    question:
      "How effective are AI voice agents compared to traditional reminder methods like emails or SMS?",
    answer:
      "AI voice agents typically achieve 40-60% higher response rates than traditional methods. Voice calls create a sense of urgency and personal connection that emails and SMS lack. The interactive nature allows for immediate resolution, payment collection, or appointment rescheduling, leading to significantly better outcomes and faster cash flow improvement.",
  },
];

export function RemindersCollectionsFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (i: number) =>
    setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative py-20 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <Badge
            variant="outline"
            className="border-primary text-primary mb-4 px-3 py-1 text-xs font-medium tracking-wider uppercase dark:border-primary"
          >
            FAQs
          </Badge>

          <h2 className="text-foreground mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions About Reminders & Collections
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to common questions about implementing automated reminders and collections in your business
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
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="px-6 pt-2 pb-6">
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {faq.answer}
                      </p>
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