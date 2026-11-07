"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import transcript from "@/data/use-cases/sales-lead-gen.json";
import AudioPlayer from "react-h5-audio-player";
import { Player } from "@/components/audioPlayer";
import { useEffect, useState, useRef } from "react";
import { TypingTranscript, type TranscriptLine } from "@/components/TypingTranscript";
import { REGISTER_URL } from "@/lib/links";
const audioUrl = transcript.saleslead;

export function SalesLeadGenHeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    const audio = audioRef.current?.audio.current;
    if (!audio) return;

    // 🔒 Disable autoplay completely
    audio.autoplay = false;
    audio.preload = "metadata";

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <section className="relative pt-32 pb-20 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Two-column hero layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left column - Content */}
          <div className="text-left relative">
            <div
              className="absolute -left-8 -top-8 h-32 w-32 blur-[80px] opacity-60"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
              }}
            ></div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-geist text-4xl font-light tracking-tighter text-foreground sm:text-5xl lg:text-6xl mb-6 relative z-10"
            >
              Sell Smarter and Faster with{" "}
              <span className="text-primary">AI Sales Agent</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-8 text-muted-foreground mb-10"
            >
              TinkerVoice AI Sales Agents handle lead qualification, follow-ups, and customer queries instantly, ensuring no opportunity is missed. With 24/7 availability and personalized conversations, they shorten sales cycles, boost conversions, and free your team to focus on closing high-value deals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-start"
            >
              <Link
                href={REGISTER_URL}
                className="relative w-full sm:w-auto overflow-hidden rounded-full border px-8 py-4 text-foreground shadow-lg transition-all duration-300
                           bg-gradient-to-b from-white/80 to-white/60 hover:border-gray-300 hover:shadow-md
                        dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 dark:border-white/10 dark:hover:border-primary/30 dark:hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
              >
                Book a Free Demo
              </Link>
            </motion.div>
          </div>

          {/* Right column - AUDIO + TRANSCRIPT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative flex flex-col gap-4 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="rounded-xl border border-border bg-muted p-4 shadow-xl">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Live AI Voice Demo
              </h3>

              {audioUrl ? (
                <Player ref={audioRef} src={audioUrl} />
              ) : (
                <div className="h-16 rounded-md bg-background/50 animate-pulse" />
              )}
            </div>

            <div className="rounded-xl border border-border bg-background shadow-lg">
              {audioUrl ? (
                <TypingTranscript
                  audioRef={audioRef}
                  transcript={transcript.transcript as TranscriptLine[]}
                  isPlaying={isPlaying}
                />
              ) : (
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-16"
          >
            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                40%
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                Lower Acquisition Costs
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                3x
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                Faster Conversions
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                85%
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                Lead Qualification
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                24/7
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                Sales Support
              </div>
            </motion.div>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              className="flex flex-col items-center group"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                <Target className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                Smart Lead Qualification
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                Identify high-intent prospects automatically
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center group"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                <TrendingUp className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                Drive Conversions
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                Turn conversations into sales with AI guidance
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center group"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                <Users className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                Personalized Recommendations
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                Tailored product suggestions for each customer
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center group"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                <DollarSign className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                Higher AOV
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                Increase average order value with upselling
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}