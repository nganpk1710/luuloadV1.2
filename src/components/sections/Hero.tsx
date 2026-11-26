import Image from "next/image";
import { hero, heroMarquee } from "@/content/home";

/**
 * Hero 1920 × 1680 (Figma node 2721:1000). Dựng theo toạ độ tuyệt đối ở breakpoint 1920.
 * Các breakpoint khác sẽ bổ sung sau khi có thiết kế.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative h-[1680px] w-[1920px] overflow-hidden bg-ink"
    >
      {/*
        Lưới nền: Figma đặt 2 lớp ảnh (node 2721:1004 và 2727:1151), cover. PNG gốc rất tối (tối đa 16/255),
        nên đo lại theo ảnh Figma: lớp đen 10% làm nền (13/255) + đường lưới hiện lên bằng screen 50% (~22/255).
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/10">
        {[0, 1098].map((top) => (
          <div
            key={top}
            className="absolute left-0 h-[1097.5px] w-[1920px] bg-[url('/assets/backgrounds/grid-background.png')] bg-[length:1920px_900px] bg-repeat-y opacity-50 mix-blend-screen"
            style={{ top }}
          />
        ))}
      </div>

      {/* Big title */}
      <h1
        id="hero-title"
        className="absolute top-[174px] left-8 h-[320px] w-[1856px] font-display whitespace-nowrap text-yellow uppercase"
      >
        <span className="text-trim absolute top-0 left-[587px] text-[225px] leading-none font-medium">
          {hero.lead}
        </span>
        {/* Glyph "XA": cùng file 04-yellow, hộp vuông 177.7px, chữ cao 145.9px nằm giữa hộp */}
        <Image
          src="/assets/slider/04-yellow.svg"
          alt=""
          width={178}
          height={178}
          className="absolute top-[158px] left-[839px] max-w-none"
          priority
        />
        <span className="text-trim absolute top-[171px] left-0 text-[240px] leading-none font-extrabold">
          {hero.left}
        </span>
        <span className="text-trim absolute top-[171px] left-[1175px] text-[240px] leading-none font-extrabold">
          {hero.right}
        </span>
      </h1>

      {/* Subtitle */}
      <div className="absolute top-[575px] left-[575px] h-[83px] w-[836px] text-[24px] leading-[29px] font-medium text-white uppercase">
        <p className="text-trim absolute top-0 left-0 w-[341px]">{hero.subtitleLeft}</p>
        <p className="text-trim absolute top-2 left-[491px] w-[345px]">{hero.subtitleRight}</p>
      </div>

      {/* Under info */}
      <div className="absolute top-[840px] left-8 flex w-[1856px] items-center justify-between">
        <p className="text-trim text-[14px] leading-none font-medium text-white uppercase">
          {hero.scrollHint}
        </p>
        <Image src="/assets/ui/arrow-down.svg" alt="" width={48} height={48} />
      </div>

      {/* Marquee icon */}
      <div aria-hidden>
        {heroMarquee.map((icon) => (
          <Image
            key={icon.id}
            src={icon.src}
            alt=""
            width={icon.size}
            height={icon.size}
            className="absolute max-w-none"
            style={{ left: icon.left, top: icon.top }}
          />
        ))}
        {/* Vòm rỗng viền vàng, giữa hàng icon (Figma node 2727:1131) */}
        <div className="absolute top-[1328px] left-[820px] h-[230.765px] w-[281px] rounded-t-[999px] border-[20px] border-yellow" />
      </div>
    </section>
  );
}
