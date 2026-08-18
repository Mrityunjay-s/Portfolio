import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
  eyebrow?: string;
};

export default function SectionHeading({ children, eyebrow }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      {eyebrow ? <p className="label-mono mb-3 text-dim">{eyebrow}</p> : null}
      <h2 className="max-w-[18ch] text-[clamp(1.7rem,4vw,3rem)] font-[680] leading-[1.02] tracking-[-0.035em] text-balance">
        {children}
      </h2>
    </div>
  );
}
