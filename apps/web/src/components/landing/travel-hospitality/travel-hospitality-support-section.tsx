'use client';

import { motion } from 'framer-motion';
import { Phone, ConciergeBell, Users } from 'lucide-react';
import Image from 'next/image';
import travelHospitalityImages from "@/data/industries/travel-hospitality-images.json";

const supportFeatures = [
  {
    icon: Phone,
    title: "24/7 Reservations Help",
    description: "Multilingual support with secure IDV for booking assistance around the clock",
    benefits: ["Instant booking support", "Multi-language assistance", "Secure payment processing", "Real-time availability"]
  },
  {
    icon: ConciergeBell,
    title: "Concierge Services",
    description: "Amenity requests, directions, and personalized recommendations for enhanced guest experience",
    benefits: ["Local recommendations", "Amenity requests", "Transportation assistance", "Event bookings"]
  },
  {
    icon: Users,
    title: "Smart Handoffs",
    description: "Seamless transfer to staff with complete itinerary and guest context to improve CSAT and reduce handle time",
    benefits: ["Context preservation", "Reduced wait times", "Improved satisfaction", "Efficient escalation"]
  }
];

export function TravelHospitalitySupportSection() {
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
              Enhancing Customer Support
            </h2>
            <p className="font-geist text-muted-foreground mt-3 max-w-3xl mx-auto">
              TinkerVoice offers comprehensive customer support solutions designed specifically for the travel and hospitality industry.
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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {supportFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group relative transform-gpu space-y-3 rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="text-primary w-fit transform-gpu rounded-full border p-3 transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-primary/10 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                          <Icon className="h-6 w-6 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-geist text-xl font-bold tracking-tighter text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {feature.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground/80">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto max-w-3xl">
              <Image
                src={travelHospitalityImages.customerSupport.url}
                alt={travelHospitalityImages.customerSupport.alt}
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-xl shadow-2xl w-full h-auto object-cover object-top"
                style={{ maxHeight: '600px' }}
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
