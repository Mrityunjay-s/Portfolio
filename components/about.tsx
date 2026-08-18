"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import pPic from "@/public/profile.jpg";
import BentoCard from "./bento-card";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";

// Quantified outcomes carry more weight with recruiters and clients than any
// adjective, so they get their own row rather than being buried in prose.
const IMPACT = [
  { value: "24%", label: "Faster API responses", detail: "Spring Security, JWT, RBAC" },
  { value: "72%", label: "Higher throughput", detail: "SQL tuning + Redis caching" },
  { value: "1,000+", label: "Active users", detail: "2 cross-platform apps shipped" },
  { value: "70%", label: "Less doc search time", detail: "RAG over 10,000+ documents" },
];

// Curated from the resume rather than copied wholesale — listing every
// framework and tool stops communicating. Kept to what signals range
// (languages), depth (backend, AI) and the parts a reader would otherwise
// wonder about (databases).
const STACK = [
  { area: "Languages", items: "Java · Kotlin · Go · Python · TypeScript · SQL" },
  { area: "Backend", items: "Spring Boot · FastAPI · Microservices · REST · GraphQL · gRPC" },
  { area: "Mobile", items: "React Native · Android (Kotlin) · iOS (Swift)" },
  { area: "AI", items: "Azure AI Foundry · Azure OpenAI · RAG · AI agents · Spring AI" },
  { area: "Data", items: "PostgreSQL · MongoDB · Redis · Kafka · Elasticsearch" },
  { area: "Cloud", items: "Azure · Docker · Kubernetes · CI/CD" },
];

export default function About() {
  const { ref } = useSectionInView("About", 0.25);

  return (
    <section ref={ref} id="about" className="mx-auto w-full max-w-350 scroll-mt-28 px-5 py-24 sm:px-10">
      <SectionHeading eyebrow="01 / About">Client call to production</SectionHeading>

      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-4 lg:grid-cols-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <BentoCard className="min-h-56 sm:col-span-2 lg:col-span-4" label="About">
          <p className="text-[0.94rem] leading-relaxed text-muted">
            I&apos;m a full stack engineer with{" "}
            <span className="text-text">two years</span> building secure microservices and REST
            APIs in <span className="text-text">Java Spring Boot</span>, cross-platform apps in{" "}
            <span className="text-text">React Native</span> with native Android and iOS modules,
            and more recently{" "}
            <span className="text-text">AI agents and RAG pipelines</span> on Azure AI Foundry.
            I own the whole cycle — sitting in the requirements call, then shipping it to
            production and keeping it running.
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
            <div className="label-mono text-dim">Bengaluru, India</div>
            <div className="mt-1 text-[0.95rem] font-medium">Mrityunjay Singh</div>
          </div>
        </BentoCard>

        <BentoCard className="min-h-40 sm:col-span-2 lg:col-span-2" label="Currently">
          <div>
            <div className="text-[0.95rem] font-medium text-text">Full Stack Engineer</div>
            <div className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">
              Web Synergies India
              <span className="text-dim"> — a Yokogawa company</span>
            </div>
            <div className="label-mono mt-3 text-accent">Aug 2024 — Present</div>
          </div>
        </BentoCard>

        <BentoCard
          className="min-h-40 sm:col-span-2 lg:col-span-2"
          label="Résumé"
          href="/Mrityunjay_Resume.pdf"
          download
        >
          <p className="text-[0.94rem] leading-relaxed text-muted">
            Full history, skills and metrics — one page, as a PDF.
          </p>
        </BentoCard>

        <BentoCard className="sm:col-span-4 lg:col-span-6" label="Selected impact">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
            {IMPACT.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[1.9rem] leading-none font-medium tabular-nums text-accent">
                  {s.value}
                </dt>
                <dd className="mt-2">
                  <span className="block text-[0.86rem] font-medium text-text">{s.label}</span>
                  <span className="mt-0.5 block text-[0.78rem] leading-snug text-dim">
                    {s.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </BentoCard>

        <BentoCard className="min-h-44 sm:col-span-2 lg:col-span-4" label="Stack">
          <ul className="flex flex-col gap-2.5">
            {STACK.map((row) => (
              <li key={row.area} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <span className="label-mono w-20 shrink-0 pt-0.5 text-dim">{row.area}</span>
                <span className="text-[0.86rem] leading-relaxed text-muted">{row.items}</span>
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard className="min-h-44 sm:col-span-2 lg:col-span-2" label="Education">
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-[0.88rem] font-medium text-text">Bachelors - Computer Science</div>
              {/* <div className="mt-0.5 text-[0.8rem] leading-snug text-dim">
                Priyadarshini J L College of Engineering, Nagpur
              </div> */}
              <div className="label-mono mt-1.5 text-dim">2021 — 2024</div>
            </div>
            <div>
              <div className="text-[0.88rem] font-medium text-text">Diploma -Computer Technology</div>
              {/* <div className="mt-0.5 text-[0.8rem] leading-snug text-dim">
                Priyadarshini Polytechnic, Nagpur
              </div> */}
              <div className="label-mono mt-1.5 text-dim">2019 — 2021</div>
            </div>
          </div>
        </BentoCard>
      </motion.div>
    </section>
  );
}
