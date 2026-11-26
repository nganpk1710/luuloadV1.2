import Link from "next/link";
import type { ComponentProps } from "react";

type PillLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
};

/** Nút CTA dạng pill: nền trắng, chữ ink, cao 40px (Figma node 2721:956). */
export function PillLink({ className = "", children, ...props }: PillLinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex h-10 items-center justify-center rounded-full bg-white px-6 py-3 font-display text-[24px] leading-[30px] font-bold whitespace-nowrap text-ink uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow ${className}`}
    >
      <span className="text-trim">{children}</span>
    </Link>
  );
}
