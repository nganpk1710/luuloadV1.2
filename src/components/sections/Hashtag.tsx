"use client";

import { useEffect, useRef } from "react";
import { hashtag } from "@/content/sections";
import { prefersReducedMotion } from "@/lib/motion";

const PILL_W = 912;
const GAP = 32;
const SET = ["yellow", "red", "yellow", "red"] as const; // 1 bộ = 4 × 944 = 3776px, phủ được 1920
const SET_W = SET.length * (PILL_W + GAP);
const SPEED = 80; // px/s

const tones = {
  yellow: "bg-yellow text-ink",
  red: "bg-red text-white",
} as const;

/**
 * Hashtag 1920 × 598 (Figma 2718:594), 2 hàng marquee chạy ngược chiều (MOTION mục 6, 7).
 * Hàng trên bắt đầu ở x=32, hàng dưới ở x=−424 như Figma. Hover dải: chậm lại 20%.
 * Cuộn trang nhanh: marquee tăng tốc tạm thời theo hướng cuộn.
 */
export function Hashtag() {
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = rows.current.filter(Boolean) as HTMLDivElement[];
    const offsets = [32, -424];
    const dirs = [-1, 1];
    const pos = [0, 0];
    let factor = 1;
    let target = 1;
    let boost = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;

    const loop = (t: number) => {
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      const y = window.scrollY;
      const v = (y - lastY) / Math.max(dt, 0.001);
      lastY = y;
      boost += (Math.max(-2, Math.min(2, v / 1500)) - boost) * 0.08;
      factor += (target - factor) * 0.08;
      els.forEach((el, i) => {
        const dir = dirs[i] * (1 + Math.abs(boost)) * (boost < -0.05 ? -1 : 1);
        pos[i] = (pos[i] + dir * SPEED * factor * dt) % SET_W;
        const x = offsets[i] + (pos[i] > 0 ? pos[i] - SET_W : pos[i]);
        el.style.transform = `translate3d(${x}px,0,0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const strip = els[0]?.parentElement;
    const slow = () => (target = 0.2);
    const normal = () => (target = 1);
    strip?.addEventListener("pointerenter", slow);
    strip?.addEventListener("pointerleave", normal);
    return () => {
      cancelAnimationFrame(raf);
      strip?.removeEventListener("pointerenter", slow);
      strip?.removeEventListener("pointerleave", normal);
    };
  }, []);

  return (
    <section aria-label={hashtag.text} className="relative h-[598px] w-[1920px] overflow-hidden bg-white">
      <p className="sr-only">{hashtag.text}</p>
      <div aria-hidden className="absolute inset-x-0 top-[159px] h-[310px]">
        {[0, 1].map((row) => (
          <div
            key={row}
            ref={(el) => {
              rows.current[row] = el;
            }}
            className="absolute left-0 flex gap-8 will-change-transform"
            style={{ top: row === 0 ? 0 : 170, transform: `translate3d(${row === 0 ? 32 : -424}px,0,0)` }}
          >
            {[...SET, ...SET].map((tone, i) => (
              <div
                key={i}
                className={`hashtag-pill relative h-[140px] w-[912px] shrink-0 ${row === 0 ? "[--tilt:-3deg]" : "[--tilt:3deg]"}`}
              >
                <div className={`hashtag-face hashtag-front ${tones[tone]}`}>
                  <span className="text-trim font-display text-[80px] leading-[107.273px] font-extrabold whitespace-nowrap uppercase">
                    {hashtag.text}
                  </span>
                </div>
                <div className="hashtag-face hashtag-back bg-ink text-yellow">
                  <span className="text-trim font-display text-[80px] leading-[107.273px] font-extrabold whitespace-nowrap uppercase">
                    {hashtag.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
