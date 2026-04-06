"use client";

import React, { useEffect, useRef } from "react";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const GREEN = "#6f8a3b"; // oklch(0.495 0.085 131.2)
const GREEN2 = "#8aaa4a";
const GOLD = "#d8a027"; // oklch(0.745 0.165 85.5)
const GOLD2 = "#eebb45";
const DARK = "#3e3e40"; // logo trunk / silhouette

const LOOP_MS = 4000; // one full cycle duration

// ─── Easing helpers ──────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, x));
const norm = (t: number, a: number, b: number) =>
  clamp((t - a) / (b - a), 0, 1);
const eio = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const eout = (t: number) => 1 - (1 - t) * (1 - t);

// ─── Drawing helpers ─────────────────────────────────────────────────────────

function drawFeather(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  dir: "L" | "R",
  color: string,
  colorLight: string,
  size: number,
  alpha: number,
  pulse: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(dir === "L" ? Math.PI * 0.08 : -Math.PI * 0.08);
  if (dir === "R") ctx.scale(-1, 1);

  const s = size * pulse;

  // Central quill
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.lineTo(0, -s);
  ctx.stroke();

  // Barbs
  const N = 11;
  for (let i = 0; i < N; i++) {
    const frac = i / (N - 1);
    const y = lerp(s * 0.28, -s * 0.88, frac);
    const spread = s * 0.38 * Math.sin(Math.PI * (frac * 0.9 + 0.05));
    const curve = spread * 0.35;
    const tipY = y - spread * 0.55;
    const a2 = alpha * (0.55 + 0.45 * Math.sin(Math.PI * frac));

    ctx.globalAlpha = a2;
    ctx.strokeStyle = frac > 0.55 ? colorLight : color;
    ctx.lineWidth = frac > 0.7 ? 0.9 : 1.3;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(-spread * 0.5, y - curve, -spread, tipY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(spread * 0.5, y - curve, spread, tipY);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLogoTree(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  alpha: number,
  scale: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Canopy – green leaf cluster oval
  const cg = ctx.createRadialGradient(0, -78, 10, 0, -60, 72);
  cg.addColorStop(0, GREEN2);
  cg.addColorStop(0.6, GREEN);
  cg.addColorStop(1, "#4a6228");
  ctx.fillStyle = cg;
  ctx.beginPath();
  ctx.ellipse(0, -70, 68, 56, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gold accent dots (icon clusters in canopy)
  const dots: [number, number][] = [
    [-38, -90],
    [-20, -102],
    [5, -108],
    [28, -100],
    [48, -84],
    [-50, -72],
    [-30, -60],
    [42, -68],
    [55, -56],
    [-15, -52],
    [20, -50],
  ];
  dots.forEach(([dx, dy]) => {
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    if (Math.abs(dx + dy) % 3 === 0) {
      ctx.fillStyle = GOLD2;
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Dark trunk & branches
  ctx.strokeStyle = DARK;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Trunk
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 52);
  ctx.bezierCurveTo(0, 30, -2, 10, 0, -18);
  ctx.stroke();

  // Main branches
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.bezierCurveTo(-16, -18, -36, -28, -48, -50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.bezierCurveTo(16, -18, 36, -28, 46, -50);
  ctx.stroke();

  // Secondary branches
  ctx.lineWidth = 3.5;
  const branches: [number, number, number, number, number, number][] = [
    [-28, -34, -36, -44, -44, -52],
    [28, -34, 36, -44, 42, -52],
  ];
  branches.forEach(([x1, y1, cx1, cy1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cx1, cy1, x2 - 2, y2 - 4, x2, y2);
    ctx.stroke();
  });

  ctx.lineWidth = 3;
  const sub: [number, number, number, number, number, number][] = [
    [-44, -54, -50, -60, -42, -80],
    [42, -56, 46, -64, 36, -82],
    [0, -18, 4, -40, 0, -80],
  ];
  sub.forEach(([x1, y1, cx1, cy1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cx1, cy1, x2, y2 - 4, x2, y2);
    ctx.stroke();
  });

  ctx.lineWidth = 2;
  const tiny: [number, number, number, number][] = [
    [-20, -50, -28, -62],
    [-48, -64, -38, -76],
    [22, -52, 30, -64],
    [46, -66, 36, -78],
    [-6, -60, 6, -72],
  ];
  tiny.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // ── Girl silhouette (left) ──────────────────────────────────────
  ctx.fillStyle = DARK;

  // Body
  ctx.beginPath();
  ctx.ellipse(-22, 44, 9, 14, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(-24, 26, 8, 0, Math.PI * 2);
  ctx.fill();
  // Ponytail
  ctx.beginPath();
  ctx.moveTo(-21, 20);
  ctx.quadraticCurveTo(-12, 16, -10, 22);
  ctx.lineWidth = 3;
  ctx.strokeStyle = DARK;
  ctx.stroke();
  // Book
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  (ctx as any).roundRect(-32, 38, 14, 10, 2);
  ctx.fill();
  // Legs
  ctx.fillStyle = DARK;
  ctx.beginPath();
  ctx.ellipse(-26, 56, 7, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── Boy silhouette (right) ──────────────────────────────────────
  ctx.fillStyle = DARK;

  // Body
  ctx.beginPath();
  ctx.ellipse(22, 44, 9, 14, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(24, 26, 8, 0, Math.PI * 2);
  ctx.fill();
  // Device
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  (ctx as any).roundRect(18, 38, 14, 10, 2);
  ctx.fill();
  ctx.fillStyle = DARK;
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText("</>", 25, 47);
  // Legs
  ctx.fillStyle = DARK;
  ctx.beginPath();
  ctx.ellipse(26, 56, 7, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Ground shadow
  ctx.strokeStyle = "rgba(62,62,64,0.2)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-55, 60);
  ctx.lineTo(55, 60);
  ctx.stroke();

  ctx.restore();
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2 + t * 0.5;
    const dist = 18 + t * 55;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist - t * 25;
    const pa = alpha * (1 - t) * (0.3 + 0.5 * Math.sin(angle * 2.3));
    if (pa <= 0.01) continue;
    ctx.save();
    ctx.globalAlpha = pa;
    ctx.fillStyle = i % 3 === 0 ? GOLD2 : i % 3 === 1 ? GREEN2 : GOLD;
    ctx.beginPath();
    ctx.arc(x, y, i % 4 === 0 ? 3 : 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawWordmark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  alpha: number,
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // AiMS NATION gradient text
  ctx.font = "600 20px system-ui, -apple-system, sans-serif";
  const wg = ctx.createLinearGradient(cx - 60, cy, cx + 60, cy);
  wg.addColorStop(0, GOLD);
  wg.addColorStop(0.45, GOLD);
  wg.addColorStop(0.55, GREEN);
  wg.addColorStop(1, GREEN);
  ctx.fillStyle = wg;
  ctx.fillText("AiMS NATION", cx, cy);

  // Tagline
  ctx.font = "400 9.5px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = GREEN;
  ctx.globalAlpha = alpha * 0.7;
  ctx.fillText("Guiding Futures With a Parents Heart", cx, cy + 26);

  ctx.restore();
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AiMSNationLoaderProps {
  /** Canvas width in px (scales via CSS to 100% container width) */
  width?: number;
  /** Canvas height in px */
  height?: number;
  /** Extra className on the wrapper div */
  className?: string;
}

export default function AiMSNationLoader({
  width = 460,
  height = 300,
  className = "",
}: AiMSNationLoaderProps) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    // Retina / HiDPI scaling
    const dpr = window.devicePixelRatio || 1;
    cv.width = width * dpr;
    cv.height = height * dpr;
    cv.style.width = `${width}px`;
    cv.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const W = width;
    const H = height;
    const CX = W / 2;
    const CY = H / 2 - 20;

    let t0: number | null = null;

    function frame(ts: number) {
      if (!t0) t0 = ts;
      const elapsed = (ts - t0) % LOOP_MS;
      const p = elapsed / LOOP_MS;

      ctx!.clearRect(0, 0, W, H);

      const pulse = 1 + 0.04 * Math.sin(ts / 280);

      // Stage 1 — feathers fly in  (0 → 0.27)
      if (p < 0.27) {
        const t = eio(norm(p, 0, 0.27));
        const lx = lerp(-70, CX, t);
        const rx = lerp(W + 70, CX, t);
        const fy = CY - 14 + Math.sin(ts / 400) * 5;
        drawFeather(ctx!, lx, fy, "L", GOLD, GOLD2, 68, 1, pulse);
        drawFeather(ctx!, rx, fy, "R", GREEN, GREEN2, 68, 1, pulse);
      }

      // Stage 2 — merge → logo tree  (0.27 → 0.60)
      else if (p < 0.6) {
        const t = eout(norm(p, 0.27, 0.6));
        const fA = clamp(1 - t * 3.2, 0, 1);
        const trA = eout(norm(t, 0.12, 1.0));
        const pA = clamp(
          eout(norm(t, 0, 0.35)) * (1 - norm(t, 0.35, 0.8)),
          0,
          1,
        );
        const trS = lerp(0.15, 1.0, eout(norm(t, 0.05, 0.95)));

        if (fA > 0.01) {
          drawFeather(ctx!, CX + 4, CY - 14, "L", GOLD, GOLD2, 68, fA, 1);
          drawFeather(ctx!, CX - 4, CY - 14, "R", GREEN, GREEN2, 68, fA, 1);
        }
        drawParticles(ctx!, CX, CY - 14, norm(t, 0, 0.5), pA);
        drawLogoTree(ctx!, CX, CY + 10, trA, trS);
      }

      // Stage 3 — tree holds, wordmark rises  (0.60 → 0.82)
      else if (p < 0.82) {
        const t = norm(p, 0.6, 0.82);
        const tPulse = 1 + 0.025 * Math.sin(ts / 200);
        const wA = eout(norm(t, 0.1, 0.85));
        drawLogoTree(ctx!, CX, CY + 10, 1, tPulse);
        drawWordmark(ctx!, CX, CY + 130, wA);
      }

      // Stage 4 — fade out  (0.82 → 1.00)
      else {
        const t = eio(norm(p, 0.82, 1.0));
        const fade = 1 - t;
        drawLogoTree(ctx!, CX, CY + 10, fade, 1);
        drawWordmark(ctx!, CX, CY + 130, fade * eout(norm(1 - t, 0, 0.8)));
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height]);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ minHeight: height }}
    >
      <canvas
        ref={cvRef}
        aria-label="AiMS Nation – loading"
        role="img"
        style={{ display: "block" }}
      />
    </div>
  );
}

// ─── Full-page loading overlay ───────────────────────────────────────────────

export function AiMSNationLoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950">
      <AiMSNationLoader width={460} height={300} />
    </div>
  );
}

// ─── Inline / skeleton-replacement loader ───────────────────────────────────

export function AiMSNationInlineLoader({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center w-full py-12 ${className}`}
    >
      <AiMSNationLoader width={320} height={220} />
    </div>
  );
}
