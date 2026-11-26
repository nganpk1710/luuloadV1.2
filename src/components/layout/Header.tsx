import Image from "next/image";
import Link from "next/link";
import { RollText } from "@/components/motion/RollText";
import { PillLink } from "@/components/ui/PillLink";
import { headerCta, navItems } from "@/content/home";

/** Header 1920 × 80. Container 1854px, logo trái, menu + CTA phải (Figma node 2727:1364). */
type HeaderProps = {
  /** light: chữ trắng trên nền tối (trang chủ). dark: chữ ink trên nền sáng (Community). */
  tone?: "light" | "dark";
  /** href của mục menu đang active (gạch chân đỏ). */
  active?: string;
};

export function Header({ tone = "light", active }: HeaderProps) {
  const dark = tone === "dark";
  return (
    <header className="absolute top-0 left-0 z-10 h-20 w-full">
      <div className="mx-auto flex h-full w-[1854px] items-center justify-between">
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
          <ul className={`flex items-center gap-[27px] font-display text-[24px] leading-[30px] font-bold whitespace-nowrap uppercase ${dark ? "text-ink" : "text-white"}`}>
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
          <PillLink href={headerCta.href} variant={dark ? "dark" : "light"} className={`w-[164px] ${dark ? "!h-10 !p-0" : ""}`}>
            {headerCta.label}
          </PillLink>
        </nav>
      </div>
    </header>
  );
}
