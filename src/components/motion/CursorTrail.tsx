"use client";

import { useEffect, useRef } from "react";
import { canHover, prefersReducedMotion } from "@/lib/motion";

const ICONS = [
  "/assets/cursor-trail/icon-01.svg",
  "/assets/cursor-trail/icon-02.svg",
  "/assets/cursor-trail/icon-03.svg",
  "/assets/cursor-trail/icon-03-3.svg",
  "/assets/cursor-trail/icon-03-4.svg",
  "/assets/cursor-trail/icon-03-5.svg",
  "/assets/cursor-trail/icon-03-6.svg",
  "/assets/cursor-trail/icon-04.svg",
];

const SIZE = 32;
const STEP = 56;
const POOL = 16;

/**
 * Cursor trail icon (MOTION mục 12, theo acronym.lol/process). Đặt bên trong một phần tử `relative`;
 * lắng nghe chuột trên phần tử cha. Pool 16 <img> tái sử dụng, animate bằng Web Animations API.
 */
export function CursorTrail() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = layer.current;
    const host = el?.parentElement;
    if (!el || !host || prefersReducedMotion() || !canHover()) return;

    const imgs = Array.from({ length: POOL }, () => {
      const img = document.createElement("img");
      img.alt = "";
      img.width = SIZE;
      img.height = SIZE;
      img.style.cssText = `position:absolute;left:0;top:0;width:${SIZE}px;height:${SIZE}px;opacity:0;will-change:transform,opacity;`;
      el.appendChild(img);
      return img;
    });
    let next = 0;
    let icon = 0;
    let last: { x: number; y: number } | null = null;

    const spawn = (x: number, y: number) => {
      const img = imgs[next];
      next = (next + 1) % POOL;
      img.src = ICONS[icon];
      icon = (icon + 1) % ICONS.length;
      const rot = Math.round(Math.random() * 24 - 12);
      const base = `translate(${x - SIZE / 2}px, ${y - SIZE / 2}px) rotate(${rot}deg)`;
      img.getAnimations().forEach((a) => a.cancel());
      img.animate(
        [
          { opacity: 1, transform: `${base} scale(0.4)` },
          { opacity: 1, transform: `${base} scale(1)`, offset: 0.17 },
          { opacity: 1, transform: `${base} scale(1)`, offset: 0.57 },
          { opacity: 0, transform: `${base} scale(0.6)` },
        ],
        { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    };

    const onMove = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) {
        last = null;
        return;
      }
      const r = host.getBoundingClientRect();
      const scale = r.width / host.offsetWidth || 1; // hỗ trợ CSS zoom/scale
      const x = (e.clientX - r.left) / scale;
      const y = (e.clientY - r.top) / scale;
      if (!last) {
        last = { x, y };
        spawn(x, y);
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < STEP) return;
      const steps = Math.min(Math.floor(dist / STEP), 4);
      for (let s = 1; s <= steps; s++) spawn(last.x + (dx * s) / steps, last.y + (dy * s) / steps);
      last = { x, y };
    };
    const onLeave = () => (last = null);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      imgs.forEach((i) => i.remove());
    };
  }, []);
  return <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" />;
}
