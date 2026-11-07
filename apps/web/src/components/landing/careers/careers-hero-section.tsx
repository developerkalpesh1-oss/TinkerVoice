"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Briefcase, Award, Rocket, Target, Sparkles, TrendingUp, Code, Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const floatingIcons = [
  { Icon: Briefcase, delay: 0, x: "10%", y: "20%" },
  { Icon: Users, delay: 0.2, x: "85%", y: "15%" },
  { Icon: Code, delay: 0.4, x: "15%", y: "75%" },
  { Icon: Award, delay: 0.6, x: "80%", y: "70%" },
  { Icon: Rocket, delay: 0.8, x: "5%", y: "50%" },
  { Icon: Target, delay: 1, x: "90%", y: "55%" },
  { Icon: TrendingUp, delay: 1.2, x: "25%", y: "10%" },
  { Icon: Lightbulb, delay: 1.4, x: "75%", y: "25%" },
  { Icon: Briefcase, delay: 1.6, x: "20%", y: "85%" },
  { Icon: Users, delay: 1.8, x: "70%", y: "80%" },
];

export function CareersHeroSection() {
  return (
    <>
      {/* Content Section - Full Screen Height */}
      <section className="relative w-full overflow-hidden pt-32 pb-10 font-light antialiased md:pt-20 md:pb-16 min-h-screen flex flex-col bg-background">
        <div className="absolute inset-0 overflow-hidden">
          {/* Background Gradients - Similar to industries page */}
          <div
            className="absolute -left-8 -top-8 h-96 w-96 blur-[120px] opacity-40"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 84.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}
          />
          <div
            className="absolute -right-8 -bottom-8 h-96 w-96 blur-[120px] opacity-40"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
            }}
          />

          {/* Floating decorative icons - Career themed */}
          {floatingIcons.map(({ Icon, delay, x, y }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.3, 0.5, 0.3, 0],
                scale: [0, 1, 1.2, 1, 0],
                y: [0, -20, -40, -20, 0],
              }}
              transition={{
                duration: 8,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute"
              style={{ left: x, top: y }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary/60" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content - Centered in viewport */}
        <div className="relative z-10 container mx-auto max-w-2xl px-4 text-center md:max-w-4xl md:px-6 lg:max-w-7xl flex-1 flex flex-col justify-center -mt-16 md:-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-800 p-4 shadow-lg shadow-primary/20">
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="mx-auto mb-6 max-w-4xl text-3xl font-light tracking-tighter md:text-4xl lg:text-6xl text-foreground font-geist"
            >
              Shape the Future of{" "}
              <span className="text-primary">AI Voice Technology</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mx-auto mb-10 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg"
            >
              Join innovators building the next generation of AI-powered voice agents.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Shape the future of voice technology</span>
            </motion.div>

            {/* Stats - Close together */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
            >
              {[
                { value: "50+", label: "Team Members" },
                { value: "12+", label: "Countries" },
                { value: "1000+", label: "Businesses Served" },
                { value: "99%", label: "Customer Satisfaction" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group px-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1 transition-colors duration-300 group-hover:text-primary/80">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80 whitespace-nowrap">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mb-10 flex flex-col items-center justify-center gap-4 sm:mb-0 sm:flex-row"
            >
              <Link
                href="#open-positions"
                className="relative w-full sm:w-auto overflow-hidden rounded-full border px-8 py-4 h-12 text-foreground shadow-lg transition-all duration-300
                          bg-gradient-to-b from-white/80 to-white/60 hover:border-gray-300 hover:shadow-md
                          dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 dark:border-white/10 dark:hover:border-primary/30 dark:hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]
                          flex items-center justify-center min-w-[200px]"
              >
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="relative w-full sm:w-auto overflow-hidden rounded-full border border-border px-8 py-4 h-12 text-foreground shadow-lg transition-all duration-300
                          bg-card/50 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]
                          flex items-center justify-center min-w-[200px]"
              >
                <Link href="#careers-culture">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Our Story
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image - Below the content section */}
      <section className="relative w-full py-10 md:py-16 bg-background">
        <motion.div
          className="container mx-auto max-w-2xl px-4 md:max-w-4xl md:px-6 lg:max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative z-10 mx-auto max-w-5xl rounded-2xl shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
            <div className="relative w-full overflow-hidden rounded-2xl group border border-border/50">
              <Image
                src="/images/analytics-dashboard.png"
                alt="TinkerVoice AI-powered voice agent careers and team collaboration"
                width={1200}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="rounded-2xl w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-105"
                style={{ aspectRatio: '20/10.5' }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Floating elements */}
              <div className="absolute top-8 left-8 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">Live Demo Available</span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Join 50+ Innovators</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
