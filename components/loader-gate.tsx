"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PageLoader, { COUNT_MS, HOLD_MS } from "./page-loader";
import { useLoaderContext } from "@/context/loader-context";
import { useActiveSectionContext } from "@/context/active-section-context";
import { hashSection } from "@/lib/data";
import type { SectionName } from "@/lib/types";

export default function LoaderGate() {
  const pathname = usePathname();
  const { startLoading, completeLoading } = useLoaderContext();
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const isHome = pathname === "/";

  // Kept in refs so the timing effect below depends only on `showLoader`.
  // Threading them through the dependency array risks the interval being
  // torn down and restarted mid-count, which would stall the loader
  // indefinitely.
  const completeRef = useRef(completeLoading);
  const setActiveSectionRef = useRef(setActiveSection);
  const setTimeOfLastClickRef = useRef(setTimeOfLastClick);
  useEffect(() => {
    completeRef.current = completeLoading;
    setActiveSectionRef.current = setActiveSection;
    setTimeOfLastClickRef.current = setTimeOfLastClick;
  }, [completeLoading, setActiveSection, setTimeOfLastClick]);

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

      // HomeShell zooms the whole page back to scale 1 over the next ~1.4s.
      // While it's still below scale 1, every section is compressed toward
      // the top, so a section that would normally sit off-screen (About,
      // Skills...) briefly satisfies its own IntersectionObserver threshold
      // purely from the transform — no actual scrolling involved. That
      // observer has no idea the loader exists, so it fires and stomps the
      // nav straight onto "About" before the zoom has even finished.
      //
      // Fixed two ways: authoritatively set the section the hand-off should
      // actually land on right now (whatever hash the URL already carries,
      // so a deep link to /#about on a first visit is still respected —
      // defaulting to Home only when there isn't one), and reset the click
      // suppression clock so the observers' spurious firings for the rest of
      // the zoom are ignored the same way a real nav click would be.
      const hash = window.location.hash;
      const landingSection = (hashSection[hash] as SectionName | undefined) ?? "Home";
      setActiveSectionRef.current(landingSection);
      setTimeOfLastClickRef.current(Date.now());

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
