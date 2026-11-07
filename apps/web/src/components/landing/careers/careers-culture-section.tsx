"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users2, Globe, Heart } from "lucide-react";

export function CareersCultureSection() {
  return (
    <section id="careers-culture" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Diversity, Inclusion & Belonging
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto"
          >
            We&apos;re committed to creating an inclusive environment where everyone can thrive and bring their authentic selves to work.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative transform-gpu rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

              <div className="relative z-10 flex items-start space-x-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-200 ease-out group-hover:bg-primary/20 flex-shrink-0">
                  <Users2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 transition-colors duration-200 ease-out group-hover:text-primary">Inclusive Team</h3>
                  <p className="text-muted-foreground leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">We celebrate diversity and create an environment where everyone&apos;s unique perspective is valued and respected.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="group relative transform-gpu rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

              <div className="relative z-10 flex items-start space-x-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-200 ease-out group-hover:bg-primary/20 flex-shrink-0">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 transition-colors duration-200 ease-out group-hover:text-primary">Global Perspective</h3>
                  <p className="text-muted-foreground leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">Our team spans across continents, bringing together diverse cultures and experiences to build better products.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="group relative transform-gpu rounded-xl border border-border bg-transparent p-6 transition-all duration-200 ease-out hover:border-primary/30 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset] hover:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset]"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"></div>

              <div className="relative z-10 flex items-start space-x-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-200 ease-out group-hover:bg-primary/20 flex-shrink-0">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 transition-colors duration-200 ease-out group-hover:text-primary">Supportive Environment</h3>
                  <p className="text-muted-foreground leading-relaxed transition-colors duration-200 ease-out group-hover:text-foreground/80">We foster a culture of psychological safety where everyone can speak up, take risks, and grow together.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative w-full overflow-hidden rounded-xl">
              <Image
                src="/images/saas/saas-ai-dashboard.png"
                alt="TinkerVoice team culture and workplace environment"
                width={800}
                height={400}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-xl shadow-2xl w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-105"
                style={{ maxHeight: '400px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
