"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { communityHero } from "@/content/community";

/** Hero /community 1920 × 1478, nền vàng (MOTION mục 13 · 1). Ảnh dùng khối màu placeholder. */
export function CommunityHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} aria-labelledby="community-hero-title" className="relative h-[1478px] w-[1920px] overflow-hidden bg-yellow text-ink">
      {communityHero.photos.map((p, i) => (
        <Photo key={i} index={i} progress={scrollYProgress} {...p} />
      ))}

      <div className="absolute top-[520px] left-0 z-[2] w-full text-center">
        <p className="ch-rise text-[16px] leading-none font-bold tracking-[0.18em] uppercase" style={{ "--d": 0 } as CSSProperties}>
          {communityHero.eyebrow}
        </p>
        <h1 id="community-hero-title" className="mt-[56px] font-display text-[240px] leading-[220px] font-extrabold uppercase">
          {communityHero.title.map((line, i) => (
            <span key={line} className="block overflow-hidden py-[0.12em] -my-[0.12em]">
              <span className="ch-line block" style={{ "--d": 120 + i * 100 } as CSSProperties}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="ch-rise mx-auto mt-[48px] w-[620px] text-[24px] leading-[34px] font-medium" style={{ "--d": 420 } as CSSProperties}>
          {communityHero.body}
        </p>
      </div>
    </section>
  );
}

type PhotoProps = (typeof communityHero.photos)[number] & { index: number; progress: MotionValue<number> };

function Photo({ left, top, w, h, rotate, tone, speed, index, progress }: PhotoProps) {
  const y = useTransform(progress, [0, 1], [0, speed * -1478]);
  return (
    <motion.div aria-hidden className="absolute z-[1]" style={{ left, top, width: w, height: h, y }}>
      <div className="ch-pop h-full w-full" style={{ "--d": 200 + index * 80, "--rot": `${rotate}deg` } as CSSProperties}>
        <div
          className={`ch-float h-full w-full border-[12px] border-white shadow-[0_24px_48px_rgba(15,16,16,0.22)] ${tone}`}
          style={{ animationDelay: `-${index * 1.3}s` }}
        />
      </div>
    </motion.div>
  );
}
