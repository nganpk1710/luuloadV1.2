import Image from "next/image";
import Link from "next/link";
import { PillLink } from "@/components/ui/PillLink";
import { headerCta, navItems } from "@/content/home";

/** Header 1920 × 80. Container 1854px, logo trái, menu + CTA phải (Figma node 2727:1364). */
export function Header() {
  return (
    <header className="absolute top-0 left-0 z-10 h-20 w-full">
      <div className="mx-auto flex h-full w-[1854px] items-center justify-between">
        <Link href="/" aria-label="Lưu Load, về trang chủ" className="shrink-0">
          <Image
            src="/assets/brand/logo.svg"
            alt="Lưu Load"
            width={179}
            height={46}
            priority
          />
        </Link>

        <nav aria-label="Chính" className="flex items-center gap-11">
          <ul className="flex items-center gap-[27px] font-display text-[24px] leading-[30px] font-bold whitespace-nowrap text-white uppercase">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-trim block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-yellow"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <PillLink href={headerCta.href} className="w-[164px]">
            {headerCta.label}
          </PillLink>
        </nav>
      </div>
    </header>
  );
}
