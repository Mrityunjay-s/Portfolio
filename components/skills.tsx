"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";
import { skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

// Skills Mrityunjay leads with, highlighted so the list has a hierarchy
// instead of reading as one flat wall of equal-weight tags.
const PRIMARY = new Set([
  "Kotlin",
  "React Native",
  "Spring Boot",
  "Jetpack Compose",
  "Java",
  "TypeScript",
]);

export default function Skills() {
  const { ref } = useSectionInView("Skills", 0.25);

  return (
    <section ref={ref} id="skills" className="mx-auto w-full max-w-350 scroll-mt-24 px-5 pt-14 pb-24 sm:px-10">
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
