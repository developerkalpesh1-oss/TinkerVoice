"use client";

import { motion } from "framer-motion";
import { Package, Truck, RotateCcw } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
import transcript from "@/data/use-cases/order-status-returns.json";
import AudioPlayer from "react-h5-audio-player";
import { Player } from "@/components/audioPlayer";
import { TypingTranscript, type TranscriptLine } from "@/components/TypingTranscript";
import { useEffect, useState, useRef } from "react";
import { REGISTER_URL } from "@/lib/links";

const audioUrl = transcript.orderstatusreturns;

export function OrderStatusReturnsHeroSection() {
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
          {/* Left Half - Text Content */}
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
              Streamline Order Status and Returns with{" "}
              <span className="text-primary">TinkerVoice&apos;s AI Voice Agents</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-8 text-muted-foreground mb-10"
            >
              TinkerVoice&apos;s AI voice agents revolutionize order status updates and returns across industries,
              empowering businesses to deliver exceptional customer experiences. By deploying voice agents that
              provide real-time updates and simplify resolution, companies can enhance customer satisfaction,
              reduce operational costs, and improve overall efficiency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-start mb-6"
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

            {/* Key Features - Minimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Automated Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Easy Returns</span>
              </div>
            </motion.div>
          </div>

          {/* Right Half - AUDIO + TRANSCRIPT */}
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
      </div>
    </section>
  );
}