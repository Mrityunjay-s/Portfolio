"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Weighted toward brackets and operators — the shapes that read as "code" at
// a glance, rather than letters which would read as text.
const SYMBOLS = [
  "{", "}", "(", ")", "[", "]", "<", ">", ";", ":", "=", "+", "-", "*", "/",
  "|", "&", "!", "?", ".", "#", "$", "%", "^", "~", "_",
  "=>", "||", "&&", "::", "//", "==", "!=", "<=", ">=", "++", "??", "?.", "</>",
];

/** How long the count takes to walk 0 -> 100. */
export const COUNT_MS = 3200;

/** Window over which cells begin lighting; plus SWEEP_DUR it lands on COUNT_MS. */
const SWEEP_SPAN = 2400;
const SWEEP_DUR = 800;

type Cell = { char: string; t: number };

type PageLoaderProps = {
  visible: boolean;
  onCounted?: () => void;
  onExitComplete?: () => void;
};

/**
 * Memoised so the per-frame count in the parent never re-renders the grid.
 * The sweep is pure CSS, driven by each cell's --t.
 */
const SymbolField = React.memo(function SymbolField({
  cells,
  cols,
  rows,
  fieldRef,
}: {
  cells: Cell[];
  cols: number;
  rows: number;
  fieldRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className="absolute inset-0 grid select-none font-mono leading-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        fontSize: cols > 40 ? "0.72rem" : "0.66rem",
      }}
    >
      {cells.map((c, i) => (
        <span
          key={i}
          className="flex items-center justify-center"
          style={{
            color: "rgba(233,234,230,0.07)",
            animation: `loader-sweep ${SWEEP_DUR}ms linear ${(c.t * SWEEP_SPAN).toFixed(0)}ms both`,
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
});

export default function PageLoader({ visible, onCounted, onExitComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef(false);

  // Size the grid from the element itself, falling back to the viewport and
  // then to a sane default. Measuring window alone is not enough: it reports
  // zero in a hidden or not-yet-laid-out pane, which silently yields a grid of
  // no columns and no symbols at all.
  useEffect(() => {
    const el = fieldRef.current;

    function measure() {
      const rect = el?.getBoundingClientRect();
      const w = Math.round(rect?.width || window.innerWidth || 1280);
      const h = Math.round(rect?.height || window.innerHeight || 800);
      const cell = w < 640 ? 34 : 44;
      setGrid({
        cols: Math.max(1, Math.ceil(w / cell)),
        rows: Math.max(1, Math.ceil(h / cell)),
      });
    }

    measure();

    const ro = el ? new ResizeObserver(measure) : null;
    if (el && ro) ro.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [visible]);

  const cells = useMemo<Cell[]>(() => {
    const { cols, rows } = grid;
    if (!cols || !rows) return [];
    const out: Cell[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Diagonal sweep, matching the tilt of the hero's dot field so the
        // loader resolves into the same geometry it hands off to.
        const t = (x / (cols - 1 || 1)) * 0.62 + (y / (rows - 1 || 1)) * 0.38;
        // Hashed from the coordinates rather than randomised: stable across
        // re-renders, and identical on server and client so it cannot cause a
        // hydration mismatch.
        const h = Math.abs(((x * 73856093) ^ (y * 19349663)) >>> 0);
        out.push({ char: SYMBOLS[h % SYMBOLS.length], t });
      }
    }
    return out;
  }, [grid]);

  // Count all the way to 100 rather than stalling short and faking the last
  // stretch. If the document is still loading when the clock runs out, hold at
  // 99 until it settles, so the number never claims to be done before it is.
  useEffect(() => {
    if (!visible) return;

    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad);

    function finish() {
      if (countedRef.current) return;
      countedRef.current = true;
      setProgress(100);
      onCounted?.();
    }

    // Interval rather than requestAnimationFrame: rAF is suspended entirely in
    // a background tab, which would strand a visitor behind a frozen loader
    // until they returned. Progress is derived from elapsed time, so a
    // throttled interval simply catches up instead of falling behind.
    const id = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / COUNT_MS);
      // Gentle ease so the count starts and finishes smoothly.
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const pct = loaded ? eased * 100 : Math.min(eased * 100, 99);

      setProgress(pct);
      if (pct >= 100) finish();
    }, 30);

    // Last resort: never let a stalled `load` event or a throttled timer trap
    // someone on the loader.
    const failsafe = setTimeout(finish, COUNT_MS + 2500);

    return () => {
      clearInterval(id);
      clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
    };
  }, [visible, onCounted]);

  const display = Math.round(visible ? progress : 100);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-200 overflow-hidden bg-ink"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <SymbolField cells={cells} cols={grid.cols} rows={grid.rows} fieldRef={fieldRef} />

          <p className="absolute top-8 left-8 z-10 font-mono text-[0.72rem] tracking-[0.04em] text-text/70 sm:top-10 sm:left-10">
            Mrityunjay Singh<span className="text-accent">.</span>
          </p>

          <div className="absolute bottom-8 left-8 z-10 sm:bottom-10 sm:left-10">
            <div className="label-mono text-dim">Compiling</div>
          </div>

          <div className="absolute right-8 bottom-8 z-10 flex items-start sm:right-10 sm:bottom-10">
            <span className="text-[clamp(4.5rem,18vw,10rem)] leading-[0.85] font-extralight tracking-[-0.04em] tabular-nums text-text">
              {display}
            </span>
            <span className="mt-2 ml-1 text-[clamp(1rem,3vw,1.6rem)] font-extralight text-text/80">
              %
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
