import React from "react";

/**
 * Three depth tiers. Size, brightness, trail length and travel distance all
 * move together: a near symbol is bigger, brighter, streaks further and
 * crosses more ground in a pass, while a far one barely drifts. Varying them
 * independently would read as inconsistency rather than depth.
 */
const TIERS = {
  near: { size: "0.95rem", trail: 92, mx: -250, my: 310, dim: "text-text/50", hot: "text-accent/90" },
  mid: { size: "0.8rem", trail: 66, mx: -190, my: 235, dim: "text-text/36", hot: "text-accent/75" },
  // Floor kept at 26% so the most distant tier still reads — depth should
  // come from size and travel, not from fading symbols out of sight.
  far: { size: "0.68rem", trail: 48, mx: -140, my: 175, dim: "text-text/26", hot: "text-accent/60" },
} as const;

type Tier = keyof typeof TIERS;

/**
 * Hand-placed rather than randomised: the corner is a composition, not a
 * particle system, and fixed values also keep server and client identical so
 * there is nothing to mismatch on hydration.
 *
 * Duration tracks the tier — nearer symbols pass through faster, which is what
 * sells the parallax. A couple are dropped on small screens, where the corner
 * is far tighter.
 */
const METEORS: {
  char: string;
  top: string;
  right: string;
  dur: number;
  delay: number;
  tier: Tier;
  accent?: boolean;
  sm?: boolean;
}[] = [
  { char: "{}", top: "6%", right: "6%", dur: 7.5, delay: 0, tier: "near", accent: true },
  { char: "=>", top: "2%", right: "24%", dur: 9, delay: 2.6, tier: "mid" },
  { char: "</>", top: "17%", right: "14%", dur: 8.2, delay: 4.9, tier: "mid", sm: true },
  { char: "()", top: "9%", right: "36%", dur: 10, delay: 1.4, tier: "far", sm: true },
  { char: "[]", top: "26%", right: "4%", dur: 8.6, delay: 6.2, tier: "near" },
  { char: "&&", top: "22%", right: "29%", dur: 9.4, delay: 3.5, tier: "mid", accent: true, sm: true },
  { char: "::", top: "34%", right: "19%", dur: 11, delay: 7.8, tier: "far", sm: true },
];

export default function HeroMeteors() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 right-0 h-[70%] w-[62%] overflow-hidden"
    >
      {METEORS.map((m) => {
        const tier = TIERS[m.tier];
        return (
          <span
            key={m.char + m.top}
            className={`meteor font-mono ${m.accent ? tier.hot : tier.dim} ${
              m.sm ? "hidden sm:block" : ""
            }`}
            style={
              {
                top: m.top,
                right: m.right,
                fontSize: tier.size,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
                "--trail": `${tier.trail}px`,
                "--mx": `${tier.mx}px`,
                "--my": `${tier.my}px`,
              } as React.CSSProperties
            }
          >
            {m.char}
          </span>
        );
      })}
    </div>
  );
}
