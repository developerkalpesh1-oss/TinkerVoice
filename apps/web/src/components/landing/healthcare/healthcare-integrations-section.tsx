"use client";

import { motion } from "framer-motion";
import { Zap, Phone, Database, Users, Settings } from "lucide-react";

export function HealthcareIntegrationsSection() {
  const integrationCategories = [
    {
      icon: Phone,
      title: "Telephony Platforms",
      description: "Connect with leading telephony providers",
      integrations: ["Genesys", "Twilio", "Avaya", "Five9", "RingCentral", "Vonage"]
    },
    {
      icon: Database,
      title: "CRM Systems",
      description: "Seamless integration with customer relationship management",
      integrations: ["Salesforce", "HubSpot", "Zendesk", "Microsoft Dynamics", "Pipedrive", "Freshworks"]
    },
    {
      icon: Users,
      title: "Helpdesk Systems",
      description: "Connect with support and ticketing platforms",
      integrations: ["Freshdesk", "ServiceNow", "Jira", "Zendesk Support", "Intercom", "Help Scout"]
    },
    {
      icon: Settings,
      title: "Healthcare Systems",
      description: "Native integration with EHR and healthcare platforms",
      integrations: ["Epic", "Cerner", "athenahealth", "Allscripts", "NextGen", "eClinicalWorks"]
    }
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center mb-16">
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl"
            >
              Integrations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto"
            >
              Connect TinkerVoice to your CRM, telephony, and tools with enterprise-grade APIs and
              out-of-the-box integrations. We work with leading platforms to ensure seamless connectivity.
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
          <ul className="grid gap-8 lg:grid-cols-2 mb-16">
            {integrationCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.li
                  key={category.title}
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
                    <div className="flex items-center mb-6">
                      <div className="text-primary w-fit transform-gpu rounded-full border p-4 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset] mr-4">
                        <Icon className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                      </div>
                      <div>
                        <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                          {category.title}
                        </h3>
                        <p className="text-muted-foreground text-sm transition-colors duration-200 ease-out group-hover:text-foreground/80">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {category.integrations.map((integration) => (
                        <div
                          key={integration}
                          className="transform-gpu rounded-lg border border-border bg-transparent p-3 text-center transition-all duration-200 ease-out group-hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.12)_inset]"
                        >
                          <span className="text-sm font-medium text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                            {integration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* API Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 relative overflow-hidden rounded-2xl bg-primary p-8 lg:p-12"
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

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="text-primary-foreground w-fit mx-auto transform-gpu rounded-full border border-primary-foreground/30 p-4 mb-6 bg-primary-foreground/10">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Enterprise-Grade APIs
              </h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Build custom integrations with our comprehensive REST APIs. Update routing logic,
                manage call flows, and sync data in real-time with your existing healthcare systems.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="text-3xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white/80">99.9%</div>
                <div className="text-sm text-white/80 transition-colors duration-300 group-hover:text-white">API Uptime</div>
              </motion.div>
              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="text-3xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white/80">&lt;100ms</div>
                <div className="text-sm text-white/80 transition-colors duration-300 group-hover:text-white">Response Time</div>
              </motion.div>
              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="text-3xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white/80">24/7</div>
                <div className="text-sm text-white/80 transition-colors duration-300 group-hover:text-white">API Support</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
