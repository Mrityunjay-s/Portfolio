"use client";

import React from "react";
import SectionHeading from "./section-heading";
import Project from "./project";
import { projectsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export function Projects() {
  const { ref } = useSectionInView("Work", 0.2);

  return (
    <section ref={ref} id="work" className="mx-auto w-full max-w-350 scroll-mt-14 px-5 pt-14 pb-24 sm:px-10">
      <SectionHeading eyebrow="03 / Work">Things I&apos;ve shipped</SectionHeading>

      {/* A log, not a grid — no empty "slot" placeholders needed here the way
          a 2-up card grid needed them: a shorter list still reads as
          intentional in this format, the way a real git log isn't padded
          out with blank commits while a project is still in progress. */}
      <div>
        {projectsData.map((project, index) => (
          <Project
            key={project.hash}
            {...project}
            index={index}
            isLast={index === projectsData.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
