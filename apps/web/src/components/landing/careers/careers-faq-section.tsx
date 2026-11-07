"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

const careersFaqs = [
  {
    id: "1",
    question: "What skills are required for AI voice agent development roles?",
    answer: "AI voice agent development requires expertise in natural language processing, machine learning, Python/JavaScript programming, cloud platforms (AWS/Azure), and experience with voice technologies like speech recognition and text-to-speech systems. Knowledge of conversational AI frameworks and API integration is also valuable."
  },
  {
    id: "2",
    question: "What career growth opportunities exist in AI voice technology?",
    answer: "AI voice technology offers diverse career paths including AI/ML Engineer, Voice UX Designer, Conversational AI Specialist, Product Manager, and Technical Lead roles. You can advance from junior developer to senior architect, team lead, or even CTO positions while working on cutting-edge voice automation solutions."
  },
  {
    id: "3",
    question: "How does TinkerVoice support professional development and learning?",
    answer: "TinkerVoice provides comprehensive learning opportunities including level-up coaching, micro-mentorship programs, training workshops, conference attendance, and access to cutting-edge AI research. We encourage continuous learning and provide resources for skill development in voice technology and AI innovation."
  },
  {
    id: "4",
    question: "What is the work culture like at TinkerVoice for remote and hybrid teams?",
    answer: "TinkerVoice offers flexible hybrid work arrangements that balance personal and professional life. Our culture emphasizes collaboration, innovation, and diversity. We host virtual team building events, social hours, and maintain strong communication channels to ensure all team members feel connected and engaged regardless of location."
  },
  {
    id: "5",
    question: "What benefits and perks does TinkerVoice offer to employees?",
    answer: "TinkerVoice provides comprehensive health & wellness benefits, competitive compensation, flexible work schedules, professional development opportunities, team building events, and a collaborative work environment. We also offer unique perks like wellness initiatives, charitable event participation, and access to cutting-edge AI technology."
  },
  {
    id: "6",
    question: "How can I apply for positions at TinkerVoice and what is the interview process?",
    answer: "You can apply for positions through our careers page or by contacting our HR team directly. Our interview process typically includes an initial screening, technical assessment, team interviews, and culture fit discussions. We value both technical skills and cultural alignment, looking for passionate individuals who want to shape the future of voice technology."
  }
];

export function CareersFaqSection() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto max-w-2xl"
          >
            <div
              className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
              }}
            />
            <h2 className="relative z-10 font-geist text-3xl font-light tracking-tighter text-foreground sm:text-4xl lg:text-5xl mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto"
          >
            Find answers to common questions about careers at TinkerVoice and working with AI voice technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {careersFaqs.map((faq, index) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  default: { duration: 0.6, delay: index * 0.05, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" }
                }}
                whileHover={{ y: -2 }}
                className={`group relative transform-gpu rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-primary/30 bg-card/80 shadow-[0_20px_60px_rgba(var(--primary-rgb),0.15)] [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]'
                    : 'border-border/70 bg-card/50 hover:border-primary/20 hover:bg-card/70 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.12)_inset]'
                }`}
                style={{ minHeight: '88px' }}
              >
                {/* Subtle distributed glow when open */}
                {isOpen && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300"
                    style={{
                      background: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.06) 0%, rgba(var(--primary-rgb), 0.03) 40%, transparent 70%)",
                    }}
                  />
                )}

                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="relative z-10 flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-primary/5"
                >
                  <h3 className={`text-base sm:text-lg font-medium pr-4 transition-colors duration-200 ${
                    isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'
                  }`}>
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                      <MinusIcon className="h-5 w-5 text-primary transition-transform duration-200" />
                    ) : (
                      <PlusIcon className="h-5 w-5 text-primary transition-transform duration-200" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/50 px-6 pb-6 pt-4">
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-6">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link href="/company/contact">
            <Button
              variant="outline"
              className="relative overflow-hidden rounded-full border border-border px-8 py-4 text-foreground shadow-lg transition-all duration-300 bg-card/50 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
            >
              Contact HR Team
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

