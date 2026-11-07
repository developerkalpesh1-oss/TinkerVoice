"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question:
      "How do AI voice agents handle real-time order status updates across different industries?",
    answer:
      "TinkerVoice's AI voice agents integrate seamlessly with existing logistics and order management systems to provide real-time status updates. The system automatically pulls data from your current systems and delivers personalized updates to customers via voice calls, ensuring they stay informed about their orders without manual intervention. This works across retail, healthcare, financial services, and all other industries we serve.",
  },
  {
    question:
      "Can the AI voice agents handle complex returns processing and resolution workflows?",
    answer:
      "Yes, TinkerVoice's AI voice agents are equipped with sophisticated conversation flows that can handle complex returns processing, including return authorization, refund processing, and resolution workflows. The system can automatically initiate return requests, process refunds, provide step-by-step guidance to customers throughout the returns process, and escalate to human agents when needed for complex cases.",
  },
  {
    question:
      "What security measures are in place for handling sensitive order and customer data?",
    answer:
      "TinkerVoice implements enterprise-grade security measures including SOC2, HIPAA, and PCI compliance for data protection. All customer data is encrypted in transit and at rest, with strict access controls and audit trails. The system maintains 99.9% uptime and sub-500ms latency while ensuring complete data privacy and security. We also provide comprehensive audit trails for compliance reporting.",
  },
  {
    question:
      "How does the system integrate with existing logistics and order management systems?",
    answer:
      "TinkerVoice offers easy integration with current logistics systems through APIs, webhooks, and direct database connections. Our forward-deployed team ensures seamless integration into your existing order systems, providing instant access to updates and maintaining data consistency across all platforms. The system supports popular e-commerce platforms, ERP systems, and custom logistics solutions.",
  },
  {
    question:
      "What happens when customers have questions that the AI voice agent cannot answer?",
    answer:
      "Our AI voice agents are designed with intelligent escalation protocols. When a customer's question exceeds the AI's capabilities, the system automatically transfers the call to a human agent with full context of the conversation. The AI also provides the human agent with relevant customer information, order details, and conversation history to ensure seamless handoff and continued excellent service.",
  },
  {
    question:
      "How can businesses customize the AI voice agent for their specific industry needs?",
    answer:
      "TinkerVoice offers extensive customization options including custom system prompts, industry-specific conversation flows, branded voice selection, and integration with your existing CRM and order management systems. You can bring your own AI models, customize the voice personality, set specific business rules, and configure the system to match your brand's tone and customer service standards. Our team works with you to ensure the solution perfectly fits your business requirements.",
  },
];

export function OrderStatusReturnsFaqSection() {
  const [openIndex, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(openIndex === i ? null : i);

  return (
    <section className="relative py-20 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
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
            Get answers about implementing AI voice agents to automate order status updates and returns.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={cn(
                  'border-border h-fit overflow-hidden rounded-xl border transition-all duration-300',
                  isOpen
                    ? 'shadow-3xl bg-card/50 border-primary/30'
                    : 'bg-card/50 hover:border-primary/20',
                )}
                style={{ minHeight: '88px' }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-card/70"
                >
                  <h3 className="text-foreground text-lg font-medium">
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                      <MinusIcon className="text-primary h-5 w-5" />
                    ) : (
                      <PlusIcon className="text-primary h-5 w-5" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
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
            );
          })}
        </div>

      </div>
    </section>
  );
}
