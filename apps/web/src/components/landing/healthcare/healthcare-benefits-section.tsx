"use client";

import { motion } from "framer-motion";
import { CheckCircle, Phone, Clock, Users, TrendingUp, Stethoscope, Smile, Activity, Eye } from "lucide-react";

export function HealthcareBenefitsSection() {
  const benefits = [
    {
      icon: Phone,
      title: "Unified Call Flow",
      description: "Manage transfers across multiple clinics or offices with a single, system-wide routing logic."
    },
    {
      icon: Clock,
      title: "Always-On Patient Access",
      description: "Ensure patients reach the right location 24/7 with AI-powered call routing."
    },
    {
      icon: TrendingUp,
      title: "Reduced Call Drops",
      description: "Minimize transfers to incorrect clinics or closed locations, ensuring more connected patients and fewer abandoned calls."
    },
    {
      icon: Users,
      title: "Fewer Missed Calls, More Booked Appointments",
      description: "Keep patients on the line and connected to care with TinkerVoice's AI-driven call management."
    }
  ];

  const useCases = [
    {
      icon: Stethoscope,
      title: "Urgent Care Chains",
      description: "Quickly connect patients to the nearest clinic with AI-powered routing and scheduling."
    },
    {
      icon: Smile,
      title: "Dental Service Organizations",
      description: "Streamline scheduling, insurance, and office transfers in one efficient flow."
    },
    {
      icon: Activity,
      title: "Physical Therapy & Rehab",
      description: "Simplify routing for follow-ups, evaluations, and specialty care, reducing administrative burdens."
    },
    {
      icon: Eye,
      title: "Optical & Vision Care",
      description: "Direct callers to the right optometrist or benefits line instantly with AI-driven routing."
    }
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl"
            >
              Benefits of TinkerVoice for Healthcare
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto"
            >
              Transform your healthcare operations with AI-powered voice solutions that improve patient experience
              and operational efficiency.
            </motion.p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />

        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.li
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                    y: { duration: 0.2, ease: "easeOut" }
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group relative transform-gpu space-y-4 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <Icon
                        className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4 transition-colors duration-200 ease-out group-hover:text-primary">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                      {benefit.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl"
              >
                Use Cases
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto"
              >
                TinkerVoice serves diverse healthcare organizations with specialized solutions for different care settings.
              </motion.p>
            </div>
            <div
              className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
              }}></div>
          </div>
          <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />

          <div className="relative mt-12">
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {useCases.map((useCase, index) => {
                const Icon = useCase.icon;
                return (
                  <motion.li
                    key={useCase.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                      y: { duration: 0.2, ease: "easeOut" }
                    }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className="group relative transform-gpu space-y-4 rounded-xl border border-border bg-transparent p-8 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                    <div className="relative z-10">
                      <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                        <Icon
                          className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4 transition-colors duration-200 ease-out group-hover:text-primary">
                        {useCase.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">
                        {useCase.description}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        {/* Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl"
              >
                Case Studies
              </motion.h2>
            </div>
            <div
              className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
              }}></div>
          </div>
          <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-transparent p-8 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(var(--primary-rgb),0.35)] [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>

              {/* Tag on top right */}
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                  55% More Bookings
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 flex-shrink-0 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/35 group-hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)] group-hover:scale-110">
                    <CheckCircle className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
                  </div>
                  <h4 className="font-geist text-xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-out group-hover:text-primary ml-4">
                    Boosted Appointment Bookings
                  </h4>
                </div>
                <p className="text-muted-foreground leading-relaxed transition-colors duration-300 ease-out group-hover:text-foreground/90">
                  A healthcare network achieved a 55% increase in confirmed appointments and reduced no-shows by 30% using AI voice agents for patient reminders and scheduling.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-transparent p-8 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(var(--primary-rgb),0.35)] [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>

              {/* Tag on top right */}
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                  40% Faster Support
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 flex-shrink-0 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/35 group-hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)] group-hover:scale-110">
                    <Users className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
                  </div>
                  <h4 className="font-geist text-xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-out group-hover:text-primary ml-4">
                    Streamlined Patient Support
                  </h4>
                </div>
                <p className="text-muted-foreground leading-relaxed transition-colors duration-300 ease-out group-hover:text-foreground/90">
                  A hospital group reduced average call handling time by 40% and improved patient satisfaction scores by 25% by using TinkerVoice&apos;s voice agents to manage routine inquiries and follow-ups.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
