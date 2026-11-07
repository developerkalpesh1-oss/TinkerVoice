'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Img from "@/data/company/about-us.json";

export function AboutUsHeroSection() {
  return (
    <section className="relative pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left – Content */}
          <div className="text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-geist text-4xl font-light tracking-tighter text-foreground md:text-6xl mb-6"
            >
              Revolutionizing Your Business Operations with{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AI-Powered Voice Automation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-8 text-muted-foreground max-w-4xl"
            >
              TinkerVoice empowers businesses across industries to automate operations and boost efficiency through
              intelligent AI voice agents. From handling appointment scheduling in healthcare to streamlining loan
              inquiries in financial services, managing order updates in retail, or assisting customers in
              e-commerce, TinkerVoice brings real-time, human-like automation to every interaction. Our voice-driven
              solutions reduce manual workload, cut response times, and deliver consistent, personalized experiences —
              helping teams focus on what truly drives growth.
            </motion.p>
          </div>

          {/* Right – Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-full overflow-hidden rounded-xl">
              <Image
                src={Img.hero.url}
                alt={Img.hero.alt}
                width={1200}
                height={450}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-xl shadow-2xl w-full h-auto object-cover object-center transition-transform duration-500 group-hover:scale-105"
                style={{ maxHeight: "450px" }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
