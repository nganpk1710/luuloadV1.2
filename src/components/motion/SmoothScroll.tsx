"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pageZoom, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis là nguồn duy nhất điều khiển scroll, đồng bộ với ScrollTrigger (IMPLEMENTATION mục 4.3). */
export function SmoothScroll() {
  // --vhp: chiều cao viewport theo px của canvas 1920 (đã chia CSS zoom), dùng cho các khối sticky.
  useEffect(() => {
    const set = () =>
      document.documentElement.style.setProperty("--vhp", `${window.innerHeight / pageZoom()}px`);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
