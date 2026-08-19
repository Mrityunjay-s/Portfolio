"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PageLoader, { COUNT_MS, HOLD_MS } from "./page-loader";
import { useLoaderContext } from "@/context/loader-context";

export default function LoaderGate() {
  const pathname = usePathname();
  const { startLoading, completeLoading } = useLoaderContext();
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const isHome = pathname === "/";

  // Kept in a ref so the timing effect below depends only on `showLoader`.
  // Threading it through the dependency array risks the interval being torn
  // down and restarted mid-count, which would stall the loader indefinitely.
  const completeRef = useRef(completeLoading);
  useEffect(() => {
    completeRef.current = completeLoading;
  }, [completeLoading]);

  useLayoutEffect(() => {
    if (!isHome) {
      completeLoading();
      return;
    }

    // Honoured before anything else: a URL flag is usually set by whoever is
    // building the site, but the motion preference belongs to whoever is
    // reading it.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      completeLoading();
      return;
    }

    // ?loader=0 skips it, ?loader (or ?loader=1) forces it even once seen.
    const flag = new URLSearchParams(window.location.search).get("loader");
    if (flag === "0") {
      completeLoading();
      return;
    }

    // Once per tab, in every environment. sessionStorage is scoped to the tab,
    // so a fresh tab replays it while a reload in the same tab does not — the
    // loader stays a first impression rather than a toll on every refresh.
    // Append ?loader to force it without opening a new tab.
    const seen = sessionStorage.getItem("portfolio-loader-seen");

    if (flag === null && seen) {
      completeLoading();
      return;
    }

    // The decision depends on sessionStorage and matchMedia, neither of which
    // exists during the server render, so it cannot be derived at render time.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only APIs
    setShowLoader(true);
    startLoading();

    // Pin the page while the loader is up: the reveal is meant to look like an
    // automatic scroll, which only works from a known starting position.
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  }, [isHome, startLoading, completeLoading]);

  // One clock owns both the count and the exit. Splitting them across two
  // components meant the count could finish while the hand-off that ends the
  // loader silently never fired, leaving the panel up forever.
  useEffect(() => {
    if (!showLoader) return;

    const start = performance.now();
    let exitTimer: ReturnType<typeof setTimeout>;

    function end() {
      setShowLoader(false);
      // Released as the panel *starts* moving, not when it lands, so the page
      // underneath travels at the same time. Releasing on exit-complete would
      // play the two sequentially and lose the parallax entirely.
      completeRef.current();
      sessionStorage.setItem("portfolio-loader-seen", "1");
    }

    // Interval rather than requestAnimationFrame: rAF is suspended entirely in
    // a background tab, which would strand a visitor behind a frozen loader.
    // Progress is derived from elapsed time, so a throttled interval catches
    // up rather than falling behind.
    const id = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / COUNT_MS);
      // Gentle ease so the count starts and finishes smoothly.
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProgress(eased * 100);

      if (t >= 1) {
        clearInterval(id);
        exitTimer = setTimeout(end, HOLD_MS);
      }
    }, 30);

    return () => {
      clearInterval(id);
      clearTimeout(exitTimer);
    };
  }, [showLoader]);

  const handleExitComplete = useCallback(() => {
    document.body.style.overflow = "";
    window.scrollTo(0, 0);
  }, []);

  if (!isHome) return null;

  return (
    <PageLoader
      visible={showLoader}
      progress={progress}
      onExitComplete={handleExitComplete}
    />
  );
}
