"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  CheckCircle,
  Eye,
  FileCheck,
  Server,
  Key,
} from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "SOC2 Compliance",
    description:
      "Meets the highest standards for security, availability, and confidentiality of customer data.",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Lock,
    title: "HIPAA Compliance",
    description:
      "Full compliance with healthcare data protection regulations for sensitive information handling.",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: FileCheck,
    title: "PCI DSS Compliance",
    description:
      "Secure handling of payment card data with industry-standard security measures.",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: Server,
    title: "Enterprise Infrastructure",
    description:
      "Robust, scalable infrastructure designed for enterprise-level security and performance.",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: Key,
    title: "End-to-End Encryption",
    description:
      "All data is encrypted in transit and at rest using industry-standard encryption protocols.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    icon: Eye,
    title: "Audit Trails",
    description:
      "Comprehensive logging and monitoring for complete visibility into system activities.",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
];

const complianceStandards = [
  {
    name: "SOC 2 Type II",
    description: "Security, availability, and confidentiality controls",
    status: "Certified",
  },
  {
    name: "HIPAA",
    description: "Healthcare data protection compliance",
    status: "Compliant",
  },
  {
    name: "PCI DSS Level 1",
    description: "Payment card industry security standards",
    status: "Certified",
  },
  {
    name: "GDPR",
    description: "General data protection regulation compliance",
    status: "Compliant",
  },
];

export function OrderStatusReturnsSecuritySection() {
  return (
    <section className="relative py-20 bg-background">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="mb-4 font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Enterprise-Grade Security &amp; Compliance
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-foreground/70">
              Your data security is our priority. TinkerVoice implements
              industry-leading security measures and compliance standards to
              protect your business and customer information.
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
        <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

        {/* Security Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mb-16"
        >
          {/* Soft outer glow */}
          <div className="pointer-events-none absolute -inset-4 bg-gradient-to-br from-primary/12 via-transparent to-primary/8 blur-3xl opacity-60" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  default: { duration: 0.6, delay: index * 0.1 },
                  y: { duration: 0.2, ease: "easeOut" }
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative transform-gpu space-y-4 rounded-xl border border-border/70 bg-background/80 p-8 transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.3)] [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="text-primary w-fit transform-gpu rounded-full border border-border/70 p-4 mb-6 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-primary/15 group-hover:border-primary/40 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
                  </div>

                  <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-300 ease-out group-hover:text-foreground/80">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compliance Standards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="group relative mb-16 overflow-hidden rounded-3xl border border-border bg-transparent p-8 transition-all duration-300 hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] sm:p-10"
        >
          {/* Subtle gradient background on hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <div className="relative mb-8 text-center">
            <h3 className="mb-3 text-2xl font-semibold text-foreground">
              Compliance &amp; Certifications
            </h3>
            <p className="text-lg text-foreground/70">
              Meeting the highest industry standards for data protection and
              security
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Security Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {/* Data Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-transparent p-8 transition-all duration-300 hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
          >
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center space-x-3">
                <div className="inline-flex items-center justify-center rounded-full border border-border bg-primary/10 p-3 transition-all duration-200 ease-out group-hover:scale-110 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                  <Shield className="h-7 w-7 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>
                <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground">
                  Data Protection
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    End-to-end encryption
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    Secure data transmission
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    Regular security audits
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    Access control management
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Infrastructure Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-transparent p-8 transition-all duration-300 hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
          >
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center space-x-3">
                <div className="inline-flex items-center justify-center rounded-full border border-border bg-primary/10 p-3 transition-all duration-200 ease-out group-hover:scale-110 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                  <Server className="h-7 w-7 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                </div>
                <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground">
                  Infrastructure Security
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    99.9% uptime guarantee
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    Multi-region redundancy
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    Automated backups
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">
                    24/7 monitoring
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
