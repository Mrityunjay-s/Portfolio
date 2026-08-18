"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  /** 0 at the far arc, 1 at the near edge — drives size and brightness. */
  d: number;
  /** Per-dot brightness jitter so the grid doesn't read as uniform. */
  v: number;
  ph: number;
};

const ACCENT = "198,245,60";
const BASE = "190,193,183";

// Shape of the projected surface, in world space before perspective.
//   CURVE bows the edges downward — 0 is a flat plane, higher closes it into
//         a dome.
//   TILT  leans the surface so one side rides higher than the other.
//   APEX  slides the whole surface vertically without reshaping it.
const CURVE = 0.084;
const TILT = 0.4;
const APEX = -0.065;

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHover = window.matchMedia("(hover: hover)").matches;

    let W = 0;
    let H = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let idle = 0;
    const t0 = performance.now();
    const pointer = { x: -9999, y: -9999, active: false };
    const glow = { x: 0, y: 0, on: 0 };

    function build() {
      const rect = canvas!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      if (!W || !H) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // A surface seen from below. Depth z runs from near (bottom of screen)
      // to far (the horizon near the top). Screen position scales with 1/z,
      // so rows bunch toward the horizon on their own; CURVE and TILT then
      // shape the surface itself. See the constants at the top of the file.
      const Z_NEAR = 1.0;
      const Z_FAR = 2.6;
      const F_FAR = 1 / Z_FAR;
      const F_NEAR = 1 / Z_NEAR;

      const kx = W * 0.9;
      const ky = H * 1.512;
      const horizon = -H * 0.462 - H * APEX;

      // Derive the world-space column step from how far apart the tightest
      // (far) row should read on screen, so density holds across viewports.
      const farGapPx = W < 620 ? 15 : W < 1100 ? 17 : 19;
      const dx = farGapPx / (F_FAR * kx);
      const rows = W < 620 ? 26 : 34;
      // Generous overscan: near rows travel up to ~107px under parallax, so
      // the field must extend well past the viewport or swinging the sheet
      // would expose bare edges.
      const margin = 200;

      const next: Dot[] = [];

      for (let j = 0; j < rows; j++) {
        const rt = j / (rows - 1);
        const z = Z_NEAR + rt * (Z_FAR - Z_NEAR);
        const f = 1 / z;

        if (dx * f * kx < 4) continue;

        const iMax = Math.floor((W / 2 + margin) / (f * kx) / dx);

        for (let i = -iMax; i <= iMax; i++) {
          const x = i * dx;
          const sx = W / 2 + x * f * kx;
          const sy = horizon + (1 + CURVE * x * x + TILT * x) * f * ky;

          if (sy > H + margin || sy < -margin) continue;

          next.push({
            x: sx,
            y: sy,
            d: (f - F_FAR) / (F_NEAR - F_FAR),
            v: 0.7 + (((i * 7 + j * 13) % 11) / 11) * 0.55,
            ph: ((((i * 12.9898 + j * 78.233) % 6.283) + 6.283) % 6.283),
          });
        }
      }

      dots = next;
    }

    function frame(now: number) {
      if (!W || !H) {
        build();
        raf = requestAnimationFrame(frame);
        return;
      }

      const time = (now - t0) / 1000;
      ctx!.clearRect(0, 0, W, H);

      // Drift an attractor only when there is no cursor to follow: before the
      // first move, after the pointer leaves the window, or on touch devices
      // once a drag has gone idle. A mouse that is simply held still keeps
      // the glow exactly where the user left it.
      const idleLimit = hasHover ? Infinity : 3;
      const auto = (!pointer.active || idle > idleLimit) && !reduce;
      const ax = auto ? W * (0.5 + Math.cos(time * 0.42) * 0.29) : pointer.x;
      const ay = auto ? H * (0.52 + Math.sin(time * 0.31) * 0.24) : pointer.y;
      const lit = pointer.active || auto;

      // Track quickly when following a real cursor; ease when drifting.
      const chase = auto ? 0.09 : 0.24;
      glow.x += (ax - glow.x) * chase;
      glow.y += (ay - glow.y) * chase;
      glow.on += ((lit ? 1 : 0) - glow.on) * 0.12;

      // The whole sheet drifts with the cursor, in the same direction. Per-dot
      // depth weighting below makes near rows travel further than the far
      // arc, so it reads as a surface swinging rather than a flat slide.
      // Damped while drifting: at full strength the idle attractor would
      // swing the sheet constantly, which is distracting on touch devices
      // that never get a cursor.
      const parAmp = auto ? 0.3 : 1;
      const parX = (glow.x / W - 0.5) * 2 * 68 * parAmp;
      const parY = (glow.y / H - 0.5) * 2 * 44 * parAmp;

      const R = Math.min(W, H) * 0.3;
      const R2 = R * R;

      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        const dx = p.x - glow.x;
        const dy = p.y - glow.y;
        const q = dx * dx + dy * dy;

        let near = 0;
        // Near rows (d -> 1) swing far more than the distant arc, which is
        // what sells the depth — a uniform shift would just look like a pan.
        const par = 0.32 + p.d * 1.25;
        const px = p.x + parX * par;
        const py = p.y + parY * par;

        if (q < R2) {
          const t = 1 - Math.sqrt(q) / R;
          near = t * t * glow.on;
        }

        const twinkle = reduce ? 0 : Math.sin(time * 0.8 + p.ph) * 0.5 + 0.5;
        const alpha = Math.min(1, (0.3 + p.d * 0.2 + twinkle * 0.09) * p.v + near * 1.1);
        const rad = (1.0 + p.d * 0.5) * (1 + near * 1.35);

        if (near > 0.06) {
          const g = Math.min(1, near * 1.5);
          ctx!.fillStyle = `rgba(${ACCENT},${(alpha * g).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(px, py, rad, 0, 6.2832);
          ctx!.fill();
          if (g < 1) {
            ctx!.fillStyle = `rgba(${BASE},${(alpha * (1 - g) * 0.9).toFixed(3)})`;
            ctx!.beginPath();
            ctx!.arc(px, py, rad * 0.9, 0, 6.2832);
            ctx!.fill();
          }
        } else {
          ctx!.fillStyle = `rgba(${BASE},${alpha.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(px, py, rad, 0, 6.2832);
          ctx!.fill();
        }
      }

      if (glow.on > 0.01) {
        const halo = ctx!.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, R * 0.62);
        halo.addColorStop(0, `rgba(${ACCENT},${(0.13 * glow.on).toFixed(3)})`);
        halo.addColorStop(1, `rgba(${ACCENT},0)`);
        ctx!.fillStyle = halo;
        ctx!.fillRect(glow.x - R, glow.y - R, R * 2, R * 2);

        ctx!.fillStyle = `rgba(${ACCENT},${glow.on.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(glow.x, glow.y, 3.6, 0, 6.2832);
        ctx!.fill();
      }

      idle += 1 / 60;
      raf = requestAnimationFrame(frame);
    }

    function onPointer(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      idle = 0;
    }

    function onLeave() {
      pointer.active = false;
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 130);
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    build();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
