import Image from "next/image";
import { breakSection } from "@/content/home";

const display =
  "text-trim absolute font-display text-[240px] leading-none font-extrabold whitespace-nowrap text-ink uppercase";
const label =
  "text-trim absolute text-[24px] leading-none font-medium whitespace-nowrap text-ink uppercase";

/** Break Section 1920 × 850, nền vàng (Figma node 2718:383). Toạ độ tuyệt đối ở 1920. */
export function BreakSection() {
  return (
    <section
      aria-labelledby="break-title"
      className="relative h-[850px] w-[1920px] overflow-hidden bg-yellow"
    >
      {/* Texture: Figma node 2727:1317, 2056 × 1156, multiply, opacity 10% */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-127.56px] left-[-68px] h-[1156.11px] w-[2056px] mix-blend-multiply"
      >
        <Image
          src="/assets/backgrounds/break-section-texture.png"
          alt=""
          fill
          sizes="2056px"
          className="object-cover opacity-10"
        />
      </div>

      <h2 id="break-title" className="sr-only">
        {breakSection.line1} {breakSection.line2} {breakSection.line3}
      </h2>

      <div aria-hidden>
        {/* Line 01 */}
        <div className="absolute top-[137px] left-[189px] h-[149px] w-[1612px]">
          <Image
            src="/assets/break/dot-square.svg"
            alt=""
            width={78}
            height={78}
            className="absolute top-0 left-0"
          />
          <Image
            src="/assets/break/dot-minus.svg"
            alt=""
            width={78}
            height={78}
            className="absolute top-0 left-[88.46px]"
          />
          <p className={`${display} top-0 left-[264px]`}>{breakSection.line1}</p>
        </div>

        {/* Line 02 */}
        <div className="absolute top-[355px] left-[189px] h-[158px] w-[1612px]">
          <p className={`${label} top-0 left-0`}>{breakSection.labelTop}</p>
          <p className={`${label} top-[137px] left-[184px]`}>{breakSection.labelBottom}</p>
          <p className={`${display} top-[9px] left-[493px]`}>{breakSection.line2}</p>
          <div className="absolute top-[17px] left-[1018px] h-[137px] w-[594px] rounded-tl-[80px] rounded-tr-[999px] rounded-br-[999px] bg-ink" />
        </div>

        {/* Line 03 */}
        <div className="absolute top-[577px] left-[189px] h-[160px] w-[1623px]">
          <p className={`${display} top-0 left-0`}>{breakSection.line3}</p>
          <Image
            src="/assets/break/star.svg"
            alt=""
            width={160}
            height={160}
            className="absolute top-0 left-[672px]"
          />
          <div className="absolute top-px left-[857px] h-[158px] w-[288px] border-[10px] border-ink" />
          <p className="text-trim absolute top-[79px] left-[1345px] w-[278px] text-[24px] leading-[29px] font-medium text-ink uppercase">
            {breakSection.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
