"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type LoaderContextType = {
  isLoaded: boolean;
  hasChecked: boolean;
  startLoading: () => void;
  completeLoading: () => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export function LoaderContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  const startLoading = useCallback(() => {
    setHasChecked(true);
    setIsLoaded(false);
  }, []);

  const completeLoading = useCallback(() => {
    setHasChecked(true);
    setIsLoaded(true);
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoaded, hasChecked, startLoading, completeLoading }}>
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
