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

/**
 * Khung ảnh giữa: 912 × 570 (tỉ lệ ảnh gốc 736 × 460), nằm giữa 2 cột chữ (x 512 → 1424).
 * Ảnh lân cận đẩy lùi ra sau và nghiêng với mép xa lật về phía người xem, như reference
 * (Feature_projects.mp4): ảnh trên rộng ở mép trên, ảnh dưới rộng ở mép dưới, cả hai nhỏ hơn ảnh giữa.
 */
const IMG = { w: 912, h: 570, left: 512, centerY: 612 };
const STACK = {
  y: 668, // khoảng cách tâm giữa 2 ảnh (px, trước phối cảnh)
  z: 250, // đẩy lùi mỗi bậc
  tilt: 30, // độ nghiêng mỗi bậc
  perspective: 1400,
};
const STEP = 0.6; // số viewport cuộn cho mỗi ảnh

function place(el: HTMLElement, d: number) {
  const a = Math.min(Math.abs(d), 2.5);
  const s = Math.sign(d);
  el.style.transform = `translate3d(0, ${s * a * STACK.y}px, ${-a * STACK.z}px) rotateX(${s * Math.min(a, 1) * STACK.tilt}deg)`;
  el.style.zIndex = String(10 - Math.round(a * 2));
  el.style.visibility = a > 2.2 ? "hidden" : "visible";
}

/**
 * Projects 1920 × 1144 (Figma 2718:429). Bố cục giữ nguyên, nền lưới sáng (Grid.png).
 * Section dính (sticky) trong khung cao 1144 + 3 × 0.6 viewport; cột phải đổi theo ảnh ở giữa (MOTION mục 4).
 */
export function Projects() {
  const section = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const items = projects.items;
  const last = items.length - 1;

  useEffect(() => {
    const el = section.current;
    const els = cards.current.filter(Boolean) as HTMLDivElement[];
    if (!el) return;
    const render = (p: number) => els.forEach((c, i) => place(c, i - p));
    render(0);
    if (prefersReducedMotion()) return;
    const state = { p: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: last,
        ease: "none",
        onUpdate: () => {
          render(state.p);
          setActive(Math.round(state.p));
        },
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top top",
          end: () => `+=${window.innerHeight * last * STEP}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [last]);

  const item = items[active];

  return (
    <div style={{ height: `calc(1144px + ${last * STEP} * var(--vhp, 1080px))` }}>
      <section
        ref={section}
        aria-labelledby="projects-title"
        className="sticky top-0 h-[1144px] w-[1920px] overflow-hidden bg-[#E6E6E6] bg-[url('/assets/backgrounds/grid-light.png')] bg-[length:1920px_1680px] bg-top text-ink"
      >
        {/* Chồng ảnh 3D */}
        <div aria-hidden={false} className="absolute inset-0" style={{ perspective: STACK.perspective, perspectiveOrigin: `${IMG.left + IMG.w / 2}px ${IMG.centerY}px` }}>
          {items.map((it, i) => (
            <div
              key={it.name}
              ref={(n) => {
                cards.current[i] = n;
              }}
              className="absolute overflow-hidden bg-ink will-change-transform"
              style={{ left: IMG.left, top: IMG.centerY - IMG.h / 2, width: IMG.w, height: IMG.h }}
            >
              <Image src={it.image} alt={it.alt} fill sizes="912px" className="object-cover" priority={i < 2} />
            </div>
          ))}
        </div>

        <h2
          id="projects-title"
          className="text-trim absolute top-[200px] left-8 z-20 w-[472px] font-display text-[120px] leading-[107.273px] font-extrabold uppercase"
        >
          {projects.title}
        </h2>
        <p className="text-trim absolute top-[464px] left-8 z-20 w-[440px] text-[24px] leading-[39px] font-medium uppercase">
          {projects.subtitle}
        </p>
        <PillLink variant="dark" href={projects.cta.href} className="absolute top-[761px] left-8 z-20 w-[164px]">
          {projects.cta.label}
        </PillLink>

        {/* Cột phải: đổi theo ảnh ở giữa */}
        <div className="absolute top-[200px] left-[1448px] z-20 w-[440px]" aria-live="polite">
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
    </div>
  );
}
