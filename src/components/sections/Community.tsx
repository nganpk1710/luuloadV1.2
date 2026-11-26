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

      {community.cards.map((c) => {
        const front = (
          <>
            <p className="text-trim absolute top-[62px] left-[35px] text-[24px] leading-[40px] whitespace-nowrap">{c.index}</p>
            <h3 className={`text-trim absolute left-[35px] w-[265px] uppercase ${c.size}`} style={{ top: c.titleTop }}>
              {c.title}
            </h3>
          </>
        );
        const face = `absolute inset-0 rounded-[20px] border-[20px] border-solid bg-ink font-display font-bold text-white ${c.border}`;
        if (!("pattern" in c)) {
          return (
            <article key={c.index} className={`absolute h-[525px] w-[442px] ${face.replace("absolute inset-0 ", "")}`} style={{ left: c.left, top: c.top }}>
              {front}
            </article>
          );
        }
        return (
          <article
            key={c.index}
            tabIndex={0}
            aria-label={`${c.title}: di chuột hoặc nhấn để lật`}
            className="flip-card absolute h-[525px] w-[442px] outline-none"
            style={{ left: c.left, top: c.top }}
          >
            <div className="flip-inner absolute inset-0">
              <div className={`flip-face ${face}`}>{front}</div>
              <div aria-hidden className={`flip-face flip-back overflow-hidden ${face}`}>
                <div className="absolute inset-0 flex flex-col justify-center gap-0 overflow-hidden">
                  {[0, 1, 2, 3, 4].map((r) => (
                    <div key={r} className={`flip-row ${r % 2 ? "flip-row-right" : ""}`} style={{ animationDelay: `-${r * 3.7}s` }}>
                      {[0, 1].map((k) => (
                        <span key={k} className="shrink-0 pr-8 font-display text-[110px] leading-[96px] font-extrabold whitespace-nowrap text-white/18 uppercase">
                          {c.pattern}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <Image src={c.icon} alt="" width={279} height={123} className="flip-icon absolute top-1/2 left-1/2 -mt-[61.5px] -ml-[139.5px] max-w-none" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
