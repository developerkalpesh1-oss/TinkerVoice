"use client";

import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Users, Clock, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export function EcommerceBenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: "No-Code Builder",
      description: "Rapid deployment with our intuitive visual builder. No technical expertise required to set up and customize your AI voice agents.",
      stat: "Deploy in < 1 week"
    },
    {
      icon: Shield,
      title: "Real-Time Integrations",
      description: "Seamlessly connect with your existing commerce and helpdesk stack. Works with Shopify, WooCommerce, Zendesk, and 200+ other platforms.",
      stat: "200+ Integrations"
    },
    {
      icon: BarChart3,
      title: "Analytics Out of the Box",
      description: "Comprehensive analytics and insights to inform your strategy. Track performance, customer satisfaction, and ROI in real-time.",
      stat: "Real-time Insights"
    },
    {
      icon: Users,
      title: "Cut Costs & Scale",
      description: "Reduce operational costs while scaling your customer support. Handle more inquiries without adding headcount.",
      stat: "60% Cost Reduction"
    },
    {
      icon: Clock,
      title: "Speed Up Response",
      description: "Instant responses to customer queries. Reduce wait times and improve customer satisfaction with sub-second response times.",
      stat: "< 500ms Response"
    },
    {
      icon: DollarSign,
      title: "Grow Revenue",
      description: "Increase conversions through guided selling, cart recovery, and proactive customer engagement. Drive more sales with AI-powered insights.",
      stat: "40% Revenue Growth"
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
              className="font-geist mt-4 text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4"
            >
              Why Choose TinkerVoice for Retail & E-commerce?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto"
            >
              Cut costs, speed up response, and grow revenue without adding headcount.
              TinkerVoice provides everything you need to transform your e-commerce customer experience.
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
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.li
                  key={index}
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

                  {/* Stat badge in top-right corner */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                      {benefit.stat}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="text-primary w-fit transform-gpu rounded-full border p-4 mb-6 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                      <Icon
                        className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-4">
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

        {/* Additional Benefits - Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
              <h3 className="text-2xl font-bold text-white mb-4">
                Enterprise-Grade Security & Compliance
              </h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
                Built with enterprise-grade security, TinkerVoice ensures your customer data is protected
                with SOC 2 compliance, end-to-end encryption, and GDPR compliance.
              </p>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">1000+</div>
                <div className="text-white/80">E-commerce Brands</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">5M+</div>
                <div className="text-white/80">Customer Interactions</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">40%</div>
                <div className="text-white/80">Average Revenue Growth</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
