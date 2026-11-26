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
 * 0–0.35 vòm morph tại chỗ thành khối vuông, fill vàng từ dưới lên · 0.35–1 khối vàng phóng to tại chỗ
 * (tâm phóng là tâm vòm) cho tới khi phủ viewport, nối liền nền vàng của Break Section. Icon khác giữ nguyên.
 * Đặt component này bên trong section Hero; Hero đánh dấu phần tử bằng data-arch, data-arch-fill.
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
      // Giữ nguyên vị trí (như acronym.lol): các icon khác đứng yên, vòm morph và phóng to tại chỗ.
      const cover = () => {
        const oy = ARCH.top + ARCH.h / 2 - Math.max(0, HERO_H - vh()); // tâm vòm theo toạ độ viewport
        const ox = (vw() - 1920) / 2 + ARCH.left + ARCH.w / 2;
        const sy = (2 * Math.max(oy, vh() - oy)) / ARCH.h;
        const sx = (2 * Math.max(ox, vw() - ox)) / ARCH.w;
        return Math.max(sx, sy) * 1.08;
      };
      tl.fromTo(
        arch,
        { borderRadius: "140.5px 140.5px 0px 0px" },
        { borderRadius: "20px 20px 20px 20px", duration: 0.35, ease: "power1.inOut" },
        0,
      )
        .fromTo(fill, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35 }, 0)
        .to(arch, { scale: cover, duration: 0.65, ease: "power2.in" }, 0.35);
    }, hero);
    return () => ctx.revert();
  }, []);
  return <span ref={marker} hidden />;
}
