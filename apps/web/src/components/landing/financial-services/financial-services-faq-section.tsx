"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

  const faqs = [
    {
      question: "How does TinkerVoice ensure PCI DSS compliance for financial services?",
      answer: "TinkerVoice is fully PCI DSS Level 1 compliant with comprehensive security controls, encrypted data transmission, secure payment processing, and complete audit trails. We maintain SOC 2 Type II certification and follow strict data handling protocols to protect sensitive financial information and customer data."
    },
    {
      question: "Can TinkerVoice integrate with our existing core banking systems and CRM?",
      answer: "Yes, TinkerVoice offers native integrations with leading core banking systems, LOS/LMS platforms, and CRM systems. Our API-first approach allows seamless data synchronization for customer profiles, transaction history, account information, and real-time updates across all your existing financial technology stack."
    },
    {
      question: "How does the AI handle complex financial queries and regulatory compliance?",
      answer: "TinkerVoice uses advanced AI with financial domain expertise to handle complex queries about accounts, transactions, loans, and investments. The system is trained on regulatory requirements and can provide compliant responses while maintaining audit trails for all customer interactions and ensuring adherence to financial regulations."
    },
    {
      question: "What security measures are in place for handling sensitive financial data?",
      answer: "We implement enterprise-grade security including end-to-end encryption, secure authentication, fraud detection, real-time monitoring, and comprehensive audit logs. All data is stored in PCI DSS compliant data centers with regular security assessments, penetration testing, and compliance monitoring to protect sensitive financial information."
    },
    {
      question: "How quickly can we implement TinkerVoice in our financial institution?",
      answer: "TinkerVoice offers rapid deployment with our no-code configuration platform. Most financial institutions can be up and running within 2-4 weeks, including core system integration, compliance setup, staff training, and workflow optimization. Our dedicated financial services implementation team ensures smooth transition with minimal disruption to operations."
    },
    {
      question: "Does TinkerVoice support multilingual customer service for diverse banking customers?",
      answer: "Yes, TinkerVoice supports over 100 languages and dialects, making it ideal for diverse customer bases. The AI can automatically detect customer language preferences, provide culturally appropriate financial guidance, and ensure accurate translation of complex banking terminology for better customer understanding and service delivery."
    }
  ];

export function FinancialServicesFaqSection() {
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
            Frequently Asked Questions About AI Voice Agents in Financial Services
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to common questions about implementing conversational AI in your financial services business
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
