"use client";

import { motion } from "framer-motion";
import { MessageSquare, ShoppingBag, Users, Truck, CheckCircle } from "lucide-react";
import Image from "next/image";
import ecommerceImages from "@/data/industries/e-commerce-images.json";




export function EcommerceFeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Transform Customer Support with AI-Driven Insights",
      description: "Deflect 'Where's my order?' and other common queries with instant, 24/7 multilingual support for WISMO, returns, exchanges, warranty, store hours, and policies. Smart escalations ensure seamless handoffs to agents with full context, reducing wait times and AHT while boosting CSAT.",
      image: ecommerceImages.customerSupport.url,
      imageAlt: ecommerceImages.customerSupport.alt,
      benefits: [
        "24/7 multilingual customer support",
        "Instant query resolution",
        "Smart escalation to human agents",
        "Reduced wait times and AHT"
      ]
    },
    {
      icon: ShoppingBag,
      title: "Boost Sales & Lead Generation with Conversational AI",
      description: "Guided selling on calls helps shoppers find the right product, checks stock, and answers FAQs in real-time, driving conversions. Recover lost revenue with proactive callbacks and SMS for cart and checkout drop-offs, offering promos or alternatives. Capture and qualify leads, pushing them to your CRM and booking follow-ups to fuel your sales pipeline.",
      image: ecommerceImages.boostSales.url,
      imageAlt: ecommerceImages.boostSales.alt,
      benefits: [
        "Guided product recommendations",
        "Real-time stock checking",
        "Cart abandonment recovery",
        "Lead qualification and CRM integration"
      ]
    },
    {
      icon: Users,
      title: "Revolutionize Recruiting with AI-Powered Screening",
      description: "Pre-qualify hourly roles on location, shift, and eligibility with always-on screening. Automated scheduling books interviews directly on hiring managers' calendars, accelerating the hiring process.",
      image: ecommerceImages.recruitingScreening.url,
      imageAlt: ecommerceImages.recruitingScreening.alt,
      benefits: [
        "Automated candidate screening",
        "Location and shift matching",
        "Direct calendar integration",
        "Accelerated hiring process"
      ]
    },
    {
      icon: Truck,
      title: "Optimize Operations with Conversational AI",
      description: "Coordinate deliveries with automated confirmations, handling failed deliveries, and rescheduling. Support store and supply chain operations with inventory checks, vendor follow-ups, recall notifications, and SLA nudges. Capture VoC with post-purchase NPS/CSAT calls, triggering workflows for service recovery or upsell.",
      image: ecommerceImages.operations.url,
      imageAlt: ecommerceImages.operations.alt,
      benefits: [
        "Automated delivery coordination",
        "Inventory and supply chain support",
        "Post-purchase feedback collection",
        "Service recovery automation"
      ]
    }
  ];

  return (
    <section className="relative py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-normal tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4">
              Comprehensive E-commerce Solutions
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              From customer support to sales optimization, TinkerVoice provides end-to-end conversational AI solutions
              tailored for e-commerce businesses of all sizes.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}></div>
        </motion.div>
        <hr className="bg-foreground/30 mx-auto mb-12 h-px w-1/2" />

        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl p-8 transition-all duration-300 ease-out border border-transparent hover:border-primary/20 hover:bg-gradient-to-br hover:from-primary/5 hover:via-transparent hover:to-primary/5 hover:shadow-xl hover:shadow-primary/10 ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center mb-6">
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 mr-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
                  </div>
                  <h3 className="font-geist text-2xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-out group-hover:text-primary">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed transition-colors duration-300 ease-out group-hover:text-foreground/90">
                  {feature.description}
                </p>

                <div className="space-y-3">
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110" />
                        <span className="text-muted-foreground transition-colors duration-300 ease-out group-hover:text-foreground/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-out group-hover:shadow-primary/20 group-hover:scale-[1.02]">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt || `${feature.title} illustration`}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
