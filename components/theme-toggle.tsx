"use client";

import React from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTheme } from "@/context/theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={isLight}
      className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-text"
    >
      {isLight ? <HiOutlineMoon className="text-[0.95rem]" /> : <HiOutlineSun className="text-[0.95rem]" />}
    </button>
  );
}
