"use client";

import React from "react";
import SectionHeading from "./section-heading";
import Project, { ProjectSlot } from "./project";
import { projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

// Keep the grid at four tiles so it stays composed while the last two
// projects are still being written up.
const TARGET_TILES = 4;

export function Projects() {
  const { ref } = useSectionInView("Work", 0.2);
  const slots = Math.max(0, TARGET_TILES - projectsData.length);

  return (
    <section
      ref={ref}
      id="work"
      className="mx-auto w-full max-w-350 scroll-mt-14 px-5 pt-14 pb-24 sm:px-10"
    >
      <SectionHeading eyebrow="03 / Work">Things I&apos;ve shipped</SectionHeading>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {projectsData.map((project, index) => (
          <Project key={project.title} {...project} index={index} />
        ))}
        {Array.from({ length: slots }, (_, i) => (
          <ProjectSlot key={`slot-${i}`} n={projectsData.length + i + 1} />
        ))}
      </div>
    </section>
  );
}
