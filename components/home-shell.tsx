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
      // Held well back while the loader covers the screen, then growing to
      // full size as the panel slides off, so the page reads as rushing
      // toward the viewer. It is fully opaque throughout — revealed by the
      // panel leaving, never by fading in.
      //
      // 0.74 is deliberately far enough to register: anything nearer 1 is
      // perceptible only as a vague drift rather than as a zoom. The page is
      // horizontally centred by origin-top, so the inset while it is small
      // reads as depth against the same near-black ground.
      animate={isWaiting ? { scale: 0.74 } : { scale: 1 }}
      // Slower than the panel's 1.05s exit, so the zoom is still settling
      // after the panel has gone. That lag is the parallax.
      transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
