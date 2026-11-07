"use client";

import { motion } from "framer-motion";
import { Headphones, TrendingUp, Calendar, Users, Settings, Shield } from "lucide-react";
import Image from "next/image";
import financialServicesImages from "@/data/industries/financial-services-images.json";

export function FinancialServicesBenefitsSection() {
  const useCases = [
    {
      icon: Headphones,
      title: "Customer Support",
      description: "AI agents handle FAQs, account inquiries, and transaction status updates 24/7, cutting wait times and boosting satisfaction. They can also triage complex issues and route them with full context to human advisors."
    },
    {
      icon: TrendingUp,
      title: "Sales & Lead Generation",
      description: "Voice agents qualify prospects by verifying needs and financial eligibility, then pass warm leads to sales reps. They can also follow up on interest shown in loans, cards, or investment products."
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Agents seamlessly book meetings with financial advisors, loan officers, or wealth managers. They also send proactive reminders to reduce missed consultations."
    },
    {
      icon: Settings,
      title: "Operations",
      description: "AI agents streamline routine tasks like payment reminders, KYC verification, and policy renewals. They free up staff time while ensuring compliance and consistency."
    },
    {
      icon: Users,
      title: "Recruiting",
      description: "Voice agents screen applicants by asking predefined questions and assessing basic eligibility. They can schedule interviews and provide status updates, improving candidate experience."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-geist text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4"
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
              TinkerVoice transforms every aspect of financial services operations, from customer support to
              sales and compliance, delivering measurable results across your organization.
            </motion.p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Use Cases Grid - Left Half */}
          <div className="space-y-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    default: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
                    y: { duration: 0.2, ease: "easeOut" }
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group relative transform-gpu rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                  <div className="relative z-10 flex items-start">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-3 mr-4 flex-shrink-0 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <Icon className="h-5 w-5 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className="font-geist text-lg font-bold tracking-tighter text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                        {useCase.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm transition-colors duration-200 ease-out group-hover:text-foreground/80">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Image Placeholder - Right Half */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <Image
              src={financialServicesImages.useCases.url}
              alt={financialServicesImages.useCases.alt}
              width={500}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>

        {/* Why TinkerVoice Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h3 className="font-geist text-3xl font-bold tracking-tighter text-foreground mb-4">
                Why TinkerVoice for Financial Services
              </h3>
              <p className="font-geist text-lg text-muted-foreground max-w-4xl mx-auto">
                TinkerVoice offers a no-code builder, rapid go-live, and seamless integrations with core/LOS/LMS/CRM systems.
                Our solutions support local languages and provide analytics out of the box, ensuring compliance with regulatory
                requirements, including consent and DNC/TCPA management, PCI-aware call flows, and SOC 2/ISO 27001 alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                  <TrendingUp className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>
                <h4 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">Lower Cost-to-Serve</h4>
                <p className="text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">Reduce operational costs while improving service quality</p>
              </motion.div>

              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                  <Shield className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>
                <h4 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">Faster Growth</h4>
                <p className="text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">Accelerate customer acquisition and retention</p>
              </motion.div>

              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                  <Users className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>
                <h4 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">Higher NPS</h4>
                <p className="text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">Deliver exceptional customer experiences without adding headcount</p>
              </motion.div>
            </div>
          </motion.div>
      </div>
    </section>
  );
}
