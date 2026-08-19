"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";
import { skillsData } from "@/lib/data";
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

export default function Skills() {
  const { ref } = useSectionInView("Skills", 0.25);

  return (
    <section ref={ref} id="skills" className="mx-auto w-full max-w-350 scroll-mt-14 px-5 pt-14 pb-24 sm:px-10">
      <SectionHeading eyebrow="02 / Skills">What I reach for</SectionHeading>

      <ul className="flex flex-wrap gap-2">
        {skillsData.map((skill, i) => {
          const primary = PRIMARY.has(skill);
          return (
            <motion.li
              key={skill}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.025, 0.4), duration: 0.4 }}
              className={
                primary
                  ? "rounded-lg border border-accent/35 bg-accent/8 px-3.5 py-2 text-sm text-accent"
                  : "rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-muted transition-colors hover:border-dim hover:text-text"
              }
            >
              {skill}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
