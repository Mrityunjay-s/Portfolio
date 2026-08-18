"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import DotField from "./dot-field";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";

const rise = {
  initial: { opacity: 0, y: 26 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const { ref } = useSectionInView("Home", 0.4);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  return (
    <section
      ref={ref}
      id="home"
      className="relative isolate flex min-h-svh w-full flex-col justify-center overflow-hidden"
    >
      <DotField />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-350 px-5 pb-16 pt-32 sm:px-10">
        <motion.p
          className="label-mono mb-5 text-dim"
          variants={rise}
          initial="initial"
          animate="animate"
          custom={0}
        >
          {"/// "}Mobile Developer &mdash; React Native &middot; Kotlin &middot; Spring Boot
        </motion.p>

        <motion.h1
          className="max-w-[15ch] text-[clamp(2.4rem,8.4vw,7.9rem)] font-[760] leading-[0.9] tracking-[-0.042em] text-balance"
          variants={rise}
          initial="initial"
          animate="animate"
          custom={1}
        >
          <span className="block">I build what happens</span>
          <span className="block text-muted">between the tap</span>
          <span className="block">
            and the answer
            <span className="ml-[0.06em] inline-block h-[0.135em] w-[0.135em] rounded-full bg-accent align-baseline shadow-[0_0_28px_rgba(198,245,60,0.55)]" />
          </span>
        </motion.h1>

        <motion.div
          className="pointer-events-auto mt-10 flex flex-wrap items-center gap-2.5"
          variants={rise}
          initial="initial"
          animate="animate"
          custom={2}
        >
          <Link
            href="#contact"
            onClick={() => {
              setActiveSection("Contact");
              setTimeOfLastClick(Date.now());
            }}
            className="group flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110 active:scale-[0.98]"
          >
            Start a project
            <BsArrowRight className="transition group-hover:translate-x-1" />
          </Link>

          <a
            href="/Mrityunjay_Resume.pdf"
            download
            className="group flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-text transition hover:border-dim hover:bg-surface-2 active:scale-[0.98]"
          >
            Résumé
            <HiDownload className="opacity-60 transition group-hover:translate-y-0.5" />
          </a>

          <a
            href="https://www.linkedin.com/in/mrityunjaysi/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded-full border border-line bg-surface p-3.5 text-muted transition hover:border-dim hover:text-text active:scale-[0.98]"
          >
            <BsLinkedin />
          </a>

          <a
            href="https://github.com/Mrityunjaysingh-1"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-full border border-line bg-surface p-3.5 text-muted transition hover:border-dim hover:text-text active:scale-[0.98]"
          >
            <FaGithub />
          </a>
        </motion.div>

        <motion.p
          className="label-mono mt-9 text-dim"
          variants={rise}
          initial="initial"
          animate="animate"
          custom={3}
        >
          Move your cursor
        </motion.p>
      </div>
    </section>
  );
}
