"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Row = { prompt?: string; text: string; muted?: boolean };

// Every value here already exists elsewhere on the page (About's prose, the
// Impact row, the Résumé card) — this card restates it as a shell session
// rather than introducing new claims, and ties the section back to the same
// code-file identity Skills already uses.
const ROWS: Row[] = [
  { prompt: "whoami", text: "mrityunjay-singh" },
  { prompt: "cat status", text: "Full Stack Engineer, Bengaluru" },
  { text: "open to work", muted: true },
  { prompt: "uptime", text: "2y · 99.8% clean deploys" },
];

export default function AboutTerminal() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[#0c0d0f]">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-2 font-mono text-[0.7rem] text-dim">~/about</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3.5 px-5 py-6 font-mono text-[0.8rem] leading-relaxed sm:text-[0.85rem]">
        {ROWS.map((row, i) => (
          <motion.div
            key={i}
            initial={reduceMotion ? undefined : { opacity: 0, x: -8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {row.prompt ? (
              <>
                <span className="text-accent">$</span> <span className="text-text">{row.prompt}</span>
                <div className="mt-1 text-muted">{row.text}</div>
              </>
            ) : (
              <div className={row.muted ? "text-dim" : "text-muted"}>{row.text}</div>
            )}
          </motion.div>
        ))}

        <motion.div
          className="flex items-center gap-2"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: ROWS.length * 0.12 }}
        >
          <span className="text-accent">$</span>
          <span
            className="h-[1.1em] w-[0.5em] bg-dim/70"
            style={{ animation: reduceMotion ? undefined : "cursor-blink 1.1s step-end infinite" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
