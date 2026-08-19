"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "portfolio-theme";

const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  // Starts "dark" to match the SSR-rendered markup (no data-theme attribute
  // = dark, per globals.css) and the inline script in layout.tsx, which sets
  // the real attribute before paint. This only reconciles React's own state
  // with whatever that script already decided, on mount.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    // localStorage doesn't exist during SSR render, so this can't be derived
    // at render time — same case as loader-gate.tsx's client-only read.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only API
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeContextProvider");
  return ctx;
}
