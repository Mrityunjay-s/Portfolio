"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./section-heading";
import { skillGroups } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

// Highlighted = differentiators, not just "real skills". Everything in this
// list clears a specific bar: named in the About bio, called out by industry
// sources as a standout 2026 signal, or tied to a named resume project.
// Deliberately excludes real, verified skills that are simply expected at
// this level (TypeScript, Docker, PostgreSQL, System Design, ...) — accenting
// the baseline alongside the differentiators would flatten the hierarchy
// this set exists to create.
const PRIMARY = new Set([
  "Java",
  "Spring Boot",
  "Kotlin",
  "React Native",
  "Azure AI Foundry",
  "RAG",
  "Kafka",
  "Kubernetes",
  // "Engineers who can build MCP servers are a small minority of the AI
  // engineering workforce as of 2026" — industry source, not a resume claim.
  "MCP",
  // "Kafka and event-driven architectures are in massive demand" — same
  // source; this is the architectural skill the tool above implements.
  "Event-Driven Architecture",
  // Title of the named Microservices Platform project, and the exact
  // framing sources used for what separates a 2026 backend hire: an
  // engineer who can "build, deploy, operate, secure, and scale services
  // in production."
  "Microservices",
  // One of the "most widely adopted AI agent frameworks" per sources;
  // confirmed hands-on rather than added for the label.
  "LangChain",
]);

const ALL_SKILLS = skillGroups.flatMap((g) => g.items);
const PRIMARY_SKILLS = ALL_SKILLS.filter((s) => PRIMARY.has(s));
const REST_SKILLS = ALL_SKILLS.filter((s) => !PRIMARY.has(s));

// Three rows so the motion has some variety instead of one uniform belt.
// Differentiators get their own row, slower and brighter; the rest split in
// two, running opposite directions so adjacent rows don't drift in lockstep.
const ROWS: { items: string[]; hot: boolean; duration: number; reverse?: boolean }[] = [
  { items: PRIMARY_SKILLS, hot: true, duration: 32 },
  { items: REST_SKILLS.slice(0, Math.ceil(REST_SKILLS.length / 2)), hot: false, duration: 40, reverse: true },
  { items: REST_SKILLS.slice(Math.ceil(REST_SKILLS.length / 2)), hot: false, duration: 36 },
];

function Chip({ skill, hot }: { skill: string; hot: boolean }) {
  return (
    <span
      className={
        hot
          ? "shrink-0 rounded-lg border border-accent/35 bg-accent/8 px-4 py-2.5 text-sm font-medium text-accent"
          : "shrink-0 rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-muted"
      }
    >
      {skill}
    </span>
  );
}

export default function Skills() {
  const { ref } = useSectionInView("Skills", 0.25);
  const reduceMotion = useReducedMotion();

  // Under reduced motion this isn't just "the same marquee, paused" — a
  // frozen mid-scroll belt can land with a row cut off half-through a chip,
  // and a duplicated track would show every skill twice. Fall back to a
  // plain wrapped list instead, once per skill, fully static.
  if (reduceMotion) {
    return (
      <section ref={ref} id="skills" className="mx-auto w-full max-w-350 scroll-mt-14 px-5 pt-14 pb-24 sm:px-10">
        <SectionHeading eyebrow="02 / Skills">Stack &amp; tools</SectionHeading>
        <ul className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => (
            <li key={skill}>
              <Chip skill={skill} hot={PRIMARY.has(skill)} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={ref} id="skills" className="mx-auto w-full max-w-350 scroll-mt-14 px-5 pt-14 pb-24 sm:px-10">
      <SectionHeading eyebrow="02 / Skills">Stack &amp; tools</SectionHeading>

      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {ROWS.map((row, ri) => (
          <div
            key={ri}
            className="skill-marquee-row overflow-hidden border-y border-line py-3.5"
            // All three rows are hidden from assistive tech, including row 0:
            // the sr-only list below is the single authoritative reading, so
            // this stays decorative-but-visible rather than announcing every
            // differentiator twice.
            aria-hidden="true"
          >
            <div
              className="skill-marquee-track flex w-max gap-2.5"
              style={{
                animationDuration: `${row.duration}s`,
                animationDirection: row.reverse ? "reverse" : "normal",
              }}
            >
              {row.items.concat(row.items).map((skill, i) => (
                <Chip key={skill + i} skill={skill} hot={row.hot} />
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* The one full, non-duplicated, non-animated copy for anything
          assistive tech or a text-only view relies on — visually hidden,
          not display:none, so it stays in the accessibility tree. */}
      <ul className="sr-only">
        {ALL_SKILLS.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
