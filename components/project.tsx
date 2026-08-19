"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";

export type ProjectProps = {
  title: string;
  description: string;
  tags: readonly string[];
  imageUrl: StaticImageData;
  index: number;
};

export default function Project({ title, description, tags, imageUrl, index }: ProjectProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-dim"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-surface-2">
        <Image
          src={imageUrl}
          alt={`${title} screenshot`}
          quality={90}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover object-top opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface/90 to-transparent" />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold tracking-[-0.015em]">{title}</h3>
        <p className="text-[0.9rem] leading-relaxed text-muted">{description}</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-dim"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function ProjectSlot({ n }: { n: number }) {
  return (
    <div className="flex min-h-52 flex-col items-start justify-end rounded-2xl border border-dashed border-line p-5 text-dim">
      <div className="label-mono">Slot {n}</div>
      <p className="mt-2 text-[0.9rem] leading-relaxed">
        Room for the next one. Add it in <span className="font-mono text-[0.8rem]">lib/data.ts</span>.
      </p>
    </div>
  );
}
