"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RollText } from "@/components/motion/RollText";
import { PillLink } from "@/components/ui/PillLink";
import { headerCta, navItems } from "@/content/home";

type HeaderProps = {
  /** light: chữ trắng trên nền tối (trang chủ). dark: chữ ink trên nền sáng (Community). */
  tone?: "light" | "dark";
  /** href của mục menu đang active (gạch chân đỏ). */
  active?: string;
};

/**
 * Header 1920 × 95, container 1854px (Figma 2727:1364). Cố định trên đầu trang:
 * cuộn xuống thì ẩn, cuộn lên thì hiện lại với nền trắng (Figma Header_scrolling: logo, menu ink, CTA ink chữ vàng).
 */
export function Header({ tone = "light", active }: HeaderProps) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      if (Math.abs(dy) > 4) {
        setHidden(dy > 0 && y > 120);
        last = y;
      }
      setSolid(y > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = tone === "dark" || solid;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[translate,background-color] duration-[400ms] ease-[var(--ease-out)] ${hidden ? "-translate-y-full" : "translate-y-0"} ${solid ? "bg-white" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-[95px] w-[1854px] items-center justify-between">
        <Link href="/" aria-label="Lưu Load, về trang chủ" className="shrink-0">
          <Image
            src={dark ? "/assets/brand/logo-ink.svg" : "/assets/brand/logo.svg"}
            alt="Lưu Load"
            width={179}
            height={46}
            priority
          />
        </Link>

        <nav aria-label="Chính" className="flex items-center gap-11">
          <ul
            className={`flex items-center gap-[27px] font-display text-[24px] leading-[30px] font-bold whitespace-nowrap uppercase ${dark ? "text-ink" : "text-white"}`}
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active === item.href ? "page" : undefined}
                  className="text-trim group relative block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-yellow aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-2 aria-[current=page]:after:h-[3px] aria-[current=page]:after:bg-red"
                >
                  <RollText text={item.label} />
                </Link>
              </li>
            ))}
          </ul>
          <PillLink href={headerCta.href} variant={dark ? "ink" : "light"} className="w-[164px]">
            {headerCta.label}
          </PillLink>
        </nav>
      </div>
    </header>
  );
}
