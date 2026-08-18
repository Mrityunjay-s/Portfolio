"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import pPic from "@/public/profile.jpg";
import BentoCard from "./bento-card";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";

const CORE = ["Kotlin", "React Native", "Spring Boot", "Jetpack Compose", "TypeScript", "Firebase"];

export default function About() {
  const { ref } = useSectionInView("About", 0.25);

  return (
    <section ref={ref} id="about" className="mx-auto w-full max-w-350 scroll-mt-28 px-5 py-24 sm:px-10">
      <SectionHeading eyebrow="01 / About">One year, end to end</SectionHeading>

      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-4 lg:grid-cols-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <BentoCard className="min-h-56 sm:col-span-2 lg:col-span-4" label="About">
          <p className="text-[0.94rem] leading-relaxed text-muted">
            I&apos;m a mobile developer with a year of experience shipping apps end to end &mdash;
            <span className="text-text"> React Native</span> and
            <span className="text-text"> Android native with Kotlin and Jetpack Compose</span> on the
            surface,
            <span className="text-text"> Java Spring Boot</span> behind it. That means I can take a
            feature from an empty screen to a deployed API without handing it off.
          </p>
        </BentoCard>

        <BentoCard className="min-h-72 overflow-hidden p-0 sm:col-span-2 lg:col-span-2 lg:row-span-2">
          <Image
            src={pPic}
            alt="Mrityunjay Singh"
            quality={90}
            placeholder="blur"
            sizes="(max-width: 640px) 100vw, 33vw"
            className="absolute inset-0 h-full w-full object-cover object-[50%_22%] opacity-70 grayscale transition duration-500 group-hover:opacity-90 group-hover:grayscale-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="relative mt-auto p-5">
            <div className="label-mono text-dim">Bengaluru</div>
            <div className="mt-1 text-[0.95rem] font-medium">Mrityunjay Singh</div>
          </div>
        </BentoCard>

        <BentoCard className="min-h-40 sm:col-span-2 lg:col-span-2" label="Core stack">
          <ul className="flex flex-wrap gap-1.5">
            {CORE.map((s) => (
              <li
                key={s}
                className="rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-[0.68rem] tracking-wide text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard
          className="min-h-40 sm:col-span-1 lg:col-span-1"
          label="Résumé"
          href="/Mrityunjay's Resume.pdf"
          download
        >
          <p className="text-[0.94rem] leading-relaxed text-muted">
            The one-page version, as a PDF.
          </p>
        </BentoCard>

        <BentoCard className="min-h-40 sm:col-span-1 lg:col-span-1">
          <div>
            <div className="font-mono text-3xl font-medium tabular-nums text-accent">1</div>
            <div className="label-mono mt-1 text-dim">Year shipping</div>
          </div>
          <div>
            <div className="font-mono text-3xl font-medium tabular-nums text-text">2</div>
            <div className="label-mono mt-1 text-dim">Apps live</div>
          </div>
        </BentoCard>
      </motion.div>
    </section>
  );
}
