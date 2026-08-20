"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PageLoader, { COUNT_MS, HOLD_MS } from "./page-loader";
import { useLoaderContext } from "@/context/loader-context";
import { useActiveSectionContext } from "@/context/active-section-context";
import { hashSection } from "@/lib/data";
import type { SectionName } from "@/lib/types";

// HomeShell's zoom (home-shell.tsx) runs 1.4s. markSettled fires a little
// after that so the last of the transform's geometry has genuinely settled
// before observers are unpaused, not just "should be about done by now."
const ZOOM_SETTLE_MS = 1600;

export default function LoaderGate() {
  const pathname = usePathname();
  const { startLoading, completeLoading, markSettled } = useLoaderContext();
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const isHome = pathname === "/";

  // Kept in refs so the timing effect below depends only on `showLoader`.
  // Threading them through the dependency array risks the interval being
  // torn down and restarted mid-count, which would stall the loader
  // indefinitely.
  const completeRef = useRef(completeLoading);
  const markSettledRef = useRef(markSettled);
  const setActiveSectionRef = useRef(setActiveSection);
  const setTimeOfLastClickRef = useRef(setTimeOfLastClick);
  useEffect(() => {
    completeRef.current = completeLoading;
    markSettledRef.current = markSettled;
    setActiveSectionRef.current = setActiveSection;
    setTimeOfLastClickRef.current = setTimeOfLastClick;
  }, [completeLoading, markSettled, setActiveSection, setTimeOfLastClick]);

  // Captured in a layout effect — React runs every layout effect in the tree
  // before any passive effect fires, and useSectionInView's observer (the
  // thing that can rewrite the hash) is a plain useEffect, so this always
  // wins the race regardless of component order. (Reading it during render
  // instead would be earlier still, but refs can't be touched during render.)
  //
  // That ordering is what makes this worth capturing at all: re-reading
  // window.location.hash live inside `end()` was the actual bug in the first
  // version of this fix. If a section's observer fires spuriously during the
  // loader's zoom, it calls history.replaceState on its own, silently
  // rewriting the hash to whatever it fired on — so reading the hash "at
  // completion time" doesn't recover the user's real intent, it can just as
  // easily read back the exact corruption this code exists to correct.
  const initialHashRef = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (initialHashRef.current === null) {
      initialHashRef.current = window.location.hash;
    }
  }, []);

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
      // Two parts. First, authoritatively set the section the hand-off
      // should actually land on, from the hash captured at mount (see
      // initialHashRef above for why that one and not a live read) — so a
      // genuine deep link to /#about on a first visit is still respected,
      // defaulting to Home only when there wasn't one.
      const hash = initialHashRef.current;
      // Ternary, not `hash && ...`: when hash is "" (falsy), `&&` evaluates
      // to "" itself rather than undefined, and "" isn't a SectionName — the
      // `??` below only catches null/undefined, so an empty string would
      // slip through as an invalid value instead of falling back to Home.
      const landingSection: SectionName =
        (hash ? (hashSection[hash] as SectionName | undefined) : undefined) ?? "Home";
      setActiveSectionRef.current(landingSection);
      setTimeOfLastClickRef.current(Date.now());
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash || window.location.pathname + window.location.search);
      }

      // Second — the part that actually closes the race rather than just
      // outrunning it: every useSectionInView observer stays paused
      // (`skip`, via LoaderContext's isSettled) until this fires, so no
      // section can report inView at all while the zoom's geometry is still
      // moving. An earlier version of this fix instead reset the click-
      // suppression clock above and hoped 1.5s was enough — it wasn't. If a
      // React effect's actual execution gets delayed (a busy tab, a slow
      // device, exactly the kind of moment an entrance animation is
      // competing for the main thread), "was it less than N ms ago" can
      // already be false by the time the check finally runs, and the same
      // stale-observer write comes right back. Pausing the observers
      // outright has no such window: whenever their effects do get around to
      // running, skip is still true until markSettled genuinely fires.
      setTimeout(markSettledRef.current, ZOOM_SETTLE_MS);

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
