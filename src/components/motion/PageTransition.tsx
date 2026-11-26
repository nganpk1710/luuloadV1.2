"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pageZoom, prefersReducedMotion } from "@/lib/motion";

/**
 * Page transition kiểu slush.app (MOTION mục 11, chốt lần 3 · 26.11):
 * 1. Trang hiện tại thu nhỏ thành tấm giữa (viền trắng), tấm vàng bên trái và đỏ bên phải bay vào, cùng kích thước.
 * 2. Cả dải (vàng · trang cũ · đỏ · vàng · trang mới · đỏ) trượt sang trái; tấm lệch tâm nghiêng 3D theo vị trí.
 *    Trang mới được nạp trong lúc trượt, hiện trong tấm giữa.
 * 3. Tấm giữa phóng to phủ kín màn hình.
 */
const CARD = 0.34; // tỉ lệ tấm so với viewport
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
    const h = vh * CARD;
    const step = w + GAP;
    const [y1, r1, y2, black, r2, frame] = Array.from(ov.querySelectorAll<HTMLElement>("[data-panel]"));
    const lenis = window.__lenis;
    lenis?.stop();

    // Dải: vàng · TRANG CŨ · đỏ · vàng · TRANG MỚI · đỏ. Tấm nào lệch tâm thì nghiêng 3D theo vị trí.
    const slots: [HTMLElement, number][] = [
      [y1, -step],
      [r1, step],
      [y2, 2 * step],
      [black, 3 * step],
      [r2, 4 * step],
    ];
    const tilt = (x: number) => -Math.max(-1, Math.min(1, x / step)) * TILT;
    gsap.set([y1, r1, y2, black, r2, frame], { width: w, height: h, autoAlpha: 1, scale: 1 });
    gsap.set(el, { transformOrigin: `50% ${window.scrollY / zoom + vh / 2}px`, transformPerspective: 1600 });
    gsap.set(ov, { autoAlpha: 1 });
    // Cắt trang theo đúng khung viewport để tấm giữa có cùng tỉ lệ với các tấm màu.
    const clipTo = (scrollTop: number) => {
      const docH = el.scrollHeight;
      const top = scrollTop / zoom;
      const bottom = Math.max(0, docH - top - vh);
      gsap.set(el, { clipPath: `inset(${top}px 0px ${bottom}px 0px round ${24 / CARD}px)` });
    };
    clipTo(window.scrollY);

    const strip = { s: 0, open: 0 };
    const frameScale = { v: 1 / CARD };
    let swapped = false;
    const layout = () => {
      // open: 0 → 1 đưa 2 tấm bên cạnh từ ngoài màn hình vào chỗ
      for (const [node, base] of slots) {
        const x = base - strip.s + (base === -step ? -(1 - strip.open) * vw : base === step ? (1 - strip.open) * vw : 0);
        gsap.set(node, { x, rotateY: tilt(x) });
      }
      const pageX = (swapped ? 3 * step : 0) - strip.s;
      gsap.set(el, { x: pageX, rotateY: tilt(pageX) });
      gsap.set(frame, { x: pageX, rotateY: tilt(pageX), scale: frameScale.v });
    };
    layout();

    // 1. Trang hiện tại thu nhỏ thành tấm giữa, viền trắng; vàng và đỏ bay vào hai bên.
    await gsap
      .timeline({ onUpdate: layout })
      .to(el, { scale: CARD, duration: 0.4, ease: "power2.inOut" }, 0)
      .fromTo(frameScale, { v: 1 / CARD }, { v: 1, duration: 0.4, ease: "power2.inOut" }, 0)
      .fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.15)
      .to(strip, { open: 1, duration: 0.4, ease: "power2.out" }, 0);

    // 2. Dải trượt sang trái 3 ô. Qua nửa đường thì nạp trang mới vào tấm bên phải.
    const arrivedP = new Promise<void>((res) => (arrived.current = res));
    let navigated = false;
    await gsap.to(strip, {
      s: 3 * step,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        if (!navigated && strip.s > 1.2 * step) {
          navigated = true;
          gsap.set(el, { autoAlpha: 0 });
          navigate(href);
        }
        layout();
      },
    });
    await Promise.race([arrivedP, new Promise((r) => setTimeout(r, 1500))]);

    // Trang mới đã render: đặt vào tấm giữa (thay tấm đen), về đầu trang.
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
    swapped = true;
    gsap.set(el, { transformOrigin: `50% ${vh / 2}px` });
    clipTo(0);
    layout();
    await gsap.to(el, { autoAlpha: 1, duration: 0.2 });
    gsap.set(black, { autoAlpha: 0 });

    // 3. Tấm giữa phóng to phủ kín màn hình.
    await gsap
      .timeline()
      .to(el, { scale: 1, duration: 0.45, ease: "power2.inOut" }, 0)
      .to(frameScale, { v: 1 / CARD, duration: 0.45, ease: "power2.inOut", onUpdate: () => gsap.set(frame, { scale: frameScale.v }) }, 0)
      .to(frame, { autoAlpha: 0, duration: 0.2 }, 0.25)
      .to([y2, r2], { x: (i) => (i === 0 ? -vw : vw), autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 0);

    gsap.set(el, { clearProps: "transform,clipPath,transformOrigin,opacity,visibility" });
    gsap.set(ov, { autoAlpha: 0 });
    gsap.set([y1, r1, y2, black, r2, frame], { clearProps: "all" });
    ScrollTrigger.refresh();
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
        {[
          "bg-yellow",
          "bg-red",
          "bg-yellow",
          "bg-ink outline-[3px] outline-white -outline-offset-[3px]",
          "bg-red",
          "z-10 outline-[3px] outline-white -outline-offset-[3px]", // viền trắng bám theo tấm trang
        ].map((c, i) => (
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
