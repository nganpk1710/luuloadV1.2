import { hashtag } from "@/content/sections";

const tones = {
  yellow: "bg-yellow text-ink h-[140px]",
  red: "bg-red text-white h-[140px]",
} as const;

/** Hashtag 1920 × 598 (Figma node 2718:594): 2 hàng pill 912 × 140, so le nhau. */
export function Hashtag() {
  return (
    <section aria-label={hashtag.text} className="relative h-[598px] w-[1920px] overflow-hidden bg-white">
      {hashtag.pills.map((p) => (
        <div
          key={`${p.left}-${p.top}`}
          aria-hidden
          className={`absolute w-[912px] overflow-hidden rounded-[20px] ${tones[p.tone]}`}
          style={{ left: p.left, top: p.top }}
        >
          <p className="text-trim absolute top-[45px] left-[222px] font-display text-[80px] leading-[107.273px] font-extrabold whitespace-nowrap uppercase">
            {hashtag.text}
          </p>
        </div>
      ))}
      <p className="sr-only">{hashtag.text}</p>
    </section>
  );
}
