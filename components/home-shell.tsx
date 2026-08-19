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
      // Held small while the loader covers the screen, then growing to full
      // size as the panel slides off, so the page reads as zooming in toward
      // the viewer rather than sliding into place. It is fully opaque the
      // whole time — revealed by the panel leaving, never by fading in.
      animate={isWaiting ? { scale: 0.9, y: 24 } : { scale: 1, y: 0 }}
      // Slower than the panel's 1.05s exit, so the zoom is still settling
      // after the panel has gone. That lag is the parallax.
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
