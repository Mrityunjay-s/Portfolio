import React from "react";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import { SiAndroid, SiApachekafka, SiDocker, SiKotlin, SiKubernetes, SiSwift } from "react-icons/si";
import { TbPlugConnected } from "react-icons/tb";

const TIERS = {
  near: { size: "0.95rem", trail: 92, mx: -250, my: 310, dim: "text-text/50", hot: "text-accent/90", iconOpacity: 0.88 },
  mid: { size: "0.8rem", trail: 66, mx: -190, my: 235, dim: "text-text/36", hot: "text-accent/75", iconOpacity: 0.74 },
  // Floor kept at 26% so the most distant tier still reads — depth should
  // come from size and travel, not from fading symbols out of sight.
  far: { size: "0.68rem", trail: 48, mx: -140, my: 175, dim: "text-text/26", hot: "text-accent/60", iconOpacity: 0.58 },
} as const;

type Tier = keyof typeof TIERS;

type Base = { top: string; right: string; dur: number; delay: number; tier: Tier; sm?: boolean };
type CharMeteor = Base & { kind: "char"; char: string; accent?: boolean };
type IconMeteor = Base & { kind: "icon"; Icon: IconType; color?: string; accent?: boolean };
type MeteorSpec = CharMeteor | IconMeteor;

const METEORS: MeteorSpec[] = [
  { kind: "char", char: "</>", top: "17%", right: "14%", dur: 8.2, delay: 4.9, tier: "mid", sm: true },
  { kind: "icon", Icon: FaJava, color: "#ED8B00", top: "4%", right: "44%", dur: 8.8, delay: 5.6, tier: "mid" },
  { kind: "icon", Icon: SiKotlin, color: "#7F52FF", top: "30%", right: "38%", dur: 9.6, delay: 1.9, tier: "mid", sm: true },
  { kind: "icon", Icon: SiApachekafka, top: "12%", right: "2%", dur: 10.4, delay: 4.2, tier: "far", accent: true, sm: true },
  { kind: "icon", Icon: SiKubernetes, color: "#326CE5", top: "37%", right: "9%", dur: 9.1, delay: 0.8, tier: "near" },
  { kind: "icon", Icon: SiAndroid, color: "#3DDC84", top: "20%", right: "45%", dur: 10.8, delay: 6.8, tier: "far", sm: true },
  { kind: "icon", Icon: SiSwift, color: "#F05138", top: "8%", right: "31%", dur: 8.4, delay: 3.1, tier: "near", sm: true },
  { kind: "icon", Icon: SiDocker, color: "#2496ED", top: "27%", right: "22%", dur: 9.9, delay: 2.3, tier: "mid" },
  { kind: "icon", Icon: TbPlugConnected, top: "15%", right: "39%", dur: 11.4, delay: 7.4, tier: "far", sm: true },
];

export default function HeroMeteors() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 right-0 h-[70%] w-[62%] overflow-hidden"
    >
      {METEORS.map((m, i) => {
        const tier = TIERS[m.tier];
        const branded = m.kind === "icon" && m.color;
        return (
          <span
            key={i}
            className={`meteor ${m.kind === "icon" ? "meteor-icon flex items-center justify-center" : "font-mono"} ${
              branded ? "" : m.accent ? tier.hot : tier.dim
            } ${m.sm ? "hidden sm:flex" : ""}`}
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
                ...(branded && m.kind === "icon" ? { color: m.color, opacity: tier.iconOpacity } : {}),
              } as React.CSSProperties
            }
          >
            {m.kind === "char" ? m.char : <m.Icon />}
          </span>
        );
      })}
    </div>
  );
}
