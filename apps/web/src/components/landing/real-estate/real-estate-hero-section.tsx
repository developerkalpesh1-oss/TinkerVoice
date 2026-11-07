"use client";

import { motion } from "framer-motion";
import { Home, MessageCircle, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";

import { Player } from "@/components/audioPlayer";
import { TypingTranscript, TranscriptLine } from "@/components/TypingTranscript";
import realEstateData from "@/data/industries/real-estate-images.json";
import { REGISTER_URL } from "@/lib/links";

function normalizeTranscript(
  transcript: { time: number; speaker: string; text: string }[]
): TranscriptLine[] {
  return transcript.map((line) => ({
    ...line,
    speaker:
      line.speaker === "Agent" || line.speaker === "Customer"
        ? line.speaker
        : "Agent",
  }));
}

const transcript = normalizeTranscript(realEstateData.realEstate.transcript);
const audioUrl = realEstateData.realEstate.fileUrl;

export function RealEstateHeroSection() {
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

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          {/* LEFT — Content */}
          <div className="text-left relative">
            <div
              className="absolute -left-8 -top-8 h-32 w-32 blur-[80px] opacity-60"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.6) 4.54%, rgba(var(--primary-rgb), 0.35) 34.2%, rgba(var(--primary-rgb), 0.95) 77.55%)",
              }}
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-geist text-4xl font-light tracking-tighter text-foreground sm:text-5xl lg:text-6xl mb-6 relative z-10"
            >
              Transform Real Estate Engagement with{" "}
              <span className="text-primary">TinkerVoice AI Agents</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-8 text-muted-foreground mb-10"
            >
              Reimagine property interactions with TinkerVoice&apos;s AI-powered
              voice agents. From answering buyer inquiries and scheduling property
              tours to streamlining tenant support and follow-ups, our solutions
              help real estate companies boost efficiency, close deals faster,
              and deliver a superior customer experience at every touchpoint.
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
                dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 dark:border-white/10
                dark:hover:border-primary/30 dark:hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
              >
                Book a Free Demo
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — AUDIO + TRANSCRIPT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative flex flex-col gap-4"
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
                  transcript={transcript}
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

        {/* Stats + Features */}
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
                24/7
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                Customer Support
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                +40%
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                Lead Conversion
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                -60%
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                No-Shows
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 transition-colors duration-300 group-hover:text-primary/80">
                MLS
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                Integrated
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
                <MessageCircle className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                24/7 Concierge
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                Instant answers to listing questions and property details
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
                Lead Generation
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                AI-powered callback system for instant lead response
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center group"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                <Calendar className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                Smart Scheduling
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                One-call booking for tours and appointments
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center group"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 transition-all duration-200 ease-out group-hover:bg-primary/20 group-hover:scale-110">
                <Home className="h-8 w-8 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-200 ease-out group-hover:text-primary">
                Property Management
              </h3>
              <p className="text-sm text-muted-foreground text-center transition-colors duration-200 ease-out group-hover:text-foreground/80">
                Streamlined operations and maintenance coordination
              </p>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}