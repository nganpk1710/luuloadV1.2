"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pageZoom, prefersReducedMotion } from "@/lib/motion";

/**
 * Page transition kiểu slush.app (MOTION mục 11, chốt 26.11):
 * 1. Trang hiện tại thu nhỏ thành tấm giữa màn hình (350ms).
 * 2. Dải tấm trượt sang trái 2 ô (600ms): cuối cùng vàng bên trái, tấm ĐEN viền trắng ở giữa, ĐỎ bên phải.
 *    Các tấm hai bên nghiêng 3D. Trang mới được nạp trong lúc trượt.
 * 3. Tấm đen phóng to phủ kín viewport (350ms), rồi mờ đi để lộ trang mới.
 */
const CARD = 0.36; // tỉ lệ tấm so với viewport
const GAP = 28;
const TILT = 32;

declare global {
  interface Window {
    /** Có trong bản preview 1 file: thay router bằng đổi view. */
    __preview?: { view: string; routes: string[]; go: (href: string) => void };
  }
}

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const page = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const navigate = useEffectEvent((href: string) =>
    window.__preview ? window.__preview.go(href) : router.push(href, { scroll: false }),
  );
  const arrived = useRef<(() => void) | null>(null);

  useEffect(() => {
    arrived.current?.();
    arrived.current = null;
  }, [pathname]);

  // Bản preview 1 file (artifact) không có router: trang báo "đã tới" bằng sự kiện.
  useEffect(() => {
    const f = () => {
      arrived.current?.();
      arrived.current = null;
    };
    window.addEventListener("preview:arrived", f);
    return () => window.removeEventListener("preview:arrived", f);
  }, []);

  const run = useEffectEvent(async (href: string) => {
    const el = page.current;
    const ov = overlay.current;
    if (!el || !ov) return;
    busy.current = true;
    const zoom = pageZoom();
    const vw = window.innerWidth / zoom;
    const vh = window.innerHeight / zoom;
    const w = vw * CARD;
    const step = w + GAP;
    const panels = Array.from(ov.querySelectorAll<HTMLElement>("[data-panel]"));
    const [yellow, black, red] = panels;
    gsap.set(panels, { width: w, height: vh * CARD });
    const lenis = window.__lenis;
    lenis?.stop();

    const originY = window.scrollY / zoom + vh / 2;
    gsap.set(el, { transformOrigin: `50% ${originY}px` });
    gsap.set(ov, { autoAlpha: 1 });
    // Vị trí slot so với tâm: tấm cũ ở 0; vàng ở +1, đen ở +2, đỏ ở +3 rồi cả dải lùi 2 slot.
    gsap.set(yellow, { x: vw / 2 + w, rotateY: -TILT, autoAlpha: 1 });
    gsap.set(black, { x: step * 2, rotateY: -TILT, scale: 1, autoAlpha: 1 });
    gsap.set(red, { x: step * 3, rotateY: -TILT, autoAlpha: 1 });

    const shrink = gsap.timeline();
    shrink
      .to(el, { scale: CARD, borderRadius: 24 / CARD, duration: 0.35, ease: "power2.inOut" }, 0)
      .to(yellow, { x: step, duration: 0.35, ease: "power2.out" }, 0);
    await shrink;

    const slide = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.inOut" } });
    slide
      .to(el, { x: -step * 2 }, 0)
      .to(yellow, { x: -step, rotateY: TILT }, 0)
      .to(black, { x: 0, rotateY: 0 }, 0)
      .to(red, { x: step, rotateY: -TILT }, 0);
    await slide;

    // Nạp trang mới khi tấm đen đã ở giữa (tấm cũ giữ nội dung cũ trong lúc trượt).
    const arrivedP = new Promise<void>((res) => (arrived.current = res));
    navigate(href);
    await Promise.race([arrivedP, new Promise((r) => setTimeout(r, 1500))]);

    // Trang mới đã render bên dưới: đưa về trạng thái gốc, ẩn tới khi tấm đen phủ xong.
    gsap.set(el, { clearProps: "transform,borderRadius,transformOrigin", autoAlpha: 0 });
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    const cover = Math.max(1 / CARD, 1 / CARD) * 1.08;
    const grow = gsap.timeline();
    grow
      .to(black, { scale: cover, duration: 0.35, ease: "power2.in" }, 0)
      .to([yellow, red], { autoAlpha: 0, duration: 0.2 }, 0.05);
    await grow;

    gsap.set(el, { autoAlpha: 1 });
    ScrollTrigger.refresh();
    await gsap.to(ov, { autoAlpha: 0, duration: 0.3, ease: "power1.out" });
    gsap.set([yellow, black, red], { clearProps: "all" });
    lenis?.start();
    busy.current = false;
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      // Dùng href gốc thay vì so origin: trong iframe sandbox origin là "null".
      const raw = a.getAttribute("href") ?? "";
      if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("#")) return;
      const target = raw.replace(/\/$/, "") || "/";
      const preview = window.__preview;
      const current = preview ? preview.view : location.pathname.replace(/\/$/, "") || "/";
      // Chạy ở capture phase để chặn trước <Link> của Next (Link tự điều hướng ở bubble phase).
      e.preventDefault();
      e.stopPropagation();
      if (preview && !preview.routes.includes(target)) return; // trang chưa có trong preview
      if (target === current || busy.current) return;
      if (prefersReducedMotion()) {
        navigate(raw);
        return;
      }
      void run(raw);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);


  return (
    <>
      <div ref={page} className="overflow-x-clip">
        {children}
      </div>
      <div
        ref={overlay}
        aria-hidden
        className="pointer-events-none invisible fixed inset-0 z-[100] flex items-center justify-center opacity-0"
        style={{ perspective: 1600 }}
      >
        {["bg-yellow", "bg-ink outline-[3px] outline-white -outline-offset-[3px]", "bg-red"].map((c, i) => (
          <div
            key={i}
            data-panel
            className={`invisible absolute rounded-[24px] ${c}`}
          />
        ))}
      </div>
    </>
  );
}
