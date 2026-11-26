import Image from "next/image";
import { PillLink } from "@/components/ui/PillLink";
import { community } from "@/content/sections";

const heading =
  "text-trim absolute top-[136.26px] -translate-x-1/2 font-display text-[248.834px] leading-[111.221px] font-extrabold whitespace-nowrap uppercase";
const paragraph = "text-trim absolute top-[343px] text-[24px] leading-[30px] font-medium whitespace-pre-wrap uppercase";

/** Community 1920 × 1180 (Figma node 2718:653). */
export function Community() {
  return (
    <section aria-labelledby="community-title" className="relative h-[1180px] w-[1920px] overflow-hidden bg-white text-ink">
      <h2 id="community-title" className="sr-only">
        {community.title} xã {community.title}
      </h2>
      <div aria-hidden>
        <p className={`${heading} left-[418px]`}>{community.title}</p>
        <p className={`${heading} left-[1492px]`}>{community.title}</p>
        {/* Glyph "XA" đỏ: cùng file 04-red, hộp vuông 126.48px (tỉ lệ 0.4517 so với 280px) */}
        <Image
          src="/assets/slider/04-red.svg"
          alt=""
          width={126}
          height={126}
          className="absolute top-[149.63px] left-[899px] max-w-none"
        />
      </div>

      <p className={`${paragraph} left-8 w-[356px]`}>{community.paragraphLeft}</p>
      <p className={`${paragraph} left-[410px] w-[403px]`}>{community.paragraphRight}</p>
      <PillLink variant="dark" href={community.cta.href} className="absolute top-[417px] left-[1113px] w-[183px]">
        {community.cta.label}
      </PillLink>

      {community.cards.map((c) => (
        <article
          key={c.index}
          className={`absolute h-[525px] w-[442px] rounded-[20px] border-[20px] border-solid bg-ink font-display font-bold text-white ${c.border}`}
          style={{ left: c.left, top: c.top }}
        >
          <p className="text-trim absolute top-[62px] left-[35px] text-[24px] leading-[40px] whitespace-nowrap">{c.index}</p>
          <h3 className={`text-trim absolute left-[35px] w-[265px] uppercase ${c.size}`} style={{ top: c.titleTop }}>
            {c.title}
          </h3>
        </article>
      ))}
    </section>
  );
}
