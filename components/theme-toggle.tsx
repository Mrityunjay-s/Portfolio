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
      // shrink-0: without it, the header row's default flex-shrink silently
      // crushed this down to a non-square ~15x28px hit target on phones
      // below ~380px — exactly where the header was tightest and a real
      // touch target matters most. h-9 w-9 (36px) is the actual tap target;
      // the icon inside stays visually small via its own font size.
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-text active:scale-90"
    >
      {isLight ? <HiOutlineMoon className="text-[1.05rem]" /> : <HiOutlineSun className="text-[1.05rem]" />}
    </button>
  );
}
