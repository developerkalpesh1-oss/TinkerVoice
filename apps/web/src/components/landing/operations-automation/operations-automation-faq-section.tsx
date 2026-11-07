"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function OperationsAutomationFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question:
        "How does TinkerVoice's AI handle complex operational workflows across different industries?",
      answer:
        "TinkerVoice's AI voice agents are designed to handle complex operational workflows by integrating with existing systems and databases. They can automate inventory management, coordinate supplier communications, manage patient intake processes, handle KYC verification, track property listings, schedule service appointments, confirm bookings, manage enrollment processes, assign technicians, and automate subscription workflows across retail, healthcare, financial services, real estate, automotive, travel, education, home services, SaaS, logistics, HR, and manufacturing industries.",
    },
    {
      question:
        "What security measures are in place for handling sensitive operational data?",
      answer:
        "TinkerVoice implements enterprise-grade security measures including SOC2, HIPAA, and PCI compliance for data protection. All sensitive operational data is encrypted in transit and at rest, with strict access controls, audit trails, and compliance with industry regulations. The system maintains 99.9% uptime and sub-500ms latency while ensuring complete data privacy and security for all operational automation activities.",
    },
    {
      question:
        "Can the AI voice agents integrate with existing operational systems and workflows?",
      answer:
        "Yes, TinkerVoice's AI voice agents can seamlessly integrate with existing operational systems, ERP platforms, CRM systems, and databases through APIs and webhooks. Our forward-deployed team ensures smooth integration with your current workflow, maintaining data consistency and providing real-time access to operational information. The system supports popular business platforms, inventory management systems, and custom operational solutions.",
    },
    {
      question:
        "How does the system handle multi-language support for global operations?",
      answer:
        "TinkerVoice supports over 50 languages and can automatically detect the customer's preferred language, ensuring seamless communication for global operations. The AI can handle complex multilingual conversations, maintain context across language switches, and provide culturally appropriate responses for international business operations.",
    },
    {
      question:
        "What kind of analytics and reporting are available for operational automation?",
      answer:
        "TinkerVoice provides comprehensive analytics including operational efficiency metrics, automation rates, cost savings, response times, and customer satisfaction scores. The platform offers real-time dashboards, detailed reporting on operational workflows, and insights into process optimization opportunities. All interactions are logged and analyzed to continuously improve operational automation performance.",
    },
    {
      question:
        "How quickly can operational automation be deployed across different departments?",
      answer:
        "TinkerVoice can be deployed in days, not months. Our platform includes pre-built templates for common operational scenarios, easy-to-use configuration tools, and rapid integration capabilities. The forward-deployed team ensures quick setup and customization for your specific operational needs, with most deployments going live within 1-2 weeks.",
    },
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
          className="relative mx-auto max-w-2xl mb-12 flex flex-col items-center"
        >
          <div className="relative z-10 flex flex-col items-center">
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
              Get answers about AI voice agents transforming operational automation.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}
          ></div>
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
