"use client";

import { useEffect, useRef, useState, type ElementType, type ComponentPropsWithoutRef } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Tỉ lệ phần tử phải vào viewport trước khi hiện. */
  amount?: number;
} & ComponentPropsWithoutRef<T>;

/**
 * Gắn `data-shown` khi phần tử vào viewport (một lần). Con có `data-reveal` sẽ trượt lên + hiện dần (CSS trong globals).
 * Dùng `style={{"--d": 120}}` trên con để tạo stagger (ms).
 */
export function Reveal<T extends ElementType = "div">({ as, amount = 0.25, ...props }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
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
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return <Tag ref={ref} data-shown={shown ? "" : undefined} {...props} />;
}
