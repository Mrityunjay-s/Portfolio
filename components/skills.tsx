"use client";

import React, { Fragment } from "react";
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

type Token = { text: string; cls?: string };
// depth: how many indent levels (in ch, not literal spaces — see render) this
// line sits at. Kept out of the token text itself so wrapping a long line
// doesn't drag stray leading spaces onto the wrapped continuation.
type Line = { depth: number; tokens: Token[] };

// Deliberately restricted to the site's own tokens (text / muted / dim /
// accent) rather than a multi-hue syntax theme — globals.css calls the
// accent out as the only saturated colour in the system, and a rainbow of
// keyword/string/key colours would quietly break that everywhere else this
// section is the one exception.
const KW = "text-muted";
const KEY = "text-text";
const PUNC = "text-dim";
const STR = "text-muted";
const HOT = "font-medium text-accent";

function buildLines(): Line[] {
  const lines: Line[] = [
    { depth: 0, tokens: [{ text: "const ", cls: KW }, { text: "skills", cls: KEY }, { text: " = {", cls: PUNC }] },
  ];

  skillGroups.forEach((group, gi) => {
    lines.push({ depth: 1, tokens: [{ text: group.label, cls: KEY }, { text: ": [", cls: PUNC }] });

    group.items.forEach((skill, i) => {
      const hot = PRIMARY.has(skill);
      const comma = i < group.items.length - 1 ? "," : "";
      // No trailing "// lead with this" comment — on the longest resume
      // entries (Event-Driven Architecture, Prompt Engineering) that pushed
      // the line past mobile viewport width and forced horizontal scroll.
      // The accent colour + weight already carries the signal, same as
      // every other highlighted-skill treatment on the site.
      lines.push({
        depth: 2,
        tokens: [{ text: `"${skill}"`, cls: hot ? HOT : STR }, { text: comma, cls: PUNC }],
      });
    });

    lines.push({ depth: 1, tokens: [{ text: "]" + (gi < skillGroups.length - 1 ? "," : ""), cls: PUNC }] });
  });

  lines.push({ depth: 0, tokens: [{ text: "};", cls: PUNC }] });
  return lines;
}

const LINES = buildLines();

export default function Skills() {
  const { ref } = useSectionInView("Skills", 0.25);
  const reduceMotion = useReducedMotion();

  return (
    <section ref={ref} id="skills" className="mx-auto w-full max-w-350 scroll-mt-14 px-5 pt-14 pb-24 sm:px-10">
      <SectionHeading eyebrow="02 / Skills">What I reach for</SectionHeading>

      <div className="overflow-hidden rounded-xl border border-line bg-[#0c0d0f] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="ml-2 font-mono text-[0.7rem] text-dim">skills.ts</span>
        </div>

        {/* whitespace-pre-wrap + break-words, not pre + overflow-x-auto: a
            code block that scrolls horizontally on a phone is exactly the
            thing this rebuild removed. Long lines wrap instead; the ch-based
            padding-left (real indentation, not literal spaces baked into the
            text) keeps a wrapped continuation from losing its hanging
            indent, which plain leading spaces cannot do once they wrap. */}
        <code className="flex flex-col gap-y-[3px] px-5 py-5 font-mono text-[0.78rem] leading-relaxed sm:px-6 sm:text-[0.85rem]">
          {LINES.map((line, i) => (
            <motion.div
              key={i}
              className="flex whitespace-pre-wrap break-words"
              style={{ paddingLeft: `${line.depth * 1.6}ch` }}
              initial={reduceMotion ? undefined : { opacity: 0, x: -8 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.018, 0.5), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mr-4 inline-block w-5 shrink-0 select-none text-right text-dim/60 tabular-nums">
                {i + 1}
              </span>
              <span>
                {line.tokens.map((t, ti) => (
                  <Fragment key={ti}>
                    <span className={t.cls}>{t.text}</span>
                  </Fragment>
                ))}
              </span>
            </motion.div>
          ))}
          <motion.div
            className="ml-9 mt-1 h-[1.1em] w-[0.55em] bg-dim/70"
            style={{ animation: reduceMotion ? undefined : "cursor-blink 1.1s step-end infinite" }}
            initial={reduceMotion ? undefined : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(LINES.length * 0.018, 0.5) + 0.2 }}
          />
        </code>
      </div>
    </section>
  );
}
