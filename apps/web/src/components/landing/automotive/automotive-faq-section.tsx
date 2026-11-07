"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does TinkerVoice integrate with automotive DMS and CRM systems?",
    answer: "TinkerVoice offers seamless integration with leading automotive DMS and CRM systems including CDK Global, Reynolds & Reynolds, DealerSocket, and more. Our API-first approach allows real-time data synchronization for customer history, VIN information, service records, and appointment scheduling. The AI can pull relevant customer data during calls to provide personalized service and accurate information."
  },
  {
    question: "Can TinkerVoice handle test drive scheduling and service appointment booking?",
    answer: "Yes, TinkerVoice excels at automated test drive scheduling and service appointment booking. The AI can check real-time availability, coordinate with your service department, send automated reminders, and even reschedule appointments based on customer preferences. It reduces no-shows by 40% through intelligent follow-up and confirmation processes."
  },
  {
    question: "How does the AI qualify leads for automotive sales?",
    answer: "TinkerVoice uses advanced AI to qualify leads by asking targeted questions about budget, timeline, vehicle preferences, trade-in status, and financing needs. It can identify high-intent customers, capture key information, and route qualified leads to the appropriate sales team member. The system learns from your best practices to continuously improve lead qualification accuracy."
  },
  {
    question: "Is TinkerVoice compliant with automotive industry regulations and TCPA?",
    answer: "Absolutely. TinkerVoice is fully TCPA compliant with built-in consent management, local caller ID capabilities, and automatic opt-out handling. We maintain SOC 2 Type II certification and follow automotive industry best practices for data security and customer privacy. All call recordings and customer data are handled according to strict compliance standards."
  },
  {
    question: "How quickly can we implement TinkerVoice in our automotive dealership?",
    answer: "TinkerVoice offers rapid deployment with our no-code configuration platform. Most automotive dealerships can be up and running within 2-3 weeks, including DMS integration, staff training, and workflow optimization. Our dedicated automotive implementation team ensures smooth transition with minimal disruption to your daily operations."
  },
  {
    question: "What kind of analytics and reporting does TinkerVoice provide for automotive businesses?",
    answer: "TinkerVoice provides comprehensive analytics including call volume metrics, lead conversion rates, test drive scheduling success rates, customer satisfaction scores, and sales performance tracking. You can monitor which campaigns are most effective, track ROI, and get insights into customer behavior patterns. All data is available in real-time dashboards with customizable reporting."
  }
];

export function AutomotiveFaqSection() {
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
            Frequently Asked Questions About AI Voice Agents in Automotive
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to common questions about implementing conversational AI in your automotive dealership
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
