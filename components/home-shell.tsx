"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLoaderContext } from "@/context/loader-context";

export default function HomeShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, hasChecked } = useLoaderContext();
  const isWaiting = hasChecked && !isLoaded;

  return (
    <motion.div
      className="origin-top will-change-transform"
      initial={false}
      // Held slightly low and scaled up while the loader covers the screen,
      // then settling as the panel slides off. The page is fully opaque the
      // whole time — it is revealed by the panel leaving, not by fading in,
      // which is what makes the hand-off read as one continuous scroll.
      animate={isWaiting ? { y: 90, scale: 1.05 } : { y: 0, scale: 1 }}
      // Slower than the panel's 1.05s exit, so the page trails it. That lag is
      // the parallax.
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
