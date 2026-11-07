'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Img from "@/data/company/about-us.json";

export function AboutUsJourneySection() {
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
            <h2 className="font-geist text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
              Why TinkerVoice
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Our mission is to empower businesses with AI-driven voice solutions that enhance customer engagement, streamline operations, and drive growth.
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background/80 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] hover:shadow-primary/50 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 rounded-b-3xl bg-gradient-to-t from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-foreground/75 mb-6 leading-relaxed">
                TinkerVoice was founded in 2020 by Rahul Agarwal with a vision to help organizations reach their full
                potential by automating repetitive tasks and enabling teams to focus on what truly matters. Inspired by
                the startup spirit, Rahul recognized how businesses were spending excessive resources on manual,
                time-consuming operations that could be efficiently handled through AI automation.
              </p>
              <p className="text-lg text-foreground/75 leading-relaxed">
                Since its inception, TinkerVoice has been dedicated to transforming customer and operational experiences
                through AI-powered voice agents. From scheduling and support in healthcare, to inquiries in financial
                services, order management in retail, and assistance in e-commerce — TinkerVoice empowers businesses
                across industries to operate smarter, faster, and more efficiently.
              </p>
            </div>
            <div className="relative">
              <div className="relative h-80 overflow-hidden rounded-3xl border border-border/70 bg-background/80 shadow-[0_22px_70px_rgba(15,23,42,0.7)] backdrop-blur-xl">
                <Image
                  src={Img.useCases1.url}
                  alt={Img.useCases1.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
