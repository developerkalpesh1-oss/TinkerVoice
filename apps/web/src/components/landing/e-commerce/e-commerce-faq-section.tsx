"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How can AI voice agents help reduce cart abandonment in e-commerce?",
    answer: "AI voice agents can proactively reach out to customers who abandon their carts through automated calls or SMS. They can offer personalized discounts, answer product questions, help with checkout issues, and guide customers through the purchase process. This proactive approach can recover 15-30% of abandoned carts, significantly boosting revenue."
  },
  {
    question: "What types of customer support queries can AI voice agents handle for online retailers?",
    answer: "AI voice agents excel at handling common e-commerce queries including order status (WISMO), shipping information, return and exchange policies, product availability, sizing questions, warranty information, store hours, and general product inquiries. They can also handle complex multi-step processes like processing returns or scheduling appointments."
  },
  {
    question: "How do AI voice agents integrate with existing e-commerce platforms like Shopify or WooCommerce?",
    answer: "TinkerVoice offers seamless integration with major e-commerce platforms through APIs and webhooks. The AI agents can access real-time inventory data, customer order history, product catalogs, and CRM information. This allows them to provide accurate, personalized assistance while maintaining data consistency across all your systems."
  },
  {
    question: "Can AI voice agents help with upselling and cross-selling in retail?",
    answer: "Yes, AI voice agents are excellent at guided selling. They can analyze customer preferences, suggest complementary products, offer bundle deals, and recommend items based on purchase history. During support calls, they can identify upsell opportunities and present them naturally in conversation, often increasing average order value by 20-40%."
  },
  {
    question: "How do AI voice agents handle multilingual customer support for global e-commerce?",
    answer: "TinkerVoice's AI agents support over 100 languages and can automatically detect the customer's preferred language. They can seamlessly switch between languages during a conversation and provide culturally appropriate responses. This enables 24/7 multilingual support without the need for multilingual staff, expanding your global reach."
  },
  {
    question: "What analytics and insights do AI voice agents provide for e-commerce optimization?",
    answer: "AI voice agents provide comprehensive analytics including customer satisfaction scores, common query patterns, conversion rates, average handling time, and revenue impact. They can identify trends in customer behavior, product issues, and support bottlenecks. This data helps optimize product offerings, improve customer experience, and make data-driven business decisions."
  }
];

export function EcommerceFaqSection() {
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
            Frequently Asked Questions About AI Voice Agents in Retail & E-commerce
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to common questions about implementing conversational AI in your e-commerce business
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
