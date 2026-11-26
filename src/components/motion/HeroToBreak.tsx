"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pageZoom, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Vòm Hero (Figma 2727:1131): 281 × 230.765 tại (820, 1328) trong Hero 1920 × 1680. */
const ARCH = { left: 820, top: 1328, w: 281, h: 230.765 };
const HERO_H = 1680;

/**
 * Hero → Break (MOTION mục 3). Hero dính (sticky) khi đáy Hero chạm đáy viewport, rồi scrub:
 * 0–0.15 icon tách ra hai bên, vòm về tâm · 0.15–0.45 morph vòm → khối vuông, fill vàng từ dưới lên ·
 * 0.45–1 khối vàng phóng to phủ viewport, nối liền nền vàng của Break Section.
 * Đặt component này bên trong section Hero; Hero đánh dấu phần tử bằng data-arch, data-arch-fill, data-hero-side, data-hero-fade.
 */
export function HeroToBreak() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const hero = marker.current?.closest("section");
    if (!hero || prefersReducedMotion()) return;
    const arch = hero.querySelector<HTMLElement>("[data-arch]");
    const fill = hero.querySelector<HTMLElement>("[data-arch-fill]");
    if (!arch || !fill) return;

    const ctx = gsap.context(() => {
      /** Toạ độ theo px của canvas 1920 (trang có thể bị CSS zoom khi xem ở màn nhỏ). */
      const zoom = pageZoom;
      const vw = () => window.innerWidth / zoom();
      const vh = () => Math.min(window.innerHeight / zoom(), HERO_H);
      const dy = () => vh() / 2 - (ARCH.top + ARCH.h / 2 - (HERO_H - vh()));
      const cover = () => Math.max(vw() / ARCH.w, vh() / ARCH.h) * 1.15;

      // Không dùng pin của GSAP (lệch khi trang bị CSS zoom): Hero nằm trong khung cao 1680 + 1.5 viewport
      // và tự dính bằng CSS sticky (xem app/page.tsx). ScrollTrigger chỉ đọc tiến độ cuộn.
      const frame = hero.parentElement?.parentElement ?? hero;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: frame,
          start: () => `top+=${Math.max(0, HERO_H - vh()) * zoom()} top`,
          end: () => `+=${window.innerHeight * 1.5}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(hero.querySelectorAll('[data-hero-side="left"]'), { x: -80, autoAlpha: 0, duration: 0.15 }, 0)
        .to(hero.querySelectorAll('[data-hero-side="right"]'), { x: 80, autoAlpha: 0, duration: 0.15 }, 0)
        .to(hero.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, duration: 0.12 }, 0)
        .to(arch, { y: dy, duration: 0.15 }, 0)
        .fromTo(
          arch,
          { borderRadius: "140.5px 140.5px 0px 0px" },
          { borderRadius: "20px 20px 20px 20px", duration: 0.3, ease: "power1.inOut" },
          0.15,
        )
        .fromTo(fill, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3 }, 0.15)
        .to(arch, { scale: cover, duration: 0.55, ease: "power2.in" }, 0.45);
    }, hero);
    return () => ctx.revert();
  }, []);
  return <span ref={marker} hidden />;
}
