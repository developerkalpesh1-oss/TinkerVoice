"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does TinkerVoice integrate with MLS systems and real estate CRMs?",
    answer: "TinkerVoice offers seamless integration with leading MLS systems, real estate CRMs, and property management software. Our API-first approach allows real-time data synchronization for listings, customer information, appointment scheduling, and lead management, ensuring all your systems work together seamlessly."
  },
  {
    question: "Can TinkerVoice handle complex real estate inquiries and property-specific questions?",
    answer: "Yes, TinkerVoice uses advanced AI trained specifically on real estate terminology and processes. The system can handle complex inquiries about property details, pricing, neighborhood information, financing options, and transaction processes, providing accurate and helpful responses to potential buyers and sellers."
  },
  {
    question: "How does the AI-powered lead qualification work for real estate leads?",
    answer: "TinkerVoice's AI automatically qualifies leads by analyzing budget, location preferences, timeline, financing status, and property requirements. The system can instantly respond to leads, schedule property tours, and route qualified prospects to the appropriate agents, significantly improving conversion rates and reducing response time."
  },
  {
    question: "Is TinkerVoice compliant with real estate regulations and TCPA requirements?",
    answer: "Absolutely. TinkerVoice is fully TCPA compliant with built-in consent capture, DNC list management, and proper call recording notifications. We also ensure compliance with real estate regulations including fair housing laws, disclosure requirements, and state-specific real estate practices."
  },
  {
    question: "How quickly can we implement TinkerVoice in our real estate agency?",
    answer: "TinkerVoice offers rapid deployment with our no-code platform. Most real estate agencies can be up and running within 1-2 weeks, including MLS integration, CRM setup, staff training, and workflow optimization. Our dedicated real estate implementation team ensures smooth transition with minimal disruption to daily operations."
  },
  {
    question: "Does TinkerVoice support multilingual communication for diverse real estate markets?",
    answer: "Yes, TinkerVoice supports over 100 languages and dialects, making it ideal for diverse real estate markets. The AI can automatically detect customer language preferences, provide culturally appropriate responses, and ensure accurate translation of complex real estate terminology for better customer understanding and service delivery."
  }
];

export function RealEstateFaqSection() {
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
            Frequently Asked Questions About AI Voice Agents in Real Estate
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to common questions about implementing conversational AI in your real estate business
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
