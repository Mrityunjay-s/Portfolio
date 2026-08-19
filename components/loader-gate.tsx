"use client";

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageLoader from "./page-loader";
import { useLoaderContext } from "@/context/loader-context";

// Beat to let 100% register before the panel starts moving.
const HOLD_MS = 420;

export default function LoaderGate() {
  const pathname = usePathname();
  const { startLoading, completeLoading } = useLoaderContext();
  const [showLoader, setShowLoader] = useState(false);
  const [counted, setCounted] = useState(false);
  const isHome = pathname === "/";

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

    // In production the loader is a first-impression, not something to sit
    // through on every navigation, so it runs once per tab session. In
    // development that gate just hides the thing you are working on, so a
    // reload always replays it.
    const replay = flag !== null || process.env.NODE_ENV === "development";
    const seen = sessionStorage.getItem("portfolio-loader-seen");

    if (!replay && seen) {
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

  // The loader owns the count and reports when it genuinely reaches 100, so
  // the exit is driven by the number finishing rather than by a parallel timer
  // that could fire while the count was still short of the end.
  const handleCounted = useCallback(() => setCounted(true), []);

  useEffect(() => {
    if (!counted || !showLoader) return;
    const exitTimer = setTimeout(() => {
      setShowLoader(false);
      // Released as the panel *starts* moving, not when it lands, so the page
      // underneath travels at the same time. Releasing on exit-complete would
      // play the two sequentially and lose the parallax entirely.
      completeLoading();
      sessionStorage.setItem("portfolio-loader-seen", "1");
    }, HOLD_MS);
    return () => clearTimeout(exitTimer);
  }, [counted, showLoader, completeLoading]);

  const handleExitComplete = useCallback(() => {
    document.body.style.overflow = "";
    window.scrollTo(0, 0);
  }, []);

  if (!isHome) return null;

  return (
    <PageLoader
      visible={showLoader}
      onCounted={handleCounted}
      onExitComplete={handleExitComplete}
    />
  );
}
