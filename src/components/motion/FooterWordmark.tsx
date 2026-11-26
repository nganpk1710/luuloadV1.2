"use client";

import { useEffect, useRef, useState } from "react";
import { wordmarkGlyphs } from "@/content/wordmark";

/**
 * Wordmark footer roll một lần khi vào viewport (MOTION mục 9):
 * 7 ký tự trồi lên từ đáy khung 300px, mỗi ký tự 320ms ease-out, stagger 25ms (tổng ≈ 0.5s).
 */
export function FooterWordmark({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <svg
      ref={ref}
      role="img"
      aria-label="Lưu Load"
      width={1856}
      height={300}
      viewBox="0 0 1856 300"
      className={`wordmark ${className}`}
      data-shown={shown ? "" : undefined}
    >
      {wordmarkGlyphs.map((g, i) => (
        <g key={i} className="wordmark-glyph" style={{ transitionDelay: `${i * 25}ms` }}>
          {g.paths.map((d, j) => (
            <path key={j} d={d} fill="var(--color-yellow)" />
          ))}
        </g>
      ))}
    </svg>
  );
}
