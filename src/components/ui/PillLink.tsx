import Link from "next/link";
import type { ComponentProps } from "react";

type PillLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
  /** light: nền trắng, cao 40px (header, Last CTA). dark: nền ink, padding 24px (các section nền trắng). */
  variant?: "light" | "dark";
};

const variants = {
  light: "h-10 bg-white px-6 py-3 text-ink",
  dark: "bg-ink p-6 text-white",
} as const;

/** Nút CTA dạng pill (Figma node 2721:956 và 2721:935). */
export function PillLink({ className = "", variant = "light", children, ...props }: PillLinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-full font-display text-[24px] leading-[30px] font-bold whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow ${variants[variant]} ${className}`}
    >
      <span className="text-trim">{children}</span>
    </Link>
  );
}
