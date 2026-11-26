import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { communityGroups, communityGroupsLink } from "@/content/community";

const tones = {
  red: { fill: "bg-red", hoverText: "group-hover:text-white", num: "text-red", icon: "/assets/slider/01-yellow.svg" },
  yellow: { fill: "bg-yellow", hoverText: "", num: "text-ink", icon: "/assets/slider/02-blue.svg" },
  blue: { fill: "bg-blue", hoverText: "group-hover:text-white", num: "text-blue", icon: "/assets/slider/03-yellow.svg" },
  amber: { fill: "bg-amber", hoverText: "", num: "text-amber", icon: "/assets/slider/04-red.svg" },
} as const;

/** Danh sách 4 nhóm (MOTION mục 13 · 3): hover hàng thì nền đổ màu nhóm từ dưới lên, thumbnail mở ra, mũi tên dịch. */
export function CommunityGroups() {
  return (
    <Reveal as="section" amount={0.15} aria-label="Bốn nhóm cộng đồng" className="relative w-[1920px] bg-white text-ink">
      <ul className="border-b border-ink/15">
        {communityGroups.map((g, i) => {
          const t = tones[g.tone];
          return (
            <li key={g.slug} data-reveal style={{ "--d": i * 100, "--reveal-y": "40px" } as CSSProperties} className="border-t border-ink/15">
              <Link
                id={g.slug}
                href={`#${g.slug}`}
                className={`group relative block h-[292px] overflow-hidden transition-colors duration-300 ${t.hoverText}`}
              >
                <span aria-hidden className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[350ms] ease-[var(--ease-out)] group-hover:scale-y-100 ${t.fill}`} />
                <span className={`text-trim absolute top-[56px] left-8 font-display text-[200px] leading-none font-extrabold transition-colors duration-300 ${t.num} group-hover:text-current`}>
                  {g.no}
                </span>
                <span className="text-trim absolute top-[60px] left-[502px] font-display text-[64px] leading-none font-bold uppercase">
                  {g.name}
                </span>
                <span className="text-trim absolute top-[150px] left-[502px] w-[440px] text-[20px] leading-[30px] font-normal">
                  {g.body}
                </span>
                <span className="text-trim underline-link absolute top-[236px] left-[502px] text-[16px] leading-none font-bold">
                  {communityGroupsLink}
                </span>

                {/* Thumbnail (placeholder): ink + shape thương hiệu, mở từ giữa khi hover */}
                <span
                  aria-hidden
                  className="absolute top-[46px] left-[1180px] flex h-[200px] w-[320px] items-center justify-center bg-ink transition-[clip-path] duration-[450ms] ease-[var(--ease-out)] [clip-path:inset(50%_50%_50%_50%)] group-hover:[clip-path:inset(0%_0%_0%_0%)]"
                >
                  <Image src={t.icon} alt="" width={150} height={150} />
                </span>

                <svg
                  aria-hidden
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  className="absolute top-[60px] right-8 transition-transform duration-[350ms] ease-[var(--ease-spring)] group-hover:translate-x-3 group-hover:-rotate-45"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
