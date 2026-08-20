"use client";

import { motion } from "framer-motion";

type Node = readonly [label: string, hot: boolean];

export type ProjectProps = {
  hash: string;
  when: string;
  title: string;
  body: string;
  body2: string;
  tags: readonly string[];
  nodes: readonly Node[];
  index: number;
  isLast: boolean;
};

export default function Project({
  hash,
  when,
  title,
  body,
  body2,
  tags,
  nodes,
  index,
  isLast,
}: ProjectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-[20px_1fr] gap-3.5 py-5 ${isLast ? "" : "border-b border-line"}`}
    >
      {/* The rail: a dot per commit, joined by a line to the next one. Real
          elements rather than a pseudo-element, since its height has to
          reach the next sibling's dot and CSS can't express "until the next
          row" without knowing whether there is one — isLast decides that in
          JS, where the data already does. */}
      <div className="relative flex justify-center">
        {!isLast && <span className="absolute top-1 -bottom-5 left-1/2 w-px -translate-x-1/2 bg-line" />}
        <span className="relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-ink" />
      </div>

      <div className="min-w-0">
        {/* Grid, not flex-wrap + ml-auto: below sm, "when" needs to drop to
            its own left-aligned line, but ml-auto keeps pushing it to the
            right edge even after it wraps, leaving it stranded there alone.
            A single-column grid collapsing to two columns at sm gives the
            same right-aligned-on-one-line result on wide screens without an
            orphaned fragment on narrow ones — no breakpoint-specific classes
            needed on the fragment itself. */}
        <div className="grid grid-cols-1 items-baseline gap-x-2 gap-y-0.5 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-baseline gap-2 min-w-0">
            <span className="font-mono text-[0.72rem] text-accent">{hash}</span>
            <h3 className="text-[0.98rem] font-semibold tracking-[-0.01em] wrap-break-word">{title}</h3>
          </div>
          <span className="font-mono text-[0.68rem] text-dim">{when}</span>
        </div>

        <p className="mt-1.5 max-w-[72ch] text-[0.86rem] leading-relaxed text-muted">
          {body}
          {body2 ? ` ${body2}` : ""}
        </p>

        {/* Architecture strip: the system, not a screenshot of it — for
            these two resume projects the diagram carries real information
            (Client -> Services -> Kafka is the actual shape of what was
            built), which is the whole reason to draw it instead of pasting
            in a UI screenshot that doesn't exist for a backend system anyway. */}
        <div className="mt-3 flex items-center overflow-x-auto pb-1">
          {nodes.map(([label, hot], i) => (
            <span key={label} className="flex shrink-0 items-center">
              <span
                className={
                  "rounded-md border px-2 py-1 font-mono text-[0.62rem] whitespace-nowrap " +
                  (hot
                    ? "border-accent/40 bg-accent/9 text-accent"
                    : "border-line bg-surface-2 text-muted")
                }
              >
                {label}
              </span>
              {i < nodes.length - 1 && (
                <span className="mx-1 shrink-0 text-[0.7rem] text-dim" aria-hidden="true">
                  &rarr;
                </span>
              )}
            </span>
          ))}
        </div>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-accent/25 bg-accent/8 px-2 py-1 font-mono text-[0.62rem] text-accent"
            >
              <span className="opacity-70">+ </span>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
