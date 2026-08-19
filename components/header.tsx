"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useLoaderContext } from "@/context/loader-context";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const { isLoaded, hasChecked } = useLoaderContext();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={false}
      animate={
        !hasChecked || isLoaded
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: -12 }
      }
      transition={{ duration: 0.6, delay: isLoaded ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-350 items-center justify-center gap-4 px-4 py-4 sm:justify-between sm:px-10">
        {/* The wordmark is dropped on phones so the nav pill keeps its full
            width — at 375px the two together overflow the viewport. */}
        <Link
          href="#home"
          onClick={() => {
            setActiveSection("Home");
            setTimeOfLastClick(Date.now());
          }}
          className="hidden text-[0.95rem] font-medium tracking-[-0.015em] whitespace-nowrap text-text sm:block"
        >
          Mrityunjay Singh<span className="text-accent">.</span>
        </Link>

        <nav>
          <ul className="flex items-center gap-0.5 rounded-full border border-line bg-ink/70 p-1 backdrop-blur-md">
            {links.map((link) => (
              <li key={link.hash}>
                <Link
                  href={link.hash}
                  onClick={() => {
                    setActiveSection(link.name);
                    setTimeOfLastClick(Date.now());
                  }}
                  className={clsx(
                    "relative flex items-center rounded-full px-2.5 py-1.5 text-[0.72rem] whitespace-nowrap transition-colors sm:px-4 sm:text-[0.82rem]",
                    activeSection === link.name ? "text-ink" : "text-muted hover:text-text"
                  )}
                >
                  {activeSection === link.name && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
