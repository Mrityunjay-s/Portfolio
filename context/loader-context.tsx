"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type LoaderContextType = {
  isLoaded: boolean;
  hasChecked: boolean;
  // False from the moment the loader starts until HomeShell's zoom has
  // genuinely finished — see markSettled. Every useSectionInView observer
  // checks this and pauses outright (react-intersection-observer's `skip`)
  // rather than merely being told to ignore what it finds: while the zoom is
  // still short of scale 1, the whole page is visually compressed toward the
  // top, so a section that would normally sit off-screen can satisfy its own
  // IntersectionObserver threshold from the transform alone, no scrolling
  // involved. A definitive pause is immune to how late an effect happens to
  // run; a "was it less than N ms ago" check is not — it can be defeated by
  // exactly the kind of scheduling delay a loaded, animating page produces.
  isSettled: boolean;
  startLoading: () => void;
  completeLoading: () => void;
  markSettled: () => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export function LoaderContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [isSettled, setIsSettled] = useState(true);

  const startLoading = useCallback(() => {
    setHasChecked(true);
    setIsLoaded(false);
    setIsSettled(false);
  }, []);

  const completeLoading = useCallback(() => {
    setHasChecked(true);
    setIsLoaded(true);
  }, []);

  const markSettled = useCallback(() => {
    setIsSettled(true);
  }, []);

  return (
    <LoaderContext.Provider
      value={{ isLoaded, hasChecked, isSettled, startLoading, completeLoading, markSettled }}
    >
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoaderContext() {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoaderContext must be used within LoaderContextProvider");
  }
  return ctx;
}
