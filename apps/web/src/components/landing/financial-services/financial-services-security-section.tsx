"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const complianceStandards = [
  {
    name: "PCI DSS",
    description: "Payment card industry security standards",
    status: "Level 1",
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
    name: "DNC/TCPA",
    description: "Do not call and telephone consumer protection act",
    status: "Managed",
  },
];

export function FinancialServicesSecuritySection() {

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
              TinkerVoice provides enterprise-grade security and compliance features specifically designed
              for financial services organizations handling sensitive customer data and transactions.
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

        {/* Compliance Certifications */}
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
              Compliance Certifications &amp; Standards
            </h3>
            <p className="text-lg text-foreground/70">
              TinkerVoice meets the highest industry standards for financial services data security and regulatory compliance.
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
      </div>
    </section>
  );
}
