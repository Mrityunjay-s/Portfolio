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
      // Starts at roughly half size so the growth is the loudest thing in the
      // hand-off. The page is horizontally centred by origin-top, so the inset
      // while it is small reads as depth against the same near-black ground.
      // Much below this it stops reading as a page zooming in and starts
      // reading as a small page that happens to grow.
      animate={isWaiting ? { scale: 0.60 } : { scale: 1 }}
      // Matches the panel's 0.8s exit. Note: this removes the lag that was the
      // parallax — the zoom now lands at the same instant the panel clears
      // instead of trailing behind it. Still reads as a zoom, just not as a
      // hand-off with depth. Push back above 0.8s to restore that trailing
      // effect if it's missed.
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
