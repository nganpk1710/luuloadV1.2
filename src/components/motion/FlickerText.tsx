"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Độ trễ "ngẫu nhiên" nhưng cố định theo vị trí (giống nhau giữa server và client). */
const jitter = (i: number, seed: number) => ((i * 7919 + seed * 104729) % 97) / 97;

/**
 * Flicker text (theo therechabite.com.au): khi vào viewport, từng ký tự hiện mờ rồi nhấp nháy
 * vài lần trước khi sáng hẳn, mỗi ký tự lệch thời gian ngẫu nhiên. Chạy một lần.
 */
export function FlickerText({
  text,
  className = "",
  seed = 1,
  spread = 900,
}: {
  text: string;
  className?: string;
  seed?: number;
  /** khoảng thời gian (ms) các ký tự bắt đầu nhấp nháy */
  spread?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
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
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={`flicker ${className}`} data-shown={shown ? "" : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {Array.from(text).map((c, i) =>
          c === " " ? (
            " "
          ) : (
            <span key={i} className="flicker-char" style={{ "--d": `${Math.round(jitter(i, seed) * spread)}ms` } as CSSProperties}>
              {c}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
