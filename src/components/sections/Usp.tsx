import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PillLink } from "@/components/ui/PillLink";
import { usp } from "@/content/sections";

/** USP 1920 × 1105 (Figma node 2718:485): tiêu đề trên, 3 cột Vision / Mission / Core Value dưới. */
export function Usp() {
  return (
    <section aria-labelledby="usp-title" className="relative h-[1105px] w-[1920px] overflow-hidden bg-white text-ink">
      <h2
        id="usp-title"
        className="text-trim absolute top-[130px] left-8 w-[472px] font-display text-[120px] leading-[107.273px] font-extrabold uppercase"
      >
        {usp.title}
      </h2>
      <p className="text-trim absolute top-[207px] left-[661px] w-[440px] text-[24px] leading-[30px] font-medium uppercase">
        {usp.body}
      </p>
      <PillLink variant="dark" href={usp.cta.href} className="absolute top-[254px] left-[1448px] w-[164px] !font-body !text-[18px]">
        {usp.cta.label}
      </PillLink>

      <Reveal amount={0.2} className="absolute top-[451px] left-0 flex h-[654px] w-[1920px]">
        {usp.pillars.map((p, i) => (
          <div key={p.id} data-reveal style={{ "--d": i * 120 } as CSSProperties} className="usp-card group w-[640px]">
            <div className={`relative h-[95px] overflow-hidden ${p.head}`}>
              <div className="absolute top-1/2 left-8 flex w-[581px] -translate-y-1/2 items-center justify-between font-display text-[40px] leading-normal font-bold whitespace-nowrap uppercase">
                <span className="text-trim">{p.index}</span>
                <span className="text-trim">{p.label}</span>
              </div>
            </div>
            <div className={`relative h-[559px] overflow-hidden ${p.body}`}>
              {p.id === "vision" && (
                <Image src="/assets/usp/stripes.svg" alt="" width={640} height={559} className="absolute top-0 left-0 max-w-none" />
              )}
              <div className={`usp-ring absolute top-[52px] left-[92px] size-[456px] rounded-full ${p.outer}`} />
              <div
                className={`usp-core absolute top-[99px] left-[139px] size-[362px] rounded-full ${p.inner} ${p.id === "vision" ? "" : "!top-[118px] !left-[158px] !size-[324px]"}`}
              />
              {p.id === "vision" && (
                <div className="absolute top-[206px] left-[225px] flex w-[189px] flex-col items-center gap-[46px]">
                  <Image src="/assets/usp/brush.svg" alt="" width={65} height={65} className="usp-icon" />
                  <span className="block overflow-hidden py-[0.25em] -my-[0.25em]">
                    <span className="usp-label text-trim block font-display text-[60px] leading-[107.273px] font-extrabold uppercase">
                      {usp.visionCenter}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
