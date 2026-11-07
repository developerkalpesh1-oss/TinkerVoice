"use client";

import { motion } from "framer-motion";
import { Heart, Users, TrendingUp, CheckCircle } from "lucide-react";

const complianceStandards = [
  {
    name: "HIPAA",
    description: "Healthcare data protection compliance",
    status: "Compliant",
  },
  {
    name: "SOC 2",
    description: "Security, availability, and confidentiality controls",
    status: "Type II",
  },
  {
    name: "ISO 27001",
    description: "Information security management",
    status: "Certified",
  },
  {
    name: "GDPR",
    description: "General data protection regulation compliance",
    status: "Compliant",
  },
  {
    name: "CCPA",
    description: "California consumer privacy act compliance",
    status: "Compliant",
  },
  {
    name: "BAA",
    description: "Business associate agreement",
    status: "Available",
  },
];

export function HealthcareSecuritySection() {
  // const securityFeatures = [
  //   {
  //     icon: Shield,
  //     title: "HIPAA Compliance",
  //     description: "Full compliance with Health Insurance Portability and Accountability Act requirements."
  //   },
  //   {
  //     icon: Lock,
  //     title: "Business Associate Agreement",
  //     description: "Comprehensive BAA to ensure proper handling of protected health information."
  //   },
  //   {
  //     icon: FileCheck,
  //     title: "PHI Redaction",
  //     description: "Automatic redaction of protected health information from call recordings and transcripts."
  //   },
  //   {
  //     icon: Eye,
  //     title: "Consent Capture",
  //     description: "Automated consent management for recording and data processing activities."
  //   },
  //   {
  //     icon: Database,
  //     title: "Full Audit Logs",
  //     description: "Complete audit trail for all data access, modifications, and system activities."
  //   },
  //   {
  //     icon: CheckCircle,
  //     title: "Enterprise Security",
  //     description: "Top-tier data security and privacy protection with SOC 2 Type II certification."
  //   }
  // ];

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
              Security & Compliance
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto"
            >
              TinkerVoice provides enterprise-level security and compliance features specifically designed
              for healthcare organizations handling sensitive patient data.
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


        {/* Security Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="group relative mb-16 overflow-hidden rounded-3xl border border-border bg-transparent p-8 transition-all duration-300 hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] sm:p-10"
        >
          {/* Subtle gradient background on hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <div className="relative mb-8 text-center z-10">
            <h3 className="mb-3 text-2xl font-semibold text-foreground">
              Security Certifications &amp; Standards
            </h3>
            <p className="text-lg text-foreground/70">
              TinkerVoice meets the highest industry standards for healthcare data security.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 z-10">
            {complianceStandards.map((standard, index) => (
              <motion.div
                key={standard.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-transparent p-6 text-center transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="mb-2 text-lg font-bold tracking-tighter text-foreground">
                    {standard.name}
            </div>
                  <div className="mb-3 text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    {standard.description}
            </div>
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/25">
                    <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                    {standard.status}
            </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators - Stats Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 relative overflow-hidden rounded-2xl bg-primary p-8 lg:p-12"
        >
          <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
            <div className="absolute top-1/2 right-[-45%] aspect-square h-[800px] w-[800px] -translate-y-1/2">
              <div className="absolute inset-0 rounded-full bg-chart-2 opacity-30 dark:hidden"></div>
              <div className="absolute inset-0 scale-[0.8] rounded-full bg-chart-3 opacity-30 dark:hidden"></div>
              <div className="absolute inset-0 scale-[0.6] rounded-full bg-chart-4 opacity-30 dark:hidden"></div>
              <div className="absolute inset-0 rounded-full bg-chart-2 opacity-30 hidden dark:block"></div>
              <div className="absolute inset-0 scale-[0.8] rounded-full bg-chart-3 opacity-30 hidden dark:block"></div>
              <div className="absolute inset-0 scale-[0.6] rounded-full bg-chart-4 opacity-30 hidden dark:block"></div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Healthcare Organizations</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">2.5M+</div>
              <div className="text-white/80">Patient Interactions</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">60%</div>
              <div className="text-white/80">Scheduling Efficiency</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
