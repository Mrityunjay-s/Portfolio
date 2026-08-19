import React from "react";

/**
 * Hand-placed rather than randomised: the corner is a composition, not a
 * particle system, and fixed values also keep server and client identical so
 * there is nothing to mismatch on hydration.
 *
 * `top`/`right` position the start point, `dur` sets the fall speed and
 * `delay` staggers them so they never travel as a block. A couple are dropped
 * on small screens, where the corner is far tighter.
 */
const METEORS = [
  { char: "{}", top: "6%", right: "6%", dur: 7.5, delay: 0, accent: true },
  { char: "=>", top: "2%", right: "24%", dur: 9, delay: 2.6, accent: false },
  { char: "</>", top: "17%", right: "14%", dur: 8.2, delay: 4.9, accent: false, sm: true },
  { char: "();", top: "9%", right: "36%", dur: 10, delay: 1.4, accent: false, sm: true },
  { char: "[]", top: "26%", right: "4%", dur: 8.6, delay: 6.2, accent: false },
  { char: "&&", top: "22%", right: "29%", dur: 9.4, delay: 3.5, accent: true, sm: true },
  { char: "::", top: "34%", right: "19%", dur: 11, delay: 7.8, accent: false, sm: true },
];

export default function HeroMeteors() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 right-0 h-[70%] w-[62%] overflow-hidden"
    >
      {METEORS.map((m) => (
        <span
          key={m.char + m.top}
          className={`meteor font-mono text-[0.78rem] ${
            m.accent ? "text-accent/70" : "text-text/25"
          } ${m.sm ? "hidden sm:block" : ""}`}
          style={{
            top: m.top,
            right: m.right,
            animationDuration: `${m.dur}s`,
            animationDelay: `${m.delay}s`,
          }}
        >
          {m.char}
        </span>
      ))}
    </div>
  );
}
