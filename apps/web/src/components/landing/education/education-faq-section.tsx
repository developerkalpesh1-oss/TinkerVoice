"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How can AI Agents help EdTech companies improve student engagement?",
    answer: "TinkerVoice's AI Agents provide instant responses to student queries, share relevant course details, and send reminders for live classes, assignments, or exams—keeping learners consistently engaged and informed."
  },
  {
    question: "Can TinkerVoice assist with admission and onboarding processes?",
    answer: "Yes. TinkerVoice automates the entire admissions journey—from answering FAQs, collecting documents, scheduling counselling calls, to sharing personalised course recommendations based on student goals."
  },
  {
    question: "Is TinkerVoice suitable for both live and recorded learning platforms?",
    answer: "Absolutely. Whether it's a MOOC, hybrid model, or coaching institute, TinkerVoice supports automated chat and voice interactions that cater to enrolment queries, course access issues, or technical troubleshooting."
  },
  {
    question: "How does AI support parent communication in K-12 EdTech?",
    answer: "With TinkerVoice, schools and learning platforms can send updates on student performance, fee reminders, or schedule changes via WhatsApp and chat, offering parents real-time, convenient support."
  },
  {
    question: "What integrations are supported for learning platforms?",
    answer: "TinkerVoice integrates with CRMs, LMS tools, payment gateways, and video conferencing platforms, allowing seamless data exchange to personalise and automate support journeys."
  },
  {
    question: "How do AI Agents reduce load on academic counsellors and support teams?",
    answer: "By automating repetitive queries and triaging complex cases to human agents, TinkerVoice helps EdTech companies scale without compromising on support quality—especially during admission cycles or batch launches."
  },
  {
    question: "Can TinkerVoice handle exam scheduling and academic calendar management?",
    answer: "Yes. TinkerVoice can automatically inform students about upcoming exams, class schedules, assignment deadlines, and academic events through multiple channels, ensuring no important information is missed."
  },
  {
    question: "How does TinkerVoice support multilingual education platforms?",
    answer: "TinkerVoice supports multiple languages, making it ideal for international education platforms and institutions serving diverse student populations. It can provide localized support in students' preferred languages."
  }
];

export function EducationFaqSection() {
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
            Frequently Asked Questions About AI Voice Agents in Education
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            Get answers to common questions about implementing conversational AI in your educational institution
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
