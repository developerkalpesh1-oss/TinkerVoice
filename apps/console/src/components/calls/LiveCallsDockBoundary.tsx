"use client";

import dynamic from "next/dynamic";

// Keep the heavy dock off the critical layout compile path. React Compiler's
// Babel transform of LiveCallsDock can time out under memory pressure when it
// is imported directly from the app layout.
export const LiveCallsDock = dynamic(
  () => import("./LiveCallsDock").then((mod) => mod.LiveCallsDock),
  { ssr: false, loading: () => null },
);
