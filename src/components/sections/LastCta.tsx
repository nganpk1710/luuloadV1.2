import { PillLink } from "@/components/ui/PillLink";
import { lastCta } from "@/content/sections";

const line =
  "text-trim absolute left-1/2 -translate-x-1/2 text-center font-display text-[240px] leading-[230px] font-extrabold whitespace-nowrap text-yellow uppercase";

/** Last CTA 1920 × 900, nền ink (Figma node 2719:784). */
export function LastCta() {
  return (
    <section aria-labelledby="last-cta-title" className="relative h-[900px] w-[1920px] overflow-hidden bg-ink">
      <h2 id="last-cta-title" className="sr-only">
        {lastCta.line1} {lastCta.line2}
      </h2>
      <p aria-hidden className={`${line} top-[122px]`}>{lastCta.line1}</p>
      <p aria-hidden className={`${line} top-[347px]`}>{lastCta.line2}</p>
      <p className="text-trim absolute top-[589px] left-[992px] w-[792px] -translate-x-1/2 text-center text-[24px] leading-[30px] font-medium text-white uppercase">
        {lastCta.body}
      </p>
      <PillLink href={lastCta.cta.href} className="absolute top-[754px] left-1/2 w-[164px] -translate-x-1/2">
        {lastCta.cta.label}
      </PillLink>
    </section>
  );
}
