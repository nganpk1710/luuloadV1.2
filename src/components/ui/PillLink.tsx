import Link from "next/link";
import type { ComponentProps } from "react";

type PillLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
  /**
   * light: trắng → hover vàng, chữ ink (Header, Last CTA).
   * dark: ink → hover trắng viền ink, chữ ink (các section nền trắng).
   */
  variant?: "light" | "dark" | "ink";
};

const variants = {
  light: { box: "h-10 px-6 py-3", front: "bg-white text-ink", back: "bg-yellow text-ink" },
  dark: { box: "border-2 border-ink p-[22px]", front: "bg-ink text-white", back: "bg-white text-ink" },
  /** Header khi cuộn (nền trắng): ink chữ vàng, cao 40px → hover trắng viền ink. */
  ink: { box: "h-10 border-2 border-ink px-6", front: "bg-ink text-yellow", back: "bg-white text-ink" },
} as const;

/**
 * CTA dạng roll pill theo slush.app (MOTION mục 2): hover thì mặt trước bị ép dẹt và đẩy lên,
 * mặt sau trồi lên từ dưới với overshoot nhẹ. CSS thuần, không cần JS.
 */
export function PillLink({ className = "", variant = "light", children, ...props }: PillLinkProps) {
  const v = variants[variant];
  return (
    <Link
      {...props}
      className={`roll-pill group relative inline-flex items-center justify-center overflow-hidden rounded-full font-display text-[24px] leading-[30px] font-bold whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow ${v.box} ${className}`}
    >
      <span className="text-trim invisible">{children}</span>
      <span aria-hidden className={`roll-pill-face roll-pill-front ${v.front}`}>
        <span className="text-trim">{children}</span>
      </span>
      <span aria-hidden className={`roll-pill-face roll-pill-back ${v.back}`}>
        <span className="text-trim">{children}</span>
      </span>
    </Link>
  );
}
