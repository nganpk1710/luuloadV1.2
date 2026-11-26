"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { PillLink } from "@/components/ui/PillLink";
import { projects } from "@/content/sections";
import { ease, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const THETA = 38; // độ giữa 2 ảnh trên trụ
const RADIUS = 820; // px: 2r·sin(θ/2) ≈ 535 = cao ảnh 475 + khe 60
const IMG = { w: 760, h: 475 };

/**
 * Projects 1920 × 1144 (Figma 2718:429). Bố cục giữ nguyên; khung giữa là trụ 3D nằm ngang
 * xoay theo scroll (MOTION mục 4). Pin 3 × 100vh (không dùng snap của ScrollTrigger vì xung đột với Lenis); cột phải đổi theo ảnh active.
 */
export function Projects() {
  const section = useRef<HTMLElement>(null);
  const drum = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = projects.items;
  const last = items.length - 1;

  useEffect(() => {
    const el = section.current;
    const d = drum.current;
    if (!el || !d || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(d, { z: -RADIUS, rotateX: 0 });
      gsap.to(d, {
        rotateX: last * THETA,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${last * 100}%`,
          pin: true,
          scrub: 0.6,
          onUpdate: (st) => setActive(Math.round(st.progress * last)),
        },
      });
    }, el);
    return () => ctx.revert();
  }, [last]);

  const item = items[active];

  return (
    <section
      ref={section}
      aria-labelledby="projects-title"
      className="relative h-[1144px] w-[1920px] overflow-hidden bg-white text-ink"
    >
      <h2
        id="projects-title"
        className="text-trim absolute top-[200px] left-8 w-[472px] font-display text-[120px] leading-[107.273px] font-extrabold uppercase"
      >
        {projects.title}
      </h2>
      <p className="text-trim absolute top-[464px] left-8 w-[440px] text-[24px] leading-[39px] font-medium uppercase">
        {projects.subtitle}
      </p>
      <PillLink variant="dark" href={projects.cta.href} className="absolute top-[761px] left-8 w-[164px]">
        {projects.cta.label}
      </PillLink>

      {/* Trụ 3D */}
      <div
        className="absolute top-[215.67px] left-[580px] h-[793.67px] w-[760px] overflow-hidden"
        style={{ perspective: 1400 }}
      >
        <div
          ref={drum}
          className="absolute top-1/2 left-0 h-0 w-full"
          style={{ transformStyle: "preserve-3d", transform: `translateZ(-${RADIUS}px)` }}
        >
          {items.map((it, i) => (
            <div
              key={it.name}
              className="absolute left-0 overflow-hidden bg-[#EDEDED] [backface-visibility:hidden]"
              style={{
                width: IMG.w,
                height: IMG.h,
                top: -IMG.h / 2,
                transform: `rotateX(${-i * THETA}deg) translateZ(${RADIUS}px)`,
              }}
            >
              <Image src={it.image} alt={it.alt} fill sizes="760px" className="object-cover" priority={i < 2} />
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: đổi theo ảnh active */}
      <div className="absolute top-[200px] left-[1448px] w-[440px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: ease.out } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.18, ease: ease.out } }}
          >
            <p className="text-trim absolute top-0 left-0 font-display text-[20px] leading-[107.273px] font-bold uppercase">
              {item.index}
            </p>
            <p className="text-trim absolute top-[39px] left-0 font-display text-[60px] leading-[107.273px] font-extrabold whitespace-nowrap uppercase">
              {item.name}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.06, duration: 0.3 } }}
              className="text-trim absolute top-[146px] left-0 w-[440px] text-[20px] leading-[30px] font-normal"
            >
              {item.body}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
