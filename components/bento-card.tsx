"use client";

import React, { useRef } from "react";
import clsx from "clsx";

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Renders the card as a link with the corner arrow affordance. */
  href?: string;
  download?: boolean;
  external?: boolean;
  label?: string;
};

export default function BentoCard({
  children,
  className,
  href,
  download,
  external,
  label,
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // The spotlight follows the cursor via CSS custom properties, which keeps
  // the work off React's render path.
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  const body = (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={clsx(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl",
        "border border-line bg-surface p-5 transition-colors duration-200",
        "hover:border-dim",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(198,245,60,0.07), transparent 62%)",
        }}
      />
      <div className="relative flex h-full flex-col justify-between gap-4">
        {children}
        {label ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.95rem] font-medium tracking-[-0.01em]">{label}</span>
            {href ? (
              <span className="text-dim transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">
                ↗
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (!href) return body;

  // The anchor becomes the grid item, so it has to carry the caller's layout
  // classes too — otherwise every linked card collapses to a single column.
  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={clsx("block h-full rounded-2xl", className)}
    >
      {body}
    </a>
  );
}
