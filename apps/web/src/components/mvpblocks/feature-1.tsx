"use client";
import { Icons } from "@/components/icons";
import { motion } from "framer-motion";
import React, { useRef, useEffect, useCallback } from "react";
import {
  DeepgramLogo,
  ElevenlabsLogo,
  MicrosoftForStartups,
  NvidiaInception,
  Pinecone,
  Telnyx,
  Twilio,
} from "@/components/ui/partners";

import { cn } from "@/lib/utils";

const useAnimationFrame = (callback: (time: number, delta: number) => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let requestId: number;
    let previousTime: number | null = null;

    const animate = (time: number) => {
      if (previousTime !== null) {
        callbackRef.current(time, time - previousTime);
      }
      previousTime = time;
      requestId = requestAnimationFrame(animate);
    };

    requestId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);
};

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  speed?: number;
  vertical?: boolean;
  repeat?: number;
}

function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  speed = 50,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const singleContentBlockRef = useRef<HTMLDivElement | null>(null);
  const animX = useRef<number>(0);
  const isPaused = useRef<boolean>(false);
  const gapRef = useRef<number>(0);

  // Cache computed gap value — avoids forced style recalculation on every animation frame
  useEffect(() => {
    if (!contentRef.current) return;
    const updateGap = () => {
      if (contentRef.current) {
        const style = window.getComputedStyle(contentRef.current);
        gapRef.current =
          parseFloat(vertical ? style.rowGap || "0" : style.columnGap || "0") ||
          0;
      }
    };
    const resizeObserver = new ResizeObserver(updateGap);
    resizeObserver.observe(contentRef.current);
    updateGap();
    return () => resizeObserver.disconnect();
  }, [vertical]);

  useAnimationFrame((t, delta) => {
    if (
      !containerRef.current ||
      !contentRef.current ||
      !singleContentBlockRef.current
    )
      return;

    if (pauseOnHover && isPaused.current) {
      return;
    }

    const singleContentBlockSize = vertical
      ? singleContentBlockRef.current.offsetHeight
      : singleContentBlockRef.current.offsetWidth;

    const computedGap = gapRef.current;
    const loopDistance = singleContentBlockSize + computedGap;
    const dx = (speed * delta) / 1000;
    const effectiveDx = reverse ? dx : -dx;
    animX.current += effectiveDx;

    if (Math.abs(animX.current) >= loopDistance) {
      animX.current = animX.current % loopDistance;
    }

    if (vertical) {
      contentRef.current.style.transform = `translateY(${animX.current}px)`;
    } else {
      contentRef.current.style.transform = `translateX(${animX.current}px)`;
    }
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      isPaused.current = true;
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      isPaused.current = false;
    }
  }, [pauseOnHover]);

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(
        "group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)]" +
          (vertical ? " flex-col" : " flex-row"),
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={contentRef}
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)]" +
            (vertical ? " flex-col" : " flex-row"),
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              ref={i === 0 ? singleContentBlockRef : null}
              className="flex gap-8"
            >
              {children}
            </div>
          ))}
      </div>
    </div>
  );
}

const features = [
  {
    title: "Control The Stack",
    description:
      "Run the console, API, worker, database, and telephony bindings yourself instead of treating the voice-agent path as a black box.",
    icon: Icons.phoneCall,
  },
  {
    title: "Self-Hostable By Default",
    description:
      "Start locally with the repo, inspect the moving parts, then decide how and where production infrastructure should run.",
    icon: Icons.globe,
  },
  {
    title: "Privacy Review Built In",
    description:
      "Review where call logs, transcripts, recordings, knowledge bases, secrets, and runtime configuration live before you trust them.",
    icon: Icons.fileText,
  },
  {
    title: "Visible Provider Costs",
    description:
      "Bring LiveKit, Twilio or Telnyx, Postgres, Redis, and S3-compatible storage with clear boundaries instead of one opaque bundle.",
    icon: Icons.barChart,
  },
  {
    title: "Extensible Workflows",
    description:
      "Adapt agents, campaigns, permissions, billing paths, knowledge sources, and integrations to match your own product requirements.",
    icon: Icons.plug,
  },
  {
    title: "Honest Launch Boundaries",
    description:
      "Local setup shows the product surface. Real calls, billing, OAuth, email, and storage still need the right provider credentials.",
    icon: Icons.clock,
  },
];

