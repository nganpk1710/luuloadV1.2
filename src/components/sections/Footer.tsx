import Image from "next/image";
import Link from "next/link";
import { footer } from "@/content/sections";

const small = "absolute text-[14px] leading-[16.5px] font-normal whitespace-nowrap uppercase";

/** Footer 1920 × 900, nền ink (Figma node 2719:812). Wordmark vàng bị cắt ở đáy hộp 300px. */
export function Footer() {
  return (
    <footer className="relative h-[900px] w-[1920px] overflow-hidden bg-ink text-white">
      <Image
        src="/assets/footer/wordmark.svg"
        alt="Lưu Load"
        width={1856}
        height={300}
        className="absolute top-0 left-8 max-w-none"
      />
      <p className="text-trim absolute top-[403px] left-[27px] w-[557px] text-[24px] leading-[40px] font-medium uppercase">
        {footer.body}
      </p>

      {footer.columns.map((col) => (
        <div key={col.left}>
          <p className={`${small} top-[414px]`} style={{ left: col.left }}>{col.heading}</p>
          <nav
            className="absolute top-[486px] flex flex-col items-start font-display text-[24px] leading-normal font-bold uppercase"
            style={{ left: col.left, gap: col.gap }}
          >
            {col.links.map((l) => (
              <Link key={l.label} href={l.href} className="text-trim">{l.label}</Link>
            ))}
          </nav>
        </div>
      ))}

      <p className={`${small} top-[836px] left-8`}>{footer.copyright}</p>
      {footer.legal.map((l) => (
        <Link key={l.label} href={l.href} className={`${small} top-[836px]`} style={{ left: l.left }}>
          {l.label}
        </Link>
      ))}
    </footer>
  );
}
