"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { communityBanner } from "@/content/community";

/** Banner 1920 × 990 (MOTION mục 13 · 4): nền phóng nhẹ 1.15 → 1 theo scroll, chữ reveal từng dòng. Ảnh: khối màu placeholder. */
export function CommunityBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.15, 1]);
  return (
    <div ref={ref} className="relative h-[990px] w-[1920px] overflow-hidden bg-blue">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[url('/assets/backgrounds/break-section-texture.png')] bg-cover opacity-20 mix-blend-multiply"
        style={{ scale }}
      />
      <Reveal amount={0.4} className="absolute inset-0 flex flex-col items-center justify-center">
        <h2 className="text-center font-display text-[180px] leading-[170px] font-extrabold text-yellow uppercase">
          {communityBanner.lines.map((l, i) => (
            <span key={l} className="block overflow-hidden py-[0.12em] -my-[0.12em]">
              <span data-reveal className="block" style={{ "--d": i * 120, "--reveal-y": "110%" } as CSSProperties}>
                {l}
              </span>
            </span>
          ))}
        </h2>
      </Reveal>
    </div>
  );
}