const controlPoints = [
  {
    title: "Open Source",
    description:
      "Inspect the code paths behind calls, logs, storage, campaigns, and agent runtime behavior.",
    icon: Icons.fileText,
  },
  {
    title: "Self-Hosting",
    description:
      "Evaluate locally, keep deployment choices explicit, and avoid turning infrastructure decisions into vendor defaults.",
    icon: Icons.globe,
  },
  {
    title: "Provider Choice",
    description:
      "Choose the voice runtime, telephony provider, database, object storage, and deployment path that fit your constraints.",
    icon: Icons.plug,
  },
];

function ControlSection() {
  return (
    <section id="features" className="relative py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
            Built For Teams That Need Control
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
            Hosted APIs are convenient. TinkerVoice is for teams that need to
            inspect, self-host, extend, and reason about privacy-sensitive voice
            infrastructure.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {controlPoints.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border bg-transparent p-6 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.14)_inset]"
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  y: { duration: 0.5, delay: index * 0.1 },
                }}
              >
                <div className="text-primary mb-4 w-fit rounded-full border p-4 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.2)_inset]">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold tracking-tighter">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const partners = [
    { name: "Deepgram", logo: DeepgramLogo },
    { name: "ElevenLabs", logo: ElevenlabsLogo },
    { name: "Microsoft for Startups", logo: MicrosoftForStartups },
    { name: "Pinecone", logo: Pinecone },
    { name: "Nvidia Inception", logo: NvidiaInception },
    { name: "Telnyx", logo: Telnyx },
    { name: "Twilio", logo: Twilio },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center mb-12">
          <div className="relative z-10">
            <h2 className="mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Provider And Runtime Building Blocks
            </h2>
            <p className="text-foreground/60 mt-3">
              TinkerVoice keeps provider boundaries visible so teams can evaluate
              voice, telephony, model, and data services deliberately.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.2) 4.54%, rgba(var(--primary-rgb), 0.26) 34.2%, rgba(var(--primary-rgb), 0.1) 77.55%)",
            }}
          ></div>
        </div>
        <div className="relative">
          <Marquee pauseOnHover speed={30} className="[--gap:3rem]">
            {partners.map((partner, index) => {
              const LogoComponent = partner.logo;
              return (
                <div
                  key={index}
                  className="flex items-center justify-center h-24 w-auto px-8 py-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`flex items-center justify-center h-20 w-auto overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300 dark:opacity-70 dark:hover:opacity-100 [&>svg]:!h-20 [&>svg]:w-auto [&>svg]:!max-h-20 [&>svg]:max-w-[180px]`}
                  >
                    <LogoComponent />
                  </div>
                </div>
              );
            })}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

export default function Feature1() {
  return (
    <>
      <ControlSection />
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="relative mx-auto max-w-2xl sm:text-center">
            <div className="relative z-10">
              <h2 className="mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
                Why Teams Choose TinkerVoice
              </h2>
              <p className="text-foreground/60 mt-3">
                The tradeoff is control over convenience: source code, provider
                choice, deployment visibility, and workflows you can change.
              </p>
            </div>
            <div
              className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.2) 4.54%, rgba(var(--primary-rgb), 0.26) 34.2%, rgba(var(--primary-rgb), 0.1) 77.55%)",
              }}
            ></div>
          </div>
          <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
          <div className="relative mt-12">
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item, idx) => (
                <li
                  key={idx}
                  className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset]"
                >
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                    <item.icon
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold tracking-tighter">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <PartnersSection />
    </>
  );
}
